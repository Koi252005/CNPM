# STEM Kit E-commerce Platform

A full-stack e-commerce platform for STEM education kits, built with React and Django.

## Features

- User Authentication
- Product Catalog
- Shopping Cart
- Lab Management
- Support Ticket System
- Admin Dashboard

## Tech Stack

### Frontend
- React
- Material-UI
- Redux Toolkit
- React Router

### Backend
- Django
- Django REST Framework
- Simple JWT
- SQLite3

## Setup Instructions

### Backend Setup
1. Create and activate virtual environment:
```bash
python -m venv .venv
source .venv/bin/activate  # Linux/Mac
.venv\Scripts\activate     # Windows
```

2. Install dependencies:
```bash
cd backend
pip install -r requirements.txt
```

3. Run migrations:
```bash
python manage.py migrate
```

4. Start backend server:
```bash
python manage.py runserver
```

### Frontend Setup
1. Install dependencies:
```bash
cd frontend
npm install
```

2. Start development server:
```bash
npm start
```

## Environment Variables

Create `.env` file in backend directory:
```
DEBUG=True
SECRET_KEY=your-secret-key
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request 