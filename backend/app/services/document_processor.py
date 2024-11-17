from typing import List, Dict
import os
from langchain.document_loaders import (
    PyPDFLoader,
    Docx2txtLoader,
    UnstructuredExcelLoader,
    TextLoader
)
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import Chroma
from langchain.chains import LLMChain
from langchain.prompts import PromptTemplate
from langchain.chat_models import ChatOpenAI
from sqlalchemy.orm import Session
from ..models.models import Document, Question
from ..db.database import SessionLocal

# Question extraction prompt
QUESTION_EXTRACTION_PROMPT = """
You are an expert at analyzing RFI (Request for Information) documents and identifying questions or requirements that need responses.
Given the following text from an RFI document, identify all explicit and implicit questions or requirements that need to be addressed.
For each question/requirement:
1. Extract the exact text
2. Provide relevant context
3. Assign a confidence score (0-1) based on how clearly it represents a requirement

Text: {text}

Format your response as a list of JSON objects with the following structure:
{
    "text": "The exact question or requirement text",
    "context": "Surrounding context that helps understand the requirement",
    "confidence_score": 0.95
}

Questions/Requirements:"""

class DocumentProcessor:
    def __init__(self):
        self.embeddings = OpenAIEmbeddings()
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200
        )
        self.llm = ChatOpenAI(
            temperature=0,
            model_name="gpt-4"
        )
        self.question_chain = LLMChain(
            llm=self.llm,
            prompt=PromptTemplate(
                input_variables=["text"],
                template=QUESTION_EXTRACTION_PROMPT
            )
        )
    
    def load_document(self, file_path: str, file_type: str) -> List[str]:
        """Load and split document into chunks."""
        if file_type == 'pdf':
            loader = PyPDFLoader(file_path)
        elif file_type == 'docx':
            loader = Docx2txtLoader(file_path)
        elif file_type == 'xlsx':
            loader = UnstructuredExcelLoader(file_path)
        else:  # txt
            loader = TextLoader(file_path)
        
        documents = loader.load()
        return self.text_splitter.split_documents(documents)
    
    def extract_questions(self, text: str) -> List[Dict]:
        """Extract questions and requirements from text."""
        result = self.question_chain.run(text)
        # Parse the result into a list of dictionaries
        # Note: In production, add proper error handling and validation
        return eval(result)
    
    def process_document(self, document_id: int):
        """Process a document and extract questions."""
        db = SessionLocal()
        try:
            document = db.query(Document).filter(Document.id == document_id).first()
            if not document:
                return
            
            # Load and split document
            doc_chunks = self.load_document(document.file_path, document.file_type)
            
            # Process each chunk for questions
            for i, chunk in enumerate(doc_chunks):
                questions = self.extract_questions(chunk.page_content)
                
                # Save questions to database
                for q in questions:
                    db_question = Question(
                        document_id=document.id,
                        text=q["text"],
                        context=q["context"],
                        page_number=chunk.metadata.get("page", i),
                        confidence_score=q["confidence_score"]
                    )
                    db.add(db_question)
            
            # Update document status
            document.processed = True
            db.commit()
            
        except Exception as e:
            print(f"Error processing document {document_id}: {str(e)}")
            db.rollback()
        finally:
            db.close()

# Create a global instance
processor = DocumentProcessor()

# Celery task
def process_document(document_id: int):
    """Celery task to process a document asynchronously."""
    processor.process_document(document_id)
