from typing import List, Optional

from pydantic import BaseModel, Field


class TestCaseIn(BaseModel):
    input_text: str = Field(min_length=1)
    expected_text: str = Field(min_length=1)


class CaseCreate(BaseModel):
    title: str = Field(min_length=1)
    description: str = Field(min_length=1)
    tests: List[TestCaseIn]


class TestCaseOut(BaseModel):
    id: int
    input_text: str
    expected_text: str

    class Config:
        orm_mode = True


class CaseOut(BaseModel):
    id: int
    title: str
    description: str
    tests: List[TestCaseOut]

    class Config:
        orm_mode = True


class SubmitIn(BaseModel):
    case_id: int
    language: str
    code: str


class SubmissionTestOut(BaseModel):
    id: int
    test_case_id: int
    status: str
    time_ms: int
    actual_text: str
    passed: bool

    class Config:
        orm_mode = True


class SubmissionOut(BaseModel):
    id: int
    case_id: Optional[int]
    language: str
    total_time_ms: Optional[int]
    verdict: Optional[str]
    tests: List[SubmissionTestOut]

    class Config:
        orm_mode = True
