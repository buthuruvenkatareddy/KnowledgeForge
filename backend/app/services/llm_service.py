from transformers import pipeline
import torch
from typing import Optional, List
import warnings
import re
warnings.filterwarnings("ignore")

class LocalLLMService:
    """Enhanced local LLM service for ChatGPT-like document understanding"""
    
    def __init__(self):
        self.qa_pipeline = None
        self.explanation_pipeline = None
        self.concept_explanations = {
            'cnn': 'Convolutional Neural Network - A deep learning algorithm designed for processing grid-like data such as images. CNNs use convolutional layers to automatically detect features.',
            'rnn': 'Recurrent Neural Network - A neural network designed for sequential data processing.',
            'lstm': 'Long Short-Term Memory - A type of RNN that can learn long-term dependencies.',
            'api': 'Application Programming Interface - A set of protocols and tools for building software applications.',
            'ml': 'Machine Learning - A subset of AI that enables computers to learn without explicit programming.',
            'ai': 'Artificial Intelligence - Technology that enables machines to simulate human intelligence.',
            'nlp': 'Natural Language Processing - AI field focused on interaction between computers and human language.',
            'gpu': 'Graphics Processing Unit - Specialized hardware for parallel processing, commonly used in AI.',
            'cpu': 'Central Processing Unit - The main processor that executes computer instructions.',
            'sql': 'Structured Query Language - Language for managing and querying relational databases.',
            'rest': 'Representational State Transfer - Architectural style for designing web services.',
            'json': 'JavaScript Object Notation - Lightweight data interchange format.',
            'http': 'HyperText Transfer Protocol - Protocol for transferring data over the web.',
            'css': 'Cascading Style Sheets - Language for styling web pages.',
            'html': 'HyperText Markup Language - Standard markup language for web pages.',
            'js': 'JavaScript - Programming language primarily used for web development.',
            'react': 'React - JavaScript library for building user interfaces.',
            'node': 'Node.js - JavaScript runtime built on Chrome\'s V8 JavaScript engine.',
            'mongodb': 'MongoDB - NoSQL database program that uses JSON-like documents.',
            'express': 'Express.js - Web application framework for Node.js.',
        }
        self._initialize_model()
    
    def _initialize_model(self):
        """Initialize the Hugging Face models for Q&A and explanations"""
        try:
            print("🤖 Loading enhanced AI models for ChatGPT-like responses...")
            
            # Primary Q&A model for direct answers
            self.qa_pipeline = pipeline(
                "question-answering",
                model="distilbert-base-uncased-distilled-squad",
                device=0 if torch.cuda.is_available() else -1
            )
            
            # Secondary model for generating explanations
            try:
                self.explanation_pipeline = pipeline(
                    "text-generation",
                    model="microsoft/DialoGPT-small",
                    max_length=300,
                    do_sample=True,
                    temperature=0.7,
                    device=0 if torch.cuda.is_available() else -1,
                    return_full_text=False
                )
                print("✅ Enhanced AI models loaded successfully!")
            except Exception as e:
                print(f"⚠️ Explanation model failed to load: {e}")
                self.explanation_pipeline = None
                print("✅ Q&A model loaded - basic functionality available")
            
        except Exception as e:
            print(f"❌ Model loading failed: {e}")
            print("🔄 Will use intelligent fallback responses")
            self.qa_pipeline = None
            self.explanation_pipeline = None
    
    def is_available(self) -> bool:
        """Check if at least the Q&A model is available"""
        return self.qa_pipeline is not None
    
    def generate_response(self, prompt: str, context: str = "") -> str:
        """Generate ChatGPT-like response with enhanced understanding"""
        try:
            # If we have models and context, use AI
            if self.qa_pipeline and context.strip():
                return self._generate_intelligent_response(prompt, context)
            
            # Otherwise use enhanced fallback
            return self._enhanced_fallback_response(prompt, context)
            
        except Exception as e:
            print(f"Response generation error: {e}")
            return self._enhanced_fallback_response(prompt, context)
    
    def _generate_intelligent_response(self, question: str, context: str) -> str:
        """Generate AI-powered response with concept explanations"""
        try:
            # Limit context length for better performance
            clean_context = context[:3000].strip()
            
            # Try Q&A pipeline first
            result = self.qa_pipeline(
                question=question,
                context=clean_context
            )
            
            answer = result['answer']
            confidence = result['score']
            
            # If we got a good direct answer, enhance it
            if confidence > 0.05 and len(answer) > 10:
                enhanced_response = self._enhance_answer_with_explanations(question, answer, clean_context)
                return enhanced_response
            else:
                # Generate a more comprehensive response using context analysis
                return self._generate_contextual_response(question, clean_context)
                
        except Exception as e:
            print(f"AI response error: {e}")
            return self._generate_contextual_response(question, context)
    
    def _enhance_answer_with_explanations(self, question: str, answer: str, context: str) -> str:
        """Enhance a basic answer with clean, structured explanations"""
        
        # Check if the question is asking for an explanation
        is_explanation_query = any(word in question.lower() for word in [
            'explain', 'what is', 'what are', 'how does', 'describe', 'define', 'tell me about'
        ])
        
        # Find technical terms in the answer and context that could be explained
        technical_terms = self._find_technical_terms(answer + " " + context)
        
        # Create a clean, structured response
        if is_explanation_query and technical_terms:
            # For explanation queries, lead with the concept explanation
            main_term = technical_terms[0] if technical_terms else None
            if main_term:
                explanation = self._get_concept_explanation(main_term)
                if explanation:
                    enhanced_response = f"## {main_term.upper()}\n\n{explanation}"
                    
                    # Add relevant information from your documents
                    relevant_info = self._extract_relevant_info(context, main_term)
                    if relevant_info:
                        enhanced_response += f"\n\n**From your documents:**\n{relevant_info}"
                    
                    # Add related technical terms if available
                    if len(technical_terms) > 1:
                        enhanced_response += "\n\n**Related Technologies:**"
                        for term in technical_terms[1:3]:  # Show 2 more related terms
                            term_explanation = self._get_concept_explanation(term)
                            if term_explanation:
                                enhanced_response += f"\n• **{term.upper()}**: {term_explanation}"
                    
                    return enhanced_response
        
        # For non-explanation queries, provide direct answer with minimal context
        clean_answer = self._clean_answer_text(answer)
        enhanced_response = clean_answer
        
        # Add brief technical context if relevant terms are mentioned
        if technical_terms and len(technical_terms) <= 2:
            enhanced_response += "\n\n**Technical Notes:**"
            for term in technical_terms:
                explanation = self._get_concept_explanation(term)
                if explanation:
                    enhanced_response += f"\n• **{term.upper()}**: {explanation}"
        
        return enhanced_response
    
    def generate_enhanced_response(self, question: str, context: str) -> str:
        """Generate enhanced response with concept understanding - main method for RAG service"""
        return self.generate_response(question, context)
    
    def answer_question(self, question: str, context: str) -> str:
        """Direct Q&A method for testing"""
        try:
            if self.qa_pipeline and context.strip():
                result = self.qa_pipeline(
                    question=question,
                    context=context[:2000]  # Limit context for better performance
                )
                return result['answer']
            else:
                return self._intelligent_fallback_answer(question, context)
        except Exception as e:
            return f"Error processing question: {str(e)}"
    
    def _intelligent_fallback_answer(self, question: str, context: str) -> str:
        """Intelligent fallback when Q&A model is not available"""
        # Extract relevant sentences from context
        sentences = context.split('.')
        relevant_sentences = []
        
        # Find sentences that might be relevant to the question
        question_words = set(question.lower().split())
        for sentence in sentences:
            sentence_words = set(sentence.lower().split())
            if question_words.intersection(sentence_words):
                relevant_sentences.append(sentence.strip())
        
        if relevant_sentences:
            return ". ".join(relevant_sentences[:2])  # Return most relevant sentences
        else:
            return "Based on the provided context, I cannot find specific information to answer this question."

    def _generate_contextual_response(self, question: str, context: str) -> str:
        """Generate a clean, well-structured response by analyzing context"""
        
        if not context.strip():
            return "I couldn't find relevant information in your documents to answer this question."
        
        # Extract key information from context without showing raw chunks
        clean_info = self._extract_clean_information(context, question)
        
        # Check if this is an explanation question
        is_explanation_query = any(word in question.lower() for word in [
            'explain', 'what is', 'what are', 'how does', 'describe', 'define', 'tell me about'
        ])
        
        if is_explanation_query:
            # For explanation queries, provide structured educational response
            technical_terms = self._find_technical_terms(context)
            if technical_terms:
                main_term = technical_terms[0]
                explanation = self._get_concept_explanation(main_term)
                if explanation:
                    response = f"## {main_term.upper()}\n\n{explanation}"
                    
                    # Add relevant context from documents
                    if clean_info:
                        response += f"\n\n**From your documents:**\n{clean_info}"
                    
                    # Add related technologies if available
                    if len(technical_terms) > 1:
                        response += "\n\n**Related Technologies:**"
                        for term in technical_terms[1:3]:
                            term_explanation = self._get_concept_explanation(term)
                            if term_explanation:
                                response += f"\n• **{term.upper()}**: {term_explanation}"
                    
                    return response
        
        # For direct questions, provide clean factual answers
        if clean_info:
            response = clean_info
            
            # Add brief technical context if technical terms are mentioned
            technical_terms = self._find_technical_terms(context)
            if technical_terms and len(technical_terms) <= 2:
                response += "\n\n**Technical Context:**"
                for term in technical_terms:
                    explanation = self._get_concept_explanation(term)
                    if explanation:
                        response += f"\n• **{term.upper()}**: {explanation}"
            
            return response
        else:
            return "I found information in your documents, but I need more context to provide a specific answer to your question."
    
    def _extract_clean_information(self, context: str, question: str) -> str:
        """Extract clean, relevant information without showing document metadata"""
        
        # Remove document metadata patterns
        clean_context = re.sub(r"From '[^']*':\s*", "", context)
        clean_context = re.sub(r"From \w+:\s*", "", clean_context)
        
        # Split into sentences and clean them
        sentences = [s.strip() for s in clean_context.split('.') if s.strip() and len(s.strip()) > 15]
        
        # Find most relevant sentences based on question keywords
        question_words = set(word.lower() for word in question.split() if len(word) > 2)
        scored_sentences = []
        
        for sentence in sentences:
            sentence_words = set(word.lower() for word in sentence.split())
            overlap = len(question_words.intersection(sentence_words))
            if overlap > 0:
                scored_sentences.append((sentence, overlap))
        
        # Sort by relevance and take top sentences
        scored_sentences.sort(key=lambda x: x[1], reverse=True)
        
        if scored_sentences:
            # Take the most relevant sentences and format them nicely
            top_sentences = [s[0] for s in scored_sentences[:2]]
            return '. '.join(top_sentences) + '.'
        elif sentences:
            # Fall back to first sentence if no keyword overlap
            return sentences[0] + '.'
        else:
            return ""
    
    def _extract_relevant_info(self, context: str, term: str) -> str:
        """Extract information specifically relevant to a technical term"""
        
        # Clean the context from document metadata
        clean_context = re.sub(r"From '[^']*':\s*", "", context)
        
        # Find sentences that mention the term or related concepts
        sentences = [s.strip() for s in clean_context.split('.') if s.strip()]
        relevant_sentences = []
        
        term_lower = term.lower()
        for sentence in sentences:
            if term_lower in sentence.lower() or any(related in sentence.lower() for related in [
                'built', 'developed', 'implemented', 'used', 'applied', 'created'
            ]):
                relevant_sentences.append(sentence)
        
        if relevant_sentences:
            return '. '.join(relevant_sentences[:2]) + '.'
        return ""
    
    def _clean_answer_text(self, answer: str) -> str:
        """Clean and format the answer text for better presentation"""
        
        # Remove extra whitespace and clean up
        clean_answer = answer.strip()
        
        # Capitalize first letter if needed
        if clean_answer and clean_answer[0].islower():
            clean_answer = clean_answer[0].upper() + clean_answer[1:]
        
        # Ensure it ends with proper punctuation
        if clean_answer and not clean_answer.endswith(('.', '!', '?')):
            clean_answer += '.'
        
        return clean_answer

    def _find_technical_terms(self, text: str) -> List[str]:
        """Find technical terms and acronyms in the text"""
        text_lower = text.lower()
        found_terms = []
        
        # Check for known technical terms
        for term in self.concept_explanations.keys():
            if term in text_lower:
                found_terms.append(term)
        
        # Look for potential acronyms (2-5 uppercase letters)
        acronyms = re.findall(r'\b[A-Z]{2,5}\b', text)
        for acronym in acronyms:
            if acronym.lower() in self.concept_explanations:
                found_terms.append(acronym.lower())
        
        # Remove duplicates while preserving order
        unique_terms = []
        for term in found_terms:
            if term not in unique_terms:
                unique_terms.append(term)
        
        return unique_terms[:3]  # Limit to 3 terms
    
    def _get_concept_explanation(self, concept: str) -> str:
        """Get explanation for a technical concept"""
        concept_lower = concept.lower()
        
        # Direct lookup in our knowledge base
        if concept_lower in self.concept_explanations:
            return self.concept_explanations[concept_lower]
        
        # If not found, try to generate a basic explanation
        return None
    
    def _enhanced_fallback_response(self, question: str, context: str) -> str:
        """Create a clean, structured fallback response when AI models aren't available"""
        if not context.strip():
            return "I couldn't find relevant information in your documents to answer this question. Please make sure you've uploaded documents that contain information related to your query."
        
        # Extract clean information without document metadata
        clean_info = self._extract_clean_information(context, question)
        
        if not clean_info:
            return "I found some information in your documents, but I need more specific details to answer your question accurately."
        
        # Check if this is an explanation question
        is_explanation_query = any(word in question.lower() for word in [
            'explain', 'what is', 'what are', 'how does', 'describe', 'define', 'tell me about'
        ])
        
        if is_explanation_query:
            # For explanation queries, try to provide educational content
            technical_terms = self._find_technical_terms(context)
            if technical_terms:
                main_term = technical_terms[0]
                explanation = self._get_concept_explanation(main_term)
                if explanation:
                    response = f"## {main_term.upper()}\n\n{explanation}"
                    if clean_info:
                        response += f"\n\n**From your documents:**\n{clean_info}"
                    return response
        
        # For direct questions, provide clean factual answers
        response = clean_info
        
        # Add technical context if relevant
        technical_terms = self._find_technical_terms(context)
        if technical_terms and len(technical_terms) <= 2:
            response += "\n\n**Technical Notes:**"
            for term in technical_terms[:2]:
                explanation = self._get_concept_explanation(term)
                if explanation:
                    response += f"\n• **{term.upper()}**: {explanation}"
        
        return response

# Global instance
llm_service = LocalLLMService()