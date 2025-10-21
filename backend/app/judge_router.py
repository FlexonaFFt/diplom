from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.auth import get_current_user
from app.config import settings
from app.database import User, get_db
from app import judge_models as models
from app.judge_runner import run_python_in_sandbox
from app.judge_schemas import CaseCreate, CaseOut, SubmissionOut, SubmitIn

router = APIRouter(tags=["Judge"])


def parse_numbers(text: str) -> List[float]:
    tokens = text.strip().split()
    values: List[float] = []
    for token in tokens:
        values.append(float(token.replace(",", ".")))
    return values


def compare_outputs(actual: str, expected: str, eps: float = 1e-6) -> bool:
    try:
        actual_numbers = parse_numbers(actual)
        expected_numbers = parse_numbers(expected)
    except Exception:
        return False

    if len(actual_numbers) != len(expected_numbers):
        return False

    for left, right in zip(actual_numbers, expected_numbers):
        if abs(left - right) > eps:
            return False

    return True


@router.post("/cases", response_model=CaseOut, status_code=status.HTTP_201_CREATED)
def create_case(
    payload: CaseCreate,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
):
    case = models.Case(title=payload.title, description=payload.description)
    db.add(case)
    db.flush()

    for test in payload.tests:
        db.add(
            models.TestCase(
                case_id=case.id,
                input_text=test.input_text,
                expected_text=test.expected_text,
            )
        )

    db.commit()
    db.refresh(case)
    return case


@router.get("/cases", response_model=List[CaseOut])
def list_cases(db: Session = Depends(get_db)):
    rows = db.scalars(select(models.Case)).all()
    return rows


@router.get("/cases/{case_id}", response_model=CaseOut)
def get_case(case_id: int, db: Session = Depends(get_db)):
    case = db.get(models.Case, case_id)
    if case is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Case not found")
    return case


@router.post("/submit", response_model=SubmissionOut)
def submit_solution(
    payload: SubmitIn,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
):
    case = db.get(models.Case, payload.case_id)
    if case is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Case not found")

    if payload.language.lower() != "python":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only python is supported in MVP",
        )

    submission = models.Submission(case_id=case.id, code=payload.code, language="python")
    db.add(submission)
    db.flush()

    total_time_ms = 0
    all_passed = True
    any_error = False

    for test_case in case.tests:
        result_status, stdout_text, _stderr_text, elapsed_ms, _exit_code = run_python_in_sandbox(
            payload.code,
            test_case.input_text,
            settings.PER_TEST_TIMEOUT_SEC,
        )
        total_time_ms += elapsed_ms
        passed = result_status == "ok" and compare_outputs(stdout_text, test_case.expected_text)
        verdict = "ok" if passed else result_status if result_status != "ok" else "wrong_answer"

        if not passed:
            all_passed = False
        if result_status != "ok":
            any_error = True

        db.add(
            models.SubmissionTest(
                submission_id=submission.id,
                test_case_id=test_case.id,
                status=verdict,
                time_ms=elapsed_ms,
                actual_text=stdout_text.strip(),
                passed=passed,
            )
        )

    submission.total_time_ms = total_time_ms
    submission.verdict = "accepted" if all_passed else ("error" if any_error else "failed")

    db.commit()
    db.refresh(submission)

    tests = db.scalars(
        select(models.SubmissionTest).where(models.SubmissionTest.submission_id == submission.id)
    ).all()
    submission.tests = tests

    return submission


@router.get("/submissions/{submission_id}", response_model=SubmissionOut)
def get_submission(
    submission_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
):
    submission = db.get(models.Submission, submission_id)
    if submission is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Submission not found",
        )

    tests = db.scalars(
        select(models.SubmissionTest).where(models.SubmissionTest.submission_id == submission.id)
    ).all()
    submission.tests = tests
    return submission


@router.get("/submissions", response_model=List[SubmissionOut])
def list_submissions(
    case_id: Optional[int] = None,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
):
    query = select(models.Submission)
    if case_id is not None:
        query = query.where(models.Submission.case_id == case_id)
    submissions = db.scalars(query).all()

    for submission in submissions:
        submission.tests = db.scalars(
            select(models.SubmissionTest).where(models.SubmissionTest.submission_id == submission.id)
        ).all()

    return submissions
