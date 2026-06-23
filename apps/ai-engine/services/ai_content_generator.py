import asyncio
from typing import Dict, Any, Optional
import openai
import json
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
import torch

class AIContentGenerator:
    def __init__(self):
        self.openai_client = openai.OpenAI(api_key=self._get_openai_key())
        self.arabic_model = None
        self.tokenizer = None
        self._load_models()
    
    def _get_openai_key(self) -> str:
        import os
        return os.getenv("OPENAI_API_KEY", "")
    
    def _load_models(self):
        """Load Arabic-specific models for better content generation"""
        try:
            # Load Arabic language model
            model_name = "aubmindlab/arabert-base"
            self.tokenizer = AutoTokenizer.from_pretrained(model_name)
            self.arabic_model = AutoModelForSeq2SeqLM.from_pretrained(model_name)
        except Exception as e:
            print(f"Failed to load Arabic model: {e}")
    
    async def generate_content(
        self,
        topic: str,
        platform: str,
        dialect: str = "egyptian",
        tone: str = "casual",
        length: str = "medium",
        target_audience: Optional[str] = None
    ) -> Dict[str, Any]:
        """Generate social media content based on parameters"""
        
        # Platform-specific guidelines
        platform_guides = {
            "instagram": {
                "max_length": 2200,
                "style": "visual-focused",
                "hashtags": 15
            },
            "twitter": {
                "max_length": 280,
                "style": "concise",
                "hashtags": 3
            },
            "facebook": {
                "max_length": 5000,
                "style": "conversational",
                "hashtags": 10
            },
            "tiktok": {
                "max_length": 150,
                "style": "trendy",
                "hashtags": 5
            }
        }
        
        guide = platform_guides.get(platform, platform_guides["instagram"])
        
        # Dialect-specific prompts
        dialect_prompts = {
            "egyptian": "Write in authentic Egyptian Arabic dialect",
            "gulf": "Write in Gulf Arabic dialect (Saudi, Kuwait, UAE)",
            "levantine": "Write in Levantine Arabic dialect",
            "modern_standard": "Write in Modern Standard Arabic"
        }
        
        # Tone-specific instructions
        tone_instructions = {
            "casual": "Use casual, friendly language",
            "professional": "Use professional, business-appropriate language",
            "humorous": "Include humor and wit",
            "inspirational": "Use motivational and inspiring language",
            "educational": "Use informative, educational tone"
        }
        
        # Create the prompt
        prompt = f"""
        Create social media content with the following specifications:
        
        Topic: {topic}
        Platform: {platform}
        Dialect: {dialect_prompts.get(dialect, dialect_prompts["egyptian"])}
        Tone: {tone_instructions.get(tone, tone_instructions["casual"])}
        Length: {length} (max {guide["max_length"]} characters)
        Style: {guide["style"]}
        Target Audience: {target_audience or "General Arab audience"}
        
        Requirements:
        - Content must be engaging and shareable
        - Include relevant emojis
        - Use platform-appropriate formatting
        - Generate {guide["hashtags"]} relevant hashtags
        - Content should resonate with Arab culture and values
        
        Return the response in JSON format with:
        {{
            "content": "main content text",
            "hashtags": ["hashtag1", "hashtag2", ...],
            "emojis": ["emoji1", "emoji2", ...],
            "engagement_score": 85,
            "suggestions": ["suggestion1", "suggestion2", ...]
        }}
        """
        
        try:
            # Try OpenAI first for better quality
            response = self.openai_client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "You are an expert social media content creator specializing in Arabic content for Arab audiences."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=1000
            )
            
            content_text = response.choices[0].message.content
            result = json.loads(content_text)
            
            # Add metadata
            result.update({
                "platform": platform,
                "dialect": dialect,
                "tone": tone,
                "character_count": len(result.get("content", "")),
                "hashtag_count": len(result.get("hashtags", []))
            })
            
            return result
            
        except Exception as e:
            # Fallback to local model if OpenAI fails
            return await self._generate_local_content(
                topic, platform, dialect, tone, length, target_audience
            )
    
    async def generate_bio(
        self,
        topic: str,
        dialect: str = "egyptian",
        tone: str = "casual",
        platform: str = "instagram"
    ) -> Dict[str, Any]:
        """Generate social media bio/profile description"""
        
        platform_limits = {
            "instagram": 150,
            "twitter": 160,
            "facebook": 255,
            "tiktok": 80
        }
        
        max_length = platform_limits.get(platform, 150)
        
        prompt = f"""
        Create a compelling social media bio with these specifications:
        
        Topic/Niche: {topic}
        Platform: {platform}
        Dialect: {dialect}
        Tone: {tone}
        Max Length: {max_length} characters
        
        Requirements:
        - Must be attention-grabbing
        - Clearly describe what the account is about
        - Include relevant emojis
        - Add a call-to-action if appropriate
        - Use platform-specific formatting
        
        Return in JSON format:
        {{
            "bio": "bio text here",
            "emojis": ["emoji1", "emoji2"],
            "keywords": ["keyword1", "keyword2"],
            "character_count": 120
        }}
        """
        
        try:
            response = self.openai_client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "You are an expert social media bio writer specializing in Arabic bios."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.8,
                max_tokens=300
            )
            
            content_text = response.choices[0].message.content
            result = json.loads(content_text)
            
            return result
            
        except Exception as e:
            # Fallback bio generation
            return {
                "bio": f" specialist in {topic} | Sharing valuable content daily | Follow for more! ",
                "emojis": ["", ""],
                "keywords": [topic],
                "character_count": len(f" specialist in {topic} | Sharing valuable content daily | Follow for more! ")
            }
    
    async def _generate_local_content(
        self,
        topic: str,
        platform: str,
        dialect: str,
        tone: str,
        length: str,
        target_audience: Optional[str]
    ) -> Dict[str, Any]:
        """Fallback local model content generation"""
        
        # Simple template-based fallback
        templates = {
            "casual": f" ! {topic}  | Share your thoughts below  | # {topic} #social #arab",
            "professional": f"Exploring {topic} with professional insights. Join the discussion. #{topic} #business #arabworld",
            "humorous": f" {topic}  ! Who else relates?  #funny #{topic} #arabmemes",
            "inspirational": f"Transform your {topic} journey! Every step counts. #motivation #{topic} #success",
            "educational": f"Learn about {topic} - key insights and tips. #education #{topic} #learn"
        }
        
        content = templates.get(tone, templates["casual"])
        hashtags = [f"#{topic}", "#social", "#arab"]
        
        return {
            "content": content,
            "hashtags": hashtags,
            "emojis": ["", ""],
            "engagement_score": 75,
            "suggestions": ["Add more specific details", "Include a question to engage audience"],
            "platform": platform,
            "dialect": dialect,
            "tone": tone,
            "character_count": len(content),
            "hashtag_count": len(hashtags),
            "fallback": True
        }
