# Satyam AI - Legal Assistant

Satyam AI is an advanced legal assistant application that leverages Artificial Intelligence to provide accurate legal information and guidance. It uses Retrieval-Augmented Generation (RAG) to fetch relevant legal sections from a knowledge base (like the Indian Penal Code) and provide cited, context-aware answers.

!Satyam AI
<img width="1917" height="917" alt="image" src="https://github.com/user-attachments/assets/bfa54452-9142-425c-b67b-c3eb65e12682" />


## 🌟 Features

-   **AI-Powered Legal Advice**: Ask complex legal questions and get answers based on Indian laws.
-   **RAG Technology**: Uses Pinecone and Gemini/OpenAI to retrieve and synthesize information from legal documents (e.g., IPC, IT Act).
-   **Interactive 3D UI**: A visually stunning frontend built with React, Three.js, and Framer Motion.
-   **Voice Input**: Speak your queries directly to the assistant.
-   **Secure Authentication**: User signup and login system to save chat history.
-   **Chat History**: Access previous conversations.

## 🛠️ Tech Stack

### Frontend
-   **Framework**: React (Vite)
-   **Styling**: Tailwind CSS
-   **3D & Animations**: Three.js, React Three Fiber, Drei, Framer Motion, GSAP
-   **State Management**: Zustand
-   **Routing**: React Router DOM
-   **Icons**: Lucide React

### Backend
-   **Framework**: FastAPI
-   **Database**: SQLModel (SQLite), Pinecone (Vector DB)
-   **AI/LLM**: Google Gemini / OpenAI
-   **Authentication**: JWT (JSON Web Tokens), BCrypt
-   **Language**: Python 3.x

## 🚀 Getting Started

Follow these instructions to set up the project locally.

### Prerequisites
-   Node.js (v18+ recommended)
-   Python (v3.9+ recommended)
-   Git

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/atharv2408/satyam-ai.git
    cd satyam-ai
    ```

2.  **Backend Setup**
    Navigate to the backend directory and set up the virtual environment.

    ```bash
    cd backend
    python -m venv venv
    
    # Windows
    venv\Scripts\activate
    # macOS/Linux
    source venv/bin/activate
    
    pip install -r requirements.txt
    ```

    Create a `.env` file in the `backend` directory with the following variables:
    ```env
    PINECONE_API_KEY=your_pinecone_api_key
    GEMINI_API_KEY=your_gemini_api_key
    OPENAI_API_KEY=your_openai_api_key
    SECRET_KEY=your_secret_key
    ```

    Run the backend server:
    ```bash
    uvicorn app:app --reload
    ```
    The backend will start at `http://127.0.0.1:8000`.

3.  **Frontend Setup**
    Open a new terminal and navigate to the frontend directory.

    ```bash
    cd frontend
    npm install
    ```

    Create a `.env` file in the `frontend` directory:
    ```env
    VITE_API_BASE_URL=http://localhost:8000
    VITE_API_CHAT_ENDPOINT=/rag
    VITE_API_TIMEOUT=120000
    VITE_APP_NAME=SATYAM AI
    VITE_APP_TAGLINE="Truth. Justice. Intelligence."
    ```

    Run the frontend development server:
    ```bash
    npm run dev
    ```
    The frontend will start at `http://localhost:5173`.

## 📂 Project Structure

```
satyam-ai/
├── backend/            # FastAPI backend
│   ├── app.py          # Main entry point
│   ├── models.py       # Database models
│   ├── rag_chain.py    # RAG implementation
│   └── ...
├── frontend/           # React frontend
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── pages/      # Application pages
│   │   └── ...
│   └── ...
└── README.md
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

[MIT]
