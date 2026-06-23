import asyncio
import aiohttp
import json
from typing import Dict, Any, List
from datetime import datetime, timedelta
import pandas as pd
import numpy as np

class CompetitorAnalyzer:
    def __init__(self):
        self.api_keys = self._load_api_keys()
        self.cache = {}
    
    def _load_api_keys(self) -> Dict[str, str]:
        import os
        return {
            "twitter": os.getenv("TWITTER_API_KEY", ""),
            "instagram": os.getenv("INSTAGRAM_API_KEY", ""),
            "tiktok": os.getenv("TIKTOK_API_KEY", ""),
            "facebook": os.getenv("FACEBOOK_API_KEY", "")
        }
    
    async def analyze_competitor(
        self,
        competitor_handle: str,
        platform: str,
        analysis_depth: str = "basic"
    ) -> Dict[str, Any]:
        """Analyze competitor's social media performance and strategy"""
        
        # Platform-specific analysis
        if platform == "twitter":
            analysis = await self._analyze_twitter_competitor(competitor_handle, analysis_depth)
        elif platform == "instagram":
            analysis = await self._analyze_instagram_competitor(competitor_handle, analysis_depth)
        elif platform == "tiktok":
            analysis = await self._analyze_tiktok_competitor(competitor_handle, analysis_depth)
        elif platform == "facebook":
            analysis = await self._analyze_facebook_competitor(competitor_handle, analysis_depth)
        else:
            analysis = self._get_mock_analysis(competitor_handle, platform)
        
        # Add strategic insights
        analysis["strategic_insights"] = self._generate_strategic_insights(analysis)
        analysis["recommendations"] = self._generate_recommendations(analysis)
        
        return analysis
    
    async def _analyze_twitter_competitor(
        self,
        handle: str,
        depth: str
    ) -> Dict[str, Any]:
        """Analyze Twitter competitor profile"""
        
        # Mock data (in production, use actual Twitter API)
        metrics = {
            "followers": 125000,
            "followers_growth": 15.2,  # monthly growth %
            "engagement": 4.8,  # average engagement rate %
            "post_frequency": 3.2,  # posts per day
            "tweet_count": 8450,
            "account_age_months": 48
        }
        
        content_analysis = {
            "top_hashtags": [
                {"hashtag": "#", "usage": 23.4, "engagement": 6.8},
                {"hashtag": "#", "usage": 18.2, "engagement": 5.4},
                {"hashtag": "#", "usage": 15.6, "engagement": 4.9}
            ],
            "content_themes": [
                {"theme": "Business", "percentage": 35.2},
                {"theme": "Lifestyle", "percentage": 28.4},
                {"theme": "Technology", "percentage": 22.8},
                {"theme": "Motivation", "percentage": 13.6}
            ],
            "posting_schedule": {
                "morning": 25.6,
                "afternoon": 42.3,
                "evening": 32.1
            },
            "content_types": {
                "text_only": 45.2,
                "with_media": 42.8,
                "retweets": 8.4,
                "replies": 3.6
            }
        }
        
        performance_metrics = {
            "avg_likes": 234.5,
            "avg_retweets": 45.2,
            "avg_comments": 18.9,
            "viral_posts": 12,  # posts with >1000 likes
            "best_posting_time": "19:00",
            "consistency_score": 8.5  # out of 10
        }
        
        return {
            "handle": handle,
            "platform": "twitter",
            "metrics": metrics,
            "content_analysis": content_analysis,
            "performance_metrics": performance_metrics,
            "analyzed_at": datetime.now().isoformat()
        }
    
    async def _analyze_instagram_competitor(
        self,
        handle: str,
        depth: str
    ) -> Dict[str, Any]:
        """Analyze Instagram competitor profile"""
        
        metrics = {
            "followers": 285000,
            "followers_growth": 22.8,
            "engagement": 6.2,
            "post_frequency": 1.8,  # posts per day
            "post_count": 1240,
            "account_age_months": 36
        }
        
        content_analysis = {
            "top_hashtags": [
                {"hashtag": "#", "usage": 28.4, "engagement": 7.2},
                {"hashtag": "#", "usage": 22.1, "engagement": 6.4},
                {"hashtag": "#", "usage": 18.9, "engagement": 5.8}
            ],
            "content_themes": [
                {"theme": "Fashion", "percentage": 32.4},
                {"theme": "Lifestyle", "percentage": 28.8},
                {"theme": "Beauty", "percentage": 22.6},
                {"theme": "Travel", "percentage": 16.2}
            ],
            "content_formats": {
                "reels": 45.2,
                "carousel": 32.8,
                "single_image": 18.6,
                "stories": 3.4
            },
            "aesthetic_analysis": {
                "color_palette": ["warm", "neutral", "pastel"],
                "filter_usage": 78.4,
                "visual_consistency": 8.2
            }
        }
        
        performance_metrics = {
            "avg_likes": 1850.5,
            "avg_comments": 124.8,
            "avg_saves": 89.2,
            "viral_posts": 8,
            "best_posting_time": "20:00",
            "consistency_score": 7.8
        }
        
        return {
            "handle": handle,
            "platform": "instagram",
            "metrics": metrics,
            "content_analysis": content_analysis,
            "performance_metrics": performance_metrics,
            "analyzed_at": datetime.now().isoformat()
        }
    
    async def _analyze_tiktok_competitor(
        self,
        handle: str,
        depth: str
    ) -> Dict[str, Any]:
        """Analyze TikTok competitor profile"""
        
        metrics = {
            "followers": 450000,
            "followers_growth": 45.6,
            "engagement": 12.4,
            "post_frequency": 0.8,  # posts per day
            "video_count": 340,
            "account_age_months": 24
        }
        
        content_analysis = {
            "top_hashtags": [
                {"hashtag": "#", "usage": 32.4, "engagement": 15.2},
                {"hashtag": "#", "usage": 28.1, "engagement": 12.8},
                {"hashtag": "#", "usage": 24.9, "engagement": 11.4}
            ],
            "content_themes": [
                {"theme": "Dance", "percentage": 35.2},
                {"theme": "Comedy", "percentage": 28.8},
                {"theme": "Education", "percentage": 18.6},
                {"theme": "Lifestyle", "percentage": 17.4}
            ],
            "video_formats": {
                "trending_sounds": 65.2,
                "original_audio": 24.8,
                "voiceover": 8.4,
                "text_only": 1.6
            },
            "trending_effects": [
                {"effect": "Vintage Filter", "usage": 28.4},
                {"effect": "Glitch Effect", "usage": 22.1}
            ]
        }
        
        performance_metrics = {
            "avg_views": 45670.5,
            "avg_likes": 2340.8,
            "avg_comments": 156.4,
            "avg_shares": 89.2,
            "viral_videos": 15,
            "best_posting_time": "21:00",
            "consistency_score": 8.9
        }
        
        return {
            "handle": handle,
            "platform": "tiktok",
            "metrics": metrics,
            "content_analysis": content_analysis,
            "performance_metrics": performance_metrics,
            "analyzed_at": datetime.now().isoformat()
        }
    
    async def _analyze_facebook_competitor(
        self,
        handle: str,
        depth: str
    ) -> Dict[str, Any]:
        """Analyze Facebook competitor profile"""
        
        metrics = {
            "followers": 125000,
            "followers_growth": 8.4,
            "engagement": 3.2,
            "post_frequency": 2.1,  # posts per day
            "post_count": 2340,
            "account_age_months": 60
        }
        
        content_analysis = {
            "content_themes": [
                {"theme": "Business", "percentage": 42.3},
                {"theme": "News", "percentage": 28.8},
                {"theme": "Entertainment", "percentage": 18.6},
                {"theme": "Educational", "percentage": 10.3}
            ],
            "content_types": {
                "video": 45.2,
                "image": 32.8,
                "link": 15.6,
                "status": 6.4
            },
            "posting_schedule": {
                "morning": 35.6,
                "afternoon": 38.2,
                "evening": 26.2
            }
        }
        
        performance_metrics = {
            "avg_reactions": 156.8,
            "avg_comments": 45.2,
            "avg_shares": 12.4,
            "viral_posts": 6,
            "best_posting_time": "19:30",
            "consistency_score": 7.2
        }
        
        return {
            "handle": handle,
            "platform": "facebook",
            "metrics": metrics,
            "content_analysis": content_analysis,
            "performance_metrics": performance_metrics,
            "analyzed_at": datetime.now().isoformat()
        }
    
    def _generate_strategic_insights(self, analysis: Dict[str, Any]) -> List[str]:
        """Generate strategic insights from competitor analysis"""
        
        insights = []
        metrics = analysis.get("metrics", {})
        content = analysis.get("content_analysis", {})
        
        # Growth insights
        if metrics.get("followers_growth", 0) > 20:
            insights.append("High growth rate suggests effective content strategy")
        elif metrics.get("followers_growth", 0) < 5:
            insights.append("Low growth rate may indicate content saturation")
        
        # Engagement insights
        if metrics.get("engagement", 0) > 8:
            insights.append("High engagement rate shows strong audience connection")
        elif metrics.get("engagement", 0) < 3:
            insights.append("Low engagement rate suggests content optimization needed")
        
        # Content insights
        top_themes = content.get("content_themes", [])
        if top_themes:
            top_theme = top_themes[0]
            insights.append(f"Primary content focus: {top_theme.get('theme', 'Unknown')} ({top_theme.get('percentage', 0)}%)")
        
        # Consistency insights
        consistency = analysis.get("performance_metrics", {}).get("consistency_score", 0)
        if consistency > 8:
            insights.append("High posting consistency contributes to steady growth")
        elif consistency < 5:
            insights.append("Inconsistent posting may limit growth potential")
        
        return insights
    
    def _generate_recommendations(self, analysis: Dict[str, Any]) -> List[str]:
        """Generate actionable recommendations based on competitor analysis"""
        
        recommendations = []
        metrics = analysis.get("metrics", {})
        content = analysis.get("content_analysis", {})
        performance = analysis.get("performance_metrics", {})
        
        # Growth recommendations
        if metrics.get("followers_growth", 0) < 10:
            recommendations.append("Increase posting frequency to boost growth rate")
            recommendations.append("Analyze and replicate top-performing content themes")
        
        # Engagement recommendations
        if metrics.get("engagement", 0) < 5:
            recommendations.append("Use more interactive content (polls, questions, contests)")
            recommendations.append("Post during peak engagement hours")
        
        # Content recommendations
        top_hashtags = content.get("top_hashtags", [])
        if top_hashtags:
            recommendations.append(f"Incorporate trending hashtags: {', '.join([h['hashtag'] for h in top_hashtags[:3]])}")
        
        # Timing recommendations
        best_time = performance.get("best_posting_time")
        if best_time:
            recommendations.append(f"Schedule posts around {best_time} for optimal reach")
        
        # Format recommendations
        platform = analysis.get("platform")
        if platform == "instagram":
            formats = content.get("content_formats", {})
            top_format = max(formats.items(), key=lambda x: x[1]) if formats else None
            if top_format:
                recommendations.append(f"Focus on {top_format[0]} content (currently {top_format[1]}% of posts)")
        
        return recommendations
    
    def _get_mock_analysis(self, handle: str, platform: str) -> Dict[str, Any]:
        """Fallback mock analysis when API is unavailable"""
        
        return {
            "handle": handle,
            "platform": platform,
            "metrics": {
                "followers": 50000,
                "followers_growth": 10.0,
                "engagement": 5.0,
                "post_frequency": 2.0
            },
            "content_analysis": {
                "top_hashtags": [{"hashtag": "#example", "usage": 20.0, "engagement": 5.0}],
                "content_themes": [{"theme": "General", "percentage": 50.0}]
            },
            "performance_metrics": {
                "avg_likes": 100.0,
                "avg_comments": 20.0,
                "consistency_score": 7.0
            },
            "mock_data": True,
            "analyzed_at": datetime.now().isoformat()
        }
