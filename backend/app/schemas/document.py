from pydantic import BaseModel
from typing import Optional, List, Dict
from datetime import datetime

class DocumentBase(BaseModel):
    title: str
    file_type: str

class DocumentCreate(DocumentBase):
    pass

class Document(DocumentBase):
    id: int
    file_path: str
    uploaded_by: int
    uploaded_at: datetime
    processed: bool
    metadata: Optional[Dict]

    class Config:
        orm_mode = True

class QuestionBase(BaseModel):
    text: str
    context: str
    page_number: Optional[int]
    confidence_score: float

class Question(QuestionBase):
    id: int
    document_id: int
    created_at: datetime

    class Config:
        orm_mode = True

class DocumentDetail(Document):
    questions: List[Question]
