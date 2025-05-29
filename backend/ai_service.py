# backend/ai_service.py
import os
from openai import OpenAI
from typing import Dict, List
import json

# Import stock service with error handling
try:
    from stock_data_service import stock_service
    STOCK_SERVICE_AVAILABLE = True
except ImportError:
    print("Warning: stock_data_service not available")
    STOCK_SERVICE_AVAILABLE = False

class StockAnalysisAI:
    def __init__(self):
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            print("WARNING: OPENAI_API_KEY not found in environment variables")
            print("Please add OPENAI_API_KEY=your-key-here to your .env file")
            api_key = "sk-dummy-key-please-add-real-key"
        
        self.client = OpenAI(api_key=api_key)
        self.system_prompt = """You are BullsAI, an expert AI financial analyst specializing in Indian stock markets, particularly Tata Power. 
        You have deep knowledge of:
        - Financial statement analysis
        - Technical and fundamental analysis
        - Indian market regulations and dynamics
        - Corporate governance and management assessment
        - Industry trends and macroeconomic factors
        
        Provide detailed, actionable insights while explaining complex concepts in simple terms.
        Always cite specific numbers and ratios when discussing financials.
        Be balanced in your analysis, highlighting both opportunities and risks."""
    
    async def get_response(self, message: str, conversation_history: List[Dict] = None) -> str:
        """
        Get AI response for user query about stock analysis
        """
        try:
            # Check if we have a valid API key
            api_key = os.getenv("OPENAI_API_KEY")
            if not api_key or api_key == "sk-dummy-key-please-add-real-key":
                return ("I'm not configured with an OpenAI API key yet. To enable AI analysis:\n"
                       "1. Get your API key from https://platform.openai.com/api-keys\n"
                       "2. Add it to backend/.env file as OPENAI_API_KEY=your-key-here\n"
                       "3. Restart the backend server")
            
            # Initialize messages list early
            messages = []
            
            # Check if query needs current stock data
            intent = self.analyze_query_intent(message)
            
            # Add current stock data to context if relevant
            context_data = ""
            if STOCK_SERVICE_AVAILABLE and (any(intent.values()) or "price" in message.lower() or "stock" in message.lower() or "tata power" in message.lower()):
                try:
                    stock_data = stock_service.get_stock_info()
                    context_data = f"\n\nCurrent Stock Data:\n{stock_service.format_for_chat(stock_data)}"
                    
                    # Add financial metrics if needed
                    if intent.get("needs_financial_data"):
                        metrics = stock_service.get_financial_metrics()
                        if metrics:
                            context_data += f"\n\nFinancial Metrics:\n{json.dumps(metrics, indent=2)}"
                except Exception as e:
                    print(f"Error fetching stock data: {e}")
                    context_data = "\n\n(Note: Real-time stock data is temporarily unavailable)"
            
            # Create system message with context
            enhanced_prompt = self.system_prompt + context_data
            messages.append({"role": "system", "content": enhanced_prompt})
            
            # Add conversation history if provided
            if conversation_history:
                messages.extend(conversation_history)
            
            # Add current user message
            messages.append({"role": "user", "content": message})
            
            # Make API call to OpenAI
            response = self.client.chat.completions.create(
                model="gpt-4",
                messages=messages,
                temperature=0.7,
                max_tokens=1000
            )
            
            return response.choices[0].message.content
            
        except Exception as e:
            print(f"Error in AI response: {e}")
            import traceback
            traceback.print_exc()
            return f"I apologize, but I encountered an error. Please check the server logs for details."
    
    def analyze_query_intent(self, query: str) -> Dict:
        """
        Understand what type of analysis the user is asking for
        """
        query_lower = query.lower()
        
        intent = {
            "needs_financial_data": any(word in query_lower for word in 
                ["revenue", "profit", "earnings", "pe", "ratio", "financial", "balance sheet", "income"]),
            "needs_news": any(word in query_lower for word in 
                ["news", "latest", "recent", "announcement", "update"]),
            "needs_technical": any(word in query_lower for word in 
                ["chart", "technical", "resistance", "support", "trend", "pattern"]),
            "needs_comparison": any(word in query_lower for word in 
                ["compare", "versus", "vs", "peer", "competitor"]),
            "needs_forecast": any(word in query_lower for word in 
                ["forecast", "predict", "future", "target", "potential", "growth"])
        }
        
        return intent

# Initialize the AI service
ai_service = StockAnalysisAI()