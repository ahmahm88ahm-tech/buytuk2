from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import asyncio
import uvicorn

from services.ai_content_generator import AIContentGenerator
from services.trend_analyzer import TrendAnalyzer
from services.competitor_analyzer import CompetitorAnalyzer
from services.sentiment_analyzer import SentimentAnalyzer
from services.hashtag_generator import HashtagGenerator

app = FastAPI(
    title="SocialBoost AI Engine",
    description="AI-powered content generation and analysis for social media",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize AI services
ai_generator = AIContentGenerator()
trend_analyzer = TrendAnalyzer()
competitor_analyzer = CompetitorAnalyzer()
sentiment_analyzer = SentimentAnalyzer()
hashtag_generator = HashtagGenerator()

class ContentRequest(BaseModel):
    topic: str
    platform: str
    dialect: str = "egyptian"
    tone: str = "casual"
    length: str = "medium"
    target_audience: Optional[str] = None

class TrendRequest(BaseModel):
    country: str
    platform: str
    time_range: str = "24h"

class CompetitorRequest(BaseModel):
    competitor_handle: str
    platform: str
    analysis_depth: str = "basic"

class AIResponse(BaseModel):
    success: bool
    data: Optional[Dict[str, Any]] = None
    error: Optional[str] = None

@app.get("/")
async def root():
    return {"message": "SocialBoost AI Engine is running"}

@app.post("/api/ai/generate-content", response_model=AIResponse)
async def generate_content(request: ContentRequest):
    try:
        content = await ai_generator.generate_content(
            topic=request.topic,
            platform=request.platform,
            dialect=request.dialect,
            tone=request.tone,
            length=request.length,
            target_audience=request.target_audience
        )
        return AIResponse(success=True, data=content)
    except Exception as e:
        return AIResponse(success=False, error=str(e))

@app.post("/api/ai/generate-bio", response_model=AIResponse)
async def generate_bio(request: ContentRequest):
    try:
        bio = await ai_generator.generate_bio(
            topic=request.topic,
            dialect=request.dialect,
            tone=request.tone,
            platform=request.platform
        )
        return AIResponse(success=True, data=bio)
    except Exception as e:
        return AIResponse(success=False, error=str(e))

@app.post("/api/ai/generate-hashtags", response_model=AIResponse)
async def generate_hashtags(request: ContentRequest):
    try:
        hashtags = await hashtag_generator.generate_hashtags(
            topic=request.topic,
            platform=request.platform,
            country=request.target_audience or "EG"
        )
        return AIResponse(success=True, data={"hashtags": hashtags})
    except Exception as e:
        return AIResponse(success=False, error=str(e))

@app.post("/api/ai/analyze-trends", response_model=AIResponse)
async def analyze_trends(request: TrendRequest):
    try:
        trends = await trend_analyzer.analyze_trends(
            country=request.country,
            platform=request.platform,
            time_range=request.time_range
        )
        return AIResponse(success=True, data=trends)
    except Exception as e:
        return AIResponse(success=False, error=str(e))

@app.post("/api/ai/analyze-competitor", response_model=AIResponse)
async def analyze_competitor(request: CompetitorRequest):
    try:
        analysis = await competitor_analyzer.analyze_competitor(
            competitor_handle=request.competitor_handle,
            platform=request.platform,
            analysis_depth=request.analysis_depth
        )
        return AIResponse(success=True, data=analysis)
    except Exception as e:
        return AIResponse(success=False, error=str(e))

@app.post("/api/ai/analyze-sentiment", response_model=AIResponse)
async def analyze_sentiment(text: str):
    try:
        sentiment = await sentiment_analyzer.analyze_sentiment(text)
        return AIResponse(success=True, data=sentiment)
    except Exception as e:
        return AIResponse(success=False, error=str(e))

@app.get("/api/ai/health")
async def health_check():
    return {"status": "healthy", "services": "operational"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
