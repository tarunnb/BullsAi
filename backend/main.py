# backend/main.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Dict, List
import os
from dotenv import load_dotenv

# Load environment variables FIRST (before any imports that use them)
load_dotenv()

# Import our services with error handling
try:
    from ai_service import ai_service
    AI_SERVICE_AVAILABLE = True
except Exception as e:
    print(f"Error importing ai_service: {e}")
    AI_SERVICE_AVAILABLE = False
    ai_service = None

try:
    from stock_data_service import stock_service
    STOCK_SERVICE_AVAILABLE = True
except Exception as e:
    print(f"Error importing stock_data_service: {e}")
    STOCK_SERVICE_AVAILABLE = False
    stock_service = None

app = FastAPI(title="BullsAI API", version="1.0.0")

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Store conversation history (in production, use a database)
conversations: Dict[str, List[Dict]] = {}

class ChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = "default"

class ChatResponse(BaseModel):
    response: str
    session_id: str
    intent: Optional[Dict] = None

@app.get("/")
def read_root():
    return {"message": "Welcome to BullsAI - Your AI Stock Analysis Assistant"}

@app.get("/health")
def health_check():
    return {
        "status": "healthy", 
        "service": "BullsAI Backend",
        "ai_service": AI_SERVICE_AVAILABLE,
        "stock_service": STOCK_SERVICE_AVAILABLE
    }

@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Main chat endpoint for AI-powered stock analysis
    """
    print(f"Received chat request: {request.message}")
    
    try:
        if not AI_SERVICE_AVAILABLE or ai_service is None:
            return ChatResponse(
                response="AI service is not available. Please check the server configuration.",
                session_id=request.session_id
            )
        
        # Get or create conversation history
        session_id = request.session_id
        if session_id not in conversations:
            conversations[session_id] = []
        
        # Analyze the query intent (with error handling)
        intent = {}
        try:
            intent = ai_service.analyze_query_intent(request.message)
        except Exception as e:
            print(f"Error analyzing intent: {e}")
        
        # Get AI response
        print("Getting AI response...")
        response = await ai_service.get_response(
            request.message, 
            conversations[session_id]
        )
        print(f"AI response received: {response[:100]}...")
        
        # Store in conversation history
        conversations[session_id].append({"role": "user", "content": request.message})
        conversations[session_id].append({"role": "assistant", "content": response})
        
        # Keep only last 10 messages to prevent token overflow
        if len(conversations[session_id]) > 20:
            conversations[session_id] = conversations[session_id][-20:]
        
        return ChatResponse(
            response=response,
            session_id=session_id,
            intent=intent
        )
        
    except Exception as e:
        print(f"Error in chat endpoint: {e}")
        import traceback
        traceback.print_exc()
        return ChatResponse(
            response=f"I encountered an error processing your request. Please try again.",
            session_id=request.session_id
        )

@app.post("/api/analyze-document")
async def analyze_document(file_url: str):
    """
    Endpoint for analyzing financial documents (future implementation)
    """
    return {"message": "Document analysis coming soon", "file_url": file_url}

@app.get("/api/stock-data/{symbol}")
async def get_stock_data(symbol: str = "TATAPOWER"):
    """
    Endpoint for fetching real-time stock data
    """
    if not STOCK_SERVICE_AVAILABLE or stock_service is None:
        return {
            "success": False,
            "error": "Stock service not available"
        }
    
    try:
        # Get real-time data
        stock_data = stock_service.get_stock_info()
        
        # Get financial metrics
        metrics = stock_service.get_financial_metrics()
        
        # Get analyst recommendations
        recommendations = stock_service.get_analyst_recommendations()
        
        return {
            "success": True,
            "data": {
                "price_data": stock_data,
                "financial_metrics": metrics,
                "analyst_recommendations": recommendations
            }
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "message": "Failed to fetch stock data"
        }

@app.get("/api/historical-data")
async def get_historical_data(period: str = "1mo", interval: str = "1d"):
    """
    Get historical price data
    """
    if not STOCK_SERVICE_AVAILABLE or stock_service is None:
        return {
            "success": False,
            "error": "Stock service not available"
        }
    
    try:
        data = stock_service.get_historical_data(period=period, interval=interval)
        return {
            "success": True,
            "data": data,
            "period": period,
            "interval": interval
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)