from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from sqlalchemy.orm import Session
from typing import List
import os
from ....db.database import get_db
from ....models import models
from ....core import security
from ....services import document_processor
from ....schemas import document as document_schemas

router = APIRouter()

@router.post("/upload", response_model=document_schemas.Document)
async def upload_document(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(security.get_current_user)
):
    """
    Upload a new document for processing.
    Supports PDF, Word, Excel, and text files.
    """
    # Validate file type
    allowed_types = {
        'application/pdf': 'pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
        'text/plain': 'txt'
    }
    
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File type not supported"
        )
    
    # Create upload directory if it doesn't exist
    upload_dir = os.getenv("UPLOAD_DIRECTORY", "uploads/")
    os.makedirs(upload_dir, exist_ok=True)
    
    # Save file
    file_type = allowed_types[file.content_type]
    file_path = f"{upload_dir}/{file.filename}"
    
    with open(file_path, "wb+") as file_object:
        file_object.write(await file.read())
    
    # Create document record
    db_document = models.Document(
        title=file.filename,
        file_path=file_path,
        file_type=file_type,
        uploaded_by=current_user.id
    )
    db.add(db_document)
    db.commit()
    db.refresh(db_document)
    
    # Process document asynchronously
    document_processor.process_document.delay(db_document.id)
    
    return db_document

@router.get("/", response_model=List[document_schemas.Document])
def get_documents(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(security.get_current_user)
):
    """
    Retrieve all documents uploaded by the current user.
    """
    documents = db.query(models.Document)\
        .filter(models.Document.uploaded_by == current_user.id)\
        .offset(skip)\
        .limit(limit)\
        .all()
    return documents

@router.get("/{document_id}", response_model=document_schemas.DocumentDetail)
def get_document(
    document_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(security.get_current_user)
):
    """
    Retrieve a specific document by ID.
    """
    document = db.query(models.Document)\
        .filter(models.Document.id == document_id)\
        .filter(models.Document.uploaded_by == current_user.id)\
        .first()
    
    if document is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found"
        )
    
    return document
