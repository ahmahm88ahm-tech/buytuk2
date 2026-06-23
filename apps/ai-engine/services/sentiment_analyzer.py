import asyncio
import json
from typing import Dict, Any, List
import re
import arabicstopwords as asw
from textblob import TextBlob

class SentimentAnalyzer:
    def __init__(self):
        self.arabic_positive_words = self._load_arabic_positive_words()
        self.arabic_negative_words = self._load_arabic_negative_words()
        self.emoji_sentiments = self._load_emoji_sentiments()
    
    def _load_arabic_positive_words(self) -> set:
        """Load Arabic positive sentiment words"""
        return {
            '', '', '', '', '', '', '', '', '', '',
            '', '', '', '', '', '', '', '', '', '',
            '', '', '', '', '', '', '', '', '', '',
            '', '', '', '', '', '', '', '', '', '',
            '', '', '', '', '', '', '', '', '', '',
            'excellent', 'great', 'amazing', 'wonderful', 'fantastic', 'perfect', 'love', 'best', 'awesome', 'brilliant'
        }
    
    def _load_arabic_negative_words(self) -> set:
        """Load Arabic negative sentiment words"""
        return {
            '', '', '', '', '', '', '', '', '', '',
            '', '', '', '', '', '', '', '', '', '',
            '', '', '', '', '', '', '', '', '', '',
            '', '', '', '', '', '', '', '', '', '',
            '', '', '', '', '', '', '', '', '', '',
            'bad', 'terrible', 'awful', 'horrible', 'worst', 'hate', 'disgusting', 'disappointing', 'poor', 'fail'
        }
    
    def _load_emoji_sentiments(self) -> Dict[str, str]:
        """Load emoji sentiment mappings"""
        return {
            '': 'positive', '': 'positive', '': 'positive', '': 'positive', '': 'positive',
            '': 'positive', '': 'positive', '': 'positive', '': 'positive', '': 'positive',
            '': 'negative', '': 'negative', '': 'negative', '': 'negative', '': 'negative',
            '': 'negative', '': 'negative', '': 'negative', '': 'negative', '': 'negative',
            '': 'neutral', '': 'neutral', '': 'neutral', '': 'neutral', '': 'neutral',
            '': 'positive', '': 'positive', '': 'positive', '': 'positive', '': 'positive',
            '': 'negative', '': 'negative', '': 'negative', '': 'negative', '': 'negative'
        }
    
    async def analyze_sentiment(self, text: str) -> Dict[str, Any]:
        """Analyze sentiment of Arabic/English text"""
        
        # Clean and preprocess text
        cleaned_text = self._clean_text(text)
        
        # Extract emojis
        emojis = self._extract_emojis(text)
        
        # Analyze Arabic sentiment
        arabic_sentiment = self._analyze_arabic_sentiment(cleaned_text)
        
        # Analyze English sentiment (if any)
        english_sentiment = self._analyze_english_sentiment(cleaned_text)
        
        # Analyze emoji sentiment
        emoji_sentiment = self._analyze_emoji_sentiment(emojis)
        
        # Combine sentiments
        overall_sentiment = self._combine_sentiments(arabic_sentiment, english_sentiment, emoji_sentiment)
        
        # Extract emotional aspects
        emotions = self._extract_emotions(cleaned_text)
        
        # Calculate confidence scores
        confidence = self._calculate_confidence(arabic_sentiment, english_sentiment, emoji_sentiment)
        
        return {
            "text": text,
            "cleaned_text": cleaned_text,
            "overall_sentiment": overall_sentiment["sentiment"],
            "sentiment_score": overall_sentiment["score"],
            "confidence": confidence,
            "arabic_sentiment": arabic_sentiment,
            "english_sentiment": english_sentiment,
            "emoji_sentiment": emoji_sentiment,
            "emojis": emojis,
            "emotions": emotions,
            "language_detected": self._detect_language(text),
            "word_count": len(cleaned_text.split()),
            "character_count": len(text)
        }
    
    def _clean_text(self, text: str) -> str:
        """Clean and normalize text"""
        # Remove URLs
        text = re.sub(r'http\S+|www\S+|https\S+', '', text, flags=re.MULTILINE)
        
        # Remove mentions and hashtags symbols (keep the text)
        text = re.sub(r'[@#]', '', text)
        
        # Remove extra whitespace
        text = re.sub(r'\s+', ' ', text).strip()
        
        # Remove punctuation (except Arabic diacritics)
        text = re.sub(r'[^\w\s\-\'\u0621-\u064A\u0660-\u0669]', ' ', text)
        
        return text
    
    def _extract_emojis(self, text: str) -> List[str]:
        """Extract emojis from text"""
        emoji_pattern = re.compile(
            "["
            "\U0001F600-\U0001F64F"  # emoticons
            "\U0001F300-\U0001F5FF"  # symbols & pictographs
            "\U0001F680-\U0001F6FF"  # transport & map symbols
            "\U0001F1E0-\U0001F1FF"  # flags (iOS)
            "\U00002702-\U000027B0"
            "\U000024C2-\U0001F251"
            "]+", flags=re.UNICODE
        )
        return emoji_pattern.findall(text)
    
    def _analyze_arabic_sentiment(self, text: str) -> Dict[str, Any]:
        """Analyze sentiment for Arabic text"""
        words = text.split()
        
        positive_count = sum(1 for word in words if word in self.arabic_positive_words)
        negative_count = sum(1 for word in words if word in self.arabic_negative_words)
        total_words = len(words)
        
        if total_words == 0:
            return {"sentiment": "neutral", "score": 0.0, "positive_words": 0, "negative_words": 0}
        
        # Calculate sentiment score
        score = (positive_count - negative_count) / total_words
        
        # Determine sentiment
        if score > 0.1:
            sentiment = "positive"
        elif score < -0.1:
            sentiment = "negative"
        else:
            sentiment = "neutral"
        
        return {
            "sentiment": sentiment,
            "score": score,
            "positive_words": positive_count,
            "negative_words": negative_count,
            "total_words": total_words
        }
    
    def _analyze_english_sentiment(self, text: str) -> Dict[str, Any]:
        """Analyze sentiment for English text using TextBlob"""
        try:
            blob = TextBlob(text)
            polarity = blob.sentiment.polarity
            
            if polarity > 0.1:
                sentiment = "positive"
            elif polarity < -0.1:
                sentiment = "negative"
            else:
                sentiment = "neutral"
            
            return {
                "sentiment": sentiment,
                "score": polarity,
                "subjectivity": blob.sentiment.subjectivity
            }
        except:
            return {"sentiment": "neutral", "score": 0.0, "subjectivity": 0.0}
    
    def _analyze_emoji_sentiment(self, emojis: List[str]) -> Dict[str, Any]:
        """Analyze sentiment from emojis"""
        if not emojis:
            return {"sentiment": "neutral", "score": 0.0, "positive_count": 0, "negative_count": 0}
        
        positive_count = sum(1 for emoji in emojis if self.emoji_sentiments.get(emoji) == "positive")
        negative_count = sum(1 for emoji in emojis if self.emoji_sentiments.get(emoji) == "negative")
        neutral_count = sum(1 for emoji in emojis if self.emoji_sentiments.get(emoji) == "neutral")
        
        total_emojis = len(emojis)
        score = (positive_count - negative_count) / total_emojis if total_emojis > 0 else 0
        
        if score > 0.1:
            sentiment = "positive"
        elif score < -0.1:
            sentiment = "negative"
        else:
            sentiment = "neutral"
        
        return {
            "sentiment": sentiment,
            "score": score,
            "positive_count": positive_count,
            "negative_count": negative_count,
            "neutral_count": neutral_count,
            "total_emojis": total_emojis
        }
    
    def _combine_sentiments(
        self,
        arabic_sentiment: Dict[str, Any],
        english_sentiment: Dict[str, Any],
        emoji_sentiment: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Combine sentiment analysis from different sources"""
        
        # Weight the different sentiment sources
        arabic_weight = 0.4
        english_weight = 0.3
        emoji_weight = 0.3
        
        # Calculate weighted score
        weighted_score = (
            arabic_sentiment["score"] * arabic_weight +
            english_sentiment["score"] * english_weight +
            emoji_sentiment["score"] * emoji_weight
        )
        
        # Determine overall sentiment
        if weighted_score > 0.1:
            sentiment = "positive"
        elif weighted_score < -0.1:
            sentiment = "negative"
        else:
            sentiment = "neutral"
        
        return {
            "sentiment": sentiment,
            "score": weighted_score,
            "components": {
                "arabic": arabic_sentiment,
                "english": english_sentiment,
                "emoji": emoji_sentiment
            }
        }
    
    def _extract_emotions(self, text: str) -> Dict[str, float]:
        """Extract emotional aspects from text"""
        emotions = {
            "joy": 0.0,
            "anger": 0.0,
            "sadness": 0.0,
            "fear": 0.0,
            "surprise": 0.0,
            "disgust": 0.0
        }
        
        # Simple keyword-based emotion detection
        joy_keywords = ['', '', '', 'happy', 'joy', 'excited']
        anger_keywords = ['', '', '', 'angry', 'mad', 'furious']
        sadness_keywords = ['', '', '', 'sad', 'cry', 'depressed']
        fear_keywords = ['', '', '', 'afraid', 'scared', 'worried']
        surprise_keywords = ['', '', '', 'surprised', 'shocked', 'amazed']
        disgust_keywords = ['', '', '', 'disgusted', 'gross', 'terrible']
        
        words = text.lower().split()
        
        for word in words:
            if word in joy_keywords:
                emotions["joy"] += 0.2
            if word in anger_keywords:
                emotions["anger"] += 0.2
            if word in sadness_keywords:
                emotions["sadness"] += 0.2
            if word in fear_keywords:
                emotions["fear"] += 0.2
            if word in surprise_keywords:
                emotions["surprise"] += 0.2
            if word in disgust_keywords:
                emotions["disgust"] += 0.2
        
        # Normalize emotions
        max_emotion = max(emotions.values())
        if max_emotion > 0:
            emotions = {k: v / max_emotion for k, v in emotions.items()}
        
        return emotions
    
    def _calculate_confidence(
        self,
        arabic_sentiment: Dict[str, Any],
        english_sentiment: Dict[str, Any],
        emoji_sentiment: Dict[str, Any]
    ) -> float:
        """Calculate confidence score for sentiment analysis"""
        
        # Base confidence on agreement between different methods
        sentiments = [
            arabic_sentiment["sentiment"],
            english_sentiment["sentiment"],
            emoji_sentiment["sentiment"]
        ]
        
        # Count how many methods agree
        most_common = max(set(sentiments), key=sentiments.count)
        agreement_count = sentiments.count(most_common)
        
        # Calculate confidence based on agreement
        confidence = agreement_count / len(sentiments)
        
        # Adjust confidence based on data availability
        if arabic_sentiment["total_words"] == 0:
            confidence *= 0.8
        if emoji_sentiment["total_emojis"] == 0:
            confidence *= 0.9
        
        return min(confidence, 1.0)
    
    def _detect_language(self, text: str) -> str:
        """Detect if text is primarily Arabic or English"""
        arabic_chars = len(re.findall(r'[\u0621-\u064A]', text))
        english_chars = len(re.findall(r'[a-zA-Z]', text))
        total_chars = arabic_chars + english_chars
        
        if total_chars == 0:
            return "unknown"
        
        arabic_ratio = arabic_chars / total_chars
        return "arabic" if arabic_ratio > 0.5 else "english"
