import asyncio
import json
from typing import Dict, Any, List
import random
from collections import Counter

class HashtagGenerator:
    def __init__(self):
        self.trending_hashtags = self._load_trending_hashtags()
        self.category_hashtags = self._load_category_hashtags()
        self.country_specific = self._load_country_specific_hashtags()
    
    def _load_trending_hashtags(self) -> Dict[str, List[str]]:
        """Load trending hashtags by category"""
        return {
            "general": [
                "#", "#", "#", "#", "#",
                "#trending", "#viral", "#fyp", "#explore", "#instagood"
            ],
            "business": [
                "#", "#", "#", "#", "#",
                "#entrepreneur", "#business", "#startup", "#marketing", "#success"
            ],
            "fashion": [
                "#", "#", "#", "#", "#",
                "#fashion", "#style", "#ootd", "#fashionista", "#trending"
            ],
            "food": [
                "#", "#", "#", "#", "#",
                "#food", "#foodie", "#yummy", "#delicious", "#foodporn"
            ],
            "travel": [
                "#", "#", "#", "#", "#",
                "#travel", "#wanderlust", "#vacation", "#explore", "#adventure"
            ],
            "fitness": [
                "#", "#", "#", "#", "#",
                "#fitness", "#gym", "#workout", "#health", "#fit"
            ],
            "technology": [
                "#", "#", "#", "#", "#",
                "#tech", "#technology", "#innovation", "#digital", "#future"
            ],
            "entertainment": [
                "#", "#", "#", "#", "#",
                "#entertainment", "#music", "#movies", "#fun", "#comedy"
            ],
            "education": [
                "#", "#", "#", "#", "#",
                "#education", "#learning", "#knowledge", "#study", "#school"
            ],
            "lifestyle": [
                "#", "#", "#", "#", "#",
                "#lifestyle", "#motivation", "#inspiration", "#life", "#happiness"
            ]
        }
    
    def _load_category_hashtags(self) -> Dict[str, List[str]]:
        """Load category-specific hashtags"""
        return {
            "egypt": [
                "#", "#", "#", "#", "#",
                "#cairo", "#egypt", "#alexandria", "#egyptian", "#masr"
            ],
            "saudi": [
                "#", "#", "#", "#", "#",
                "#riyadh", "#jeddah", "#saudi", "#ksa", "#"
            ],
            "kuwait": [
                "#", "#", "#", "#", "#",
                "#kuwait", "#kuwaitcity", "#q8", "#kuwaiti", "#"
            ],
            "uae": [
                "#", "#", "#", "#", "#",
                "#dubai", "#abudhabi", "#uae", "#mydubai", "#emirates"
            ]
        }
    
    def _load_country_specific_hashtags(self) -> Dict[str, List[str]]:
        """Load country-specific trending hashtags"""
        return {
            "EG": {
                "trending": ["#", "#", "#", "#", "#"],
                "events": ["#", "#", "#", "#", "#"],
                "local": ["#", "#", "#", "#", "#"]
            },
            "SA": {
                "trending": ["#", "#", "#", "#", "#"],
                "events": ["#", "#", "#", "#", "#"],
                "local": ["#", "#", "#", "#", "#"]
            },
            "KW": {
                "trending": ["#", "#", "#", "#", "#"],
                "events": ["#", "#", "#", "#", "#"],
                "local": ["#", "#", "#", "#", "#"]
            },
            "AE": {
                "trending": ["#", "#", "#", "#", "#"],
                "events": ["#", "#", "#", "#", "#"],
                "local": ["#", "#", "#", "#", "#"]
            }
        }
    
    async def generate_hashtags(
        self,
        topic: str,
        platform: str,
        country: str = "EG",
        count: int = 10
    ) -> List[str]:
        """Generate relevant hashtags for social media content"""
        
        # Platform-specific hashtag limits
        platform_limits = {
            "instagram": 30,
            "twitter": 3,
            "facebook": 10,
            "tiktok": 5
        }
        
        max_hashtags = min(count, platform_limits.get(platform, 10))
        
        # Generate hashtags from different sources
        topic_hashtags = self._generate_topic_hashtags(topic, country)
        trending_hashtags = self._get_trending_hashtags(country, platform)
        category_hashtags = self._get_category_hashtags(topic)
        country_hashtags = self._get_country_hashtags(country)
        
        # Combine and deduplicate
        all_hashtags = (
            topic_hashtags +
            trending_hashtags +
            category_hashtags +
            country_hashtags
        )
        
        # Remove duplicates and limit
        unique_hashtags = list(dict.fromkeys(all_hashtags))  # Preserve order while removing duplicates
        
        # Ensure we have enough hashtags
        if len(unique_hashtags) < max_hashtags:
            # Add general hashtags to fill up
            general_hashtags = self.trending_hashtags.get("general", [])
            for hashtag in general_hashtags:
                if hashtag not in unique_hashtags:
                    unique_hashtags.append(hashtag)
                if len(unique_hashtags) >= max_hashtags:
                    break
        
        # Return the requested number of hashtags
        return unique_hashtags[:max_hashtags]
    
    def _generate_topic_hashtags(self, topic: str, country: str) -> List[str]:
        """Generate hashtags based on topic"""
        hashtags = []
        
        # Convert topic to hashtag format
        topic_clean = topic.strip().lower().replace(" ", "_")
        hashtags.append(f"#{topic_clean}")
        
        # Generate variations
        topic_words = topic.split()
        if len(topic_words) > 1:
            # Single word hashtags
            for word in topic_words:
                hashtags.append(f"#{word.lower()}")
            
            # Combined variations
            hashtags.append(f"#{'_'.join(topic_words[:2]).lower()}")
        
        # Add Arabic translation if topic is English
        if self._is_english(topic):
            arabic_translation = self._translate_to_arabic(topic)
            if arabic_translation:
                hashtags.append(f"#{arabic_translation}")
        
        return hashtags
    
    def _get_trending_hashtags(self, country: str, platform: str) -> List[str]:
        """Get trending hashtags for country and platform"""
        country_data = self.country_specific.get(country, {})
        
        if platform == "tiktok":
            return country_data.get("trending", [])[:3]
        elif platform == "twitter":
            return country_data.get("trending", [])[:2]
        elif platform == "instagram":
            return country_data.get("trending", [])[:5]
        elif platform == "facebook":
            return country_data.get("trending", [])[:3]
        
        return country_data.get("trending", [])[:3]
    
    def _get_category_hashtags(self, topic: str) -> List[str]:
        """Get category-specific hashtags based on topic"""
        topic_lower = topic.lower()
        
        # Determine category based on keywords
        category_keywords = {
            "business": ["business", "entrepreneur", "startup", "marketing", "sales", "money"],
            "fashion": ["fashion", "style", "clothing", "outfit", "dress", "wear"],
            "food": ["food", "cooking", "recipe", "restaurant", "eat", "delicious"],
            "travel": ["travel", "trip", "vacation", "hotel", "flight", "tourism"],
            "fitness": ["fitness", "gym", "workout", "exercise", "health", "training"],
            "technology": ["tech", "technology", "software", "app", "digital", "computer"],
            "entertainment": ["music", "movie", "fun", "game", "show", "entertainment"],
            "education": ["education", "learn", "study", "school", "course", "knowledge"],
            "lifestyle": ["life", "lifestyle", "motivation", "inspiration", "happiness", "wellness"]
        }
        
        for category, keywords in category_keywords.items():
            if any(keyword in topic_lower for keyword in keywords):
                return self.trending_hashtags.get(category, [])[:3]
        
        # Default to general category
        return self.trending_hashtags.get("general", [])[:3]
    
    def _get_country_hashtags(self, country: str) -> List[str]:
        """Get country-specific hashtags"""
        country_mapping = {
            "EG": "egypt",
            "SA": "saudi",
            "KW": "kuwait",
            "AE": "uae"
        }
        
        country_key = country_mapping.get(country, "egypt")
        return self.category_hashtags.get(country_key, [])[:2]
    
    def _is_english(self, text: str) -> bool:
        """Check if text is primarily English"""
        import re
        english_chars = len(re.findall(r'[a-zA-Z]', text))
        total_chars = len(re.findall(r'[a-zA-Z\u0621-\u064A]', text))
        
        if total_chars == 0:
            return False
        
        return english_chars / total_chars > 0.5
    
    def _translate_to_arabic(self, english_text: str) -> str:
        """Simple English to Arabic translation (mock implementation)"""
        translations = {
            "business": "",
            "fashion": "",
            "food": "",
            "travel": "",
            "fitness": "",
            "technology": "",
            "entertainment": "",
            "education": "",
            "lifestyle": ""
        }
        
        return translations.get(english_text.lower(), "")
    
    async def analyze_hashtag_performance(
        self,
        hashtags: List[str],
        platform: str,
        country: str = "EG"
    ) -> Dict[str, Any]:
        """Analyze performance metrics for given hashtags"""
        
        performance_data = {}
        
        for hashtag in hashtags:
            # Mock performance data (in production, use actual API data)
            performance_data[hashtag] = {
                "usage_count": random.randint(1000, 1000000),
                "engagement_rate": round(random.uniform(2.0, 15.0), 2),
                "growth_rate": round(random.uniform(-5.0, 50.0), 2),
                "competition_level": random.choice(["low", "medium", "high"]),
                "trending_score": round(random.uniform(1.0, 10.0), 2),
                "best_posting_time": f"{random.randint(18, 22)}:00",
                "recommended_for": [platform],
                "country_popularity": self._get_country_popularity(hashtag, country)
            }
        
        # Sort by performance score
        sorted_hashtags = sorted(
            performance_data.items(),
            key=lambda x: x[1]["engagement_rate"] * x[1]["trending_score"],
            reverse=True
        )
        
        return {
            "hashtags": dict(sorted_hashtags),
            "total_analyzed": len(hashtags),
            "platform": platform,
            "country": country,
            "analysis_timestamp": self._get_timestamp(),
            "top_performers": [tag for tag, _ in sorted_hashtags[:5]],
            "recommendations": self._generate_hashtag_recommendations(performance_data)
        }
    
    def _get_country_popularity(self, hashtag: str, country: str) -> float:
        """Get hashtag popularity in specific country"""
        # Mock implementation - in production, use actual data
        base_popularity = random.uniform(0.1, 1.0)
        
        # Boost popularity for country-specific hashtags
        country_indicators = ["egypt", "saudi", "kuwait", "uae", "cairo", "riyadh", "dubai"]
        if any(indicator in hashtag.lower() for indicator in country_indicators):
            base_popularity *= 1.5
        
        return min(base_popularity, 1.0)
    
    def _generate_hashtag_recommendations(self, performance_data: Dict[str, Any]) -> List[str]:
        """Generate recommendations based on hashtag performance"""
        recommendations = []
        
        # Analyze performance data
        high_performing = [tag for tag, data in performance_data.items() if data["engagement_rate"] > 8.0]
        low_competition = [tag for tag, data in performance_data.items() if data["competition_level"] == "low"]
        trending_up = [tag for tag, data in performance_data.items() if data["growth_rate"] > 20.0]
        
        if high_performing:
            recommendations.append(f"Focus on high-performing hashtags: {', '.join(high_performing[:3])}")
        
        if low_competition:
            recommendations.append(f"Use low-competition hashtags for better reach: {', '.join(low_competition[:3])}")
        
        if trending_up:
            recommendations.append(f"Include trending hashtags: {', '.join(trending_up[:3])}")
        
        if len(recommendations) == 0:
            recommendations.append("Mix popular and niche hashtags for optimal reach")
        
        return recommendations
    
    def _get_timestamp(self) -> str:
        """Get current timestamp"""
        from datetime import datetime
        return datetime.now().isoformat()
