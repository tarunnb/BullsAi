# backend/stock_data_service.py
import yfinance as yf
import requests
from datetime import datetime, timedelta
from typing import Dict, List, Optional
import json

class StockDataService:
    def __init__(self):
        # Tata Power stock symbols
        self.symbols = {
            "NSE": "TATAPOWER.NS",
            "BSE": "TATAPOWER.BO"
        }
        self.default_symbol = "TATAPOWER.NS"
    
    def get_stock_info(self, symbol: str = None) -> Dict:
        """Get comprehensive stock information"""
        try:
            ticker_symbol = symbol or self.default_symbol
            stock = yf.Ticker(ticker_symbol)
            info = stock.info
            
            # Get current price data
            history = stock.history(period="1d", interval="1m")
            current_price = history['Close'].iloc[-1] if not history.empty else info.get('currentPrice', 0)
            
            # Calculate price changes
            hist_5d = stock.history(period="5d")
            if not hist_5d.empty and len(hist_5d) > 1:
                prev_close = hist_5d['Close'].iloc[-2]
                change = current_price - prev_close
                change_percent = (change / prev_close) * 100
            else:
                change = 0
                change_percent = 0
            
            return {
                "symbol": ticker_symbol,
                "company_name": info.get('longName', 'Tata Power Company Limited'),
                "current_price": round(current_price, 2),
                "previous_close": round(info.get('previousClose', 0), 2),
                "change": round(change, 2),
                "change_percent": round(change_percent, 2),
                "day_high": round(info.get('dayHigh', 0), 2),
                "day_low": round(info.get('dayLow', 0), 2),
                "volume": info.get('volume', 0),
                "avg_volume": info.get('averageVolume', 0),
                "market_cap": info.get('marketCap', 0),
                "pe_ratio": round(info.get('trailingPE', 0), 2) if info.get('trailingPE') else None,
                "eps": round(info.get('trailingEps', 0), 2) if info.get('trailingEps') else None,
                "dividend_yield": round(info.get('dividendYield', 0) * 100, 2) if info.get('dividendYield') else None,
                "week_52_high": round(info.get('fiftyTwoWeekHigh', 0), 2),
                "week_52_low": round(info.get('fiftyTwoWeekLow', 0), 2),
                "beta": round(info.get('beta', 0), 2) if info.get('beta') else None,
                "last_updated": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            }
        except Exception as e:
            print(f"Error fetching stock data: {e}")
            return self._get_fallback_data()
    
    def get_historical_data(self, period: str = "1mo", interval: str = "1d") -> List[Dict]:
        """Get historical price data"""
        try:
            stock = yf.Ticker(self.default_symbol)
            history = stock.history(period=period, interval=interval)
            
            data = []
            for date, row in history.iterrows():
                data.append({
                    "date": date.strftime("%Y-%m-%d"),
                    "open": round(row['Open'], 2),
                    "high": round(row['High'], 2),
                    "low": round(row['Low'], 2),
                    "close": round(row['Close'], 2),
                    "volume": int(row['Volume'])
                })
            
            return data
        except Exception as e:
            print(f"Error fetching historical data: {e}")
            return []
    
    def get_financial_metrics(self) -> Dict:
        """Get key financial metrics and ratios"""
        try:
            stock = yf.Ticker(self.default_symbol)
            info = stock.info
            
            return {
                "revenue_growth": round(info.get('revenueGrowth', 0) * 100, 2) if info.get('revenueGrowth') else None,
                "profit_margins": round(info.get('profitMargins', 0) * 100, 2) if info.get('profitMargins') else None,
                "operating_margins": round(info.get('operatingMargins', 0) * 100, 2) if info.get('operatingMargins') else None,
                "return_on_equity": round(info.get('returnOnEquity', 0) * 100, 2) if info.get('returnOnEquity') else None,
                "debt_to_equity": round(info.get('debtToEquity', 0), 2) if info.get('debtToEquity') else None,
                "current_ratio": round(info.get('currentRatio', 0), 2) if info.get('currentRatio') else None,
                "book_value": round(info.get('bookValue', 0), 2) if info.get('bookValue') else None,
                "price_to_book": round(info.get('priceToBook', 0), 2) if info.get('priceToBook') else None,
                "enterprise_value": info.get('enterpriseValue', 0),
                "ev_to_revenue": round(info.get('enterpriseToRevenue', 0), 2) if info.get('enterpriseToRevenue') else None,
                "ev_to_ebitda": round(info.get('enterpriseToEbitda', 0), 2) if info.get('enterpriseToEbitda') else None
            }
        except Exception as e:
            print(f"Error fetching financial metrics: {e}")
            return {}
    
    def get_analyst_recommendations(self) -> Dict:
        """Get analyst recommendations and price targets"""
        try:
            stock = yf.Ticker(self.default_symbol)
            recommendations = stock.recommendations
            
            if recommendations is not None and not recommendations.empty:
                # Get latest recommendations
                latest_recs = recommendations.tail(5)
                
                # Count recommendation types
                rec_counts = latest_recs['To Grade'].value_counts().to_dict()
                
                # Get average price target if available
                info = stock.info
                target_mean = info.get('targetMeanPrice', 0)
                target_high = info.get('targetHighPrice', 0)
                target_low = info.get('targetLowPrice', 0)
                
                return {
                    "recommendation_counts": rec_counts,
                    "target_mean_price": round(target_mean, 2) if target_mean else None,
                    "target_high_price": round(target_high, 2) if target_high else None,
                    "target_low_price": round(target_low, 2) if target_low else None,
                    "number_of_analysts": info.get('numberOfAnalystOpinions', 0)
                }
            return {}
        except Exception as e:
            print(f"Error fetching analyst recommendations: {e}")
            return {}
    
    def _get_fallback_data(self) -> Dict:
        """Return fallback data when API fails"""
        return {
            "symbol": self.default_symbol,
            "company_name": "Tata Power Company Limited",
            "current_price": 0,
            "error": "Unable to fetch real-time data. Please try again later.",
            "last_updated": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }
    
    def format_for_chat(self, data: Dict) -> str:
        """Format stock data for chat response"""
        if "error" in data:
            return data["error"]
        
        response = f"""📊 **{data['company_name']}** ({data['symbol']})

**Current Price:** ₹{data['current_price']} 
**Change:** {'+' if data['change'] >= 0 else ''}{data['change']} ({'+' if data['change_percent'] >= 0 else ''}{data['change_percent']}%)

**Today's Range:** ₹{data['day_low']} - ₹{data['day_high']}
**52 Week Range:** ₹{data['week_52_low']} - ₹{data['week_52_high']}

**Key Metrics:**
• P/E Ratio: {data['pe_ratio'] if data['pe_ratio'] else 'N/A'}
• EPS: ₹{data['eps'] if data['eps'] else 'N/A'}
• Market Cap: ₹{data['market_cap']:,.0f} if data['market_cap'] else 'N/A'
• Volume: {data['volume']:,} shares
• Dividend Yield: {data['dividend_yield']}% if data['dividend_yield'] else 'N/A'

*Last updated: {data['last_updated']}*"""
        
        return response

# Initialize the service
stock_service = StockDataService()