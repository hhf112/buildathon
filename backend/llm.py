"""
GeminiAPIWrapper Class for Hackathon
Uses google.genai library as requested

Installation:
pip install google-genai

Usage:
from google import genai
wrapper = GeminiAPIWrapper(api_key="your_key_here")
response = wrapper.invoke("Your prompt here")
"""

import os
from google import genai
from google.genai import types
from PIL import Image
from io import BytesIO

class GeminiAPIWrapper:
    """
    Wrapper class for Google's Gemini API using google.genai library
    """

    def __init__(self, api_key="AIzaSyAIeZAEGm4EkZ480ajuvGy6lcILlbdf1_8"):
        """
        Initialize the Gemini API wrapper

        Args:
            api_key (str): The API key for Gemini. If None, looks for GEMINI_API_KEY env var
        """
        self.api_key = api_key or os.getenv('GEMINI_API_KEY')
        self.model_name = "models/gemini-2.5-flash"
        self.client = None
        self.is_initialized = False

        if self.api_key:
            try:
                from google import genai

                # Set API key in environment if needed
                if 'GEMINI_API_KEY' not in os.environ:
                    os.environ['GEMINI_API_KEY'] = self.api_key

                # Initialize client
                self.client = genai.Client()
                self.is_initialized = True
                print(f"✅ Gemini API initialized successfully")

            except ImportError:
                print("❌ Error: google-genai library not installed")
                print("Install with: pip install google-genai")
                self.is_initialized = False

            except Exception as e:
                print(f"❌ API initialization error: {e}")
                self.is_initialized = False
        else:
            print("⚠️ Warning: No API key provided")

    def set_model(self, model_name):
        """
        Set the Gemini model to use

        Args:
            model_name (str): Model name (e.g., 'gemini-2.0-flash-exp', 'gemini-1.5-pro')
        """
        self.model_name = model_name
        print(f"Model set to: {self.model_name}")

    def invoke(self, prompt, max_tokens=1000, temperature=0.7):
        """
        Invoke the Gemini model with a prompt

        Args:
            prompt (str): Input prompt for content generation
            max_tokens (int): Maximum tokens in response
            temperature (float): Creativity level (0.0 to 1.0)

        Returns:
            str: Generated content from Gemini
        """
        if not self.is_initialized or not self.client:
            raise Exception("Gemini API not initialized. Check API key and installation.")

        try:
            # Make API call using google.genai library
            response = self.client.models.generate_content(
                model=self.model_name,
                contents=prompt
            )

            return response.text

        except Exception as e:
            print(f"API call error: {e}")
            raise

    def imagegen(self, prompt):
        """
        Generate an image based on a prompt

        Args:
            prompt (str): Input prompt for image generation

        Returns:
            str: URL or path to the generated image
        """
        if not self.is_initialized or not self.client:
            raise Exception("Gemini API not initialized. Check API key and installation.")

        try:
            # Make API call using google.genai library
            response = self.client.models.generate_content(
                model="gemini-2.5-flash-image-preview",
                contents=[prompt],
            )
            for part in response.candidates[0].content.parts:
                if part.text is not None:
                    print(part.text)
                elif part.inline_data is not None:
                    image = Image.open(BytesIO(part.inline_data.data))
                    # image.save("generated_image.png")

            return image
        
        except Exception as e:
            print(f"API call error: {e}")
            raise

    def test_connection(self):
        """Test API connection"""
        try:
            test_response = self.invoke("Hello", max_tokens=10)
            return len(test_response) > 0
        except:
            return False

# Example usage:
if __name__ == "__main__":
    # Initialize wrapper
    wrapper = GeminiAPIWrapper()

    # Generate content
    if wrapper.is_initialized:
        result = wrapper.invoke("Create a short insurance marketing message")
        print("Generated:", result)
    else:
        print("API not initialized - check your setup")