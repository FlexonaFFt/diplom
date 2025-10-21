from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base


class Case(Base):
    __tablename__ = "cases"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    tests = relationship(
        "TestCase",
        back_populates="case",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )
    submissions = relationship("Submission", back_populates="case")


class TestCase(Base):
    __tablename__ = "test_cases"

    id = Column(Integer, primary_key=True, index=True)
    case_id = Column(
        Integer,
        ForeignKey("cases.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    input_text = Column(Text, nullable=False)
    expected_text = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    case = relationship("Case", back_populates="tests")


class Submission(Base):
    __tablename__ = "submissions"

    id = Column(Integer, primary_key=True, index=True)
    case_id = Column(Integer, ForeignKey("cases.id", ondelete="SET NULL"))
    language = Column(String(32), nullable=False)
    code = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    total_time_ms = Column(Integer)
    verdict = Column(String(32))

    case = relationship("Case", back_populates="submissions")
    tests = relationship(
        "SubmissionTest",
        back_populates="submission",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )


class SubmissionTest(Base):
    __tablename__ = "submission_tests"

    id = Column(Integer, primary_key=True, index=True)
    submission_id = Column(
        Integer,
        ForeignKey("submissions.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    test_case_id = Column(
        Integer,
        ForeignKey("test_cases.id", ondelete="CASCADE"),
        nullable=False,
    )
    status = Column(String(32), nullable=False)
    time_ms = Column(Integer, nullable=False)
    actual_text = Column(Text, nullable=False)
    passed = Column(Boolean, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    submission = relationship("Submission", back_populates="tests")
