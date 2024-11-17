# AnswerPath

AnswerPath is an enterprise-grade AI-powered platform designed to streamline the RFI (Request for Information) response process for sales teams. It combines intelligent document processing with a knowledge management system to accelerate and improve the quality of RFI responses.

## Features

- **Intelligent Document Processing**
  - Support for PDF, Word, Excel, and Text files
  - Automated question and requirement extraction
  - Context-aware parsing
  
- **Knowledge Management**
  - Custom knowledge base integration
  - Website and document repository
  - Historical response tracking
  
- **AI-Powered Response Generation**
  - Configurable brand voice
  - Custom instruction templates
  - Context-aware response composition
  
- **Enterprise Integration**
  - Secure authentication
  - Role-based access control
  - Audit logging

## Tech Stack

- **Backend**
  - FastAPI (Python)
  - SQLAlchemy ORM
  - LangChain for AI integration
  - ChromaDB for vector storage
  
- **Frontend**
  - React
  - Material-UI
  - Redux for state management

## Getting Started

### Prerequisites

- Python 3.9+
- Node.js 16+
- PostgreSQL
- Virtual environment tool (optional but recommended)

### Backend Setup

1. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: .\venv\Scripts\activate
   ```

2. Install dependencies:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. Run migrations:
   ```bash
   alembic upgrade head
   ```

5. Start the backend server:
   ```bash
   uvicorn app.main:app --reload
   ```

### Frontend Setup

1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

## Project Structure

```
answerpath/
├── backend/
│   ├── app/
│   │   ├── api/        # API endpoints
│   │   ├── core/       # Core functionality
│   │   ├── db/         # Database
│   │   ├── models/     # Data models
│   │   ├── services/   # Business logic
│   │   └── utils/      # Utilities
│   ├── tests/          # Test suite
│   └── alembic/        # Database migrations
├── frontend/
│   ├── public/
│   └── src/
├── docs/               # Documentation
└── docker/            # Docker configuration
```

## Contributing

Please read CONTRIBUTING.md for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
