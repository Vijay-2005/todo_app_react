import requests
import json
from typing import Optional
import re

class GeminiChatbot:
    def __init__(self, api_key: str):
        """
        Initialize the chatbot with your Gemini API key.
        
        Args:
            api_key (str): Your Gemini API key from Google AI Studio
        """
        self.api_key = api_key.strip()  # Remove any whitespace
        self.base_url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent"
        
    def validate_api_key(self) -> bool:
        """
        Perform basic validation of the API key format.
        """
        # Google API keys typically start with 'AI' and are 39 characters long
        return bool(re.match(r'^AI[a-zA-Z0-9_-]{37}$', self.api_key))
        
    def get_response(self, message: str) -> Optional[str]:
        """
        Send a message to the Gemini API and get the response.
        
        Args:
            message (str): The message to send to the chatbot
            
        Returns:
            str: The chatbot's response, or None if there's an error
        """
        # First validate the API key format
        if not self.validate_api_key():
            return ("Error: Invalid API key format. Please ensure you're using a valid API key from "
                   "Google AI Studio (should start with 'AI' and be 39 characters long).")
            
        try:
            # Construct the full URL with the API key
            url = f"{self.base_url}?key={self.api_key}"
            
            # Prepare the request payload
            payload = {
                "contents": [{
                    "parts": [{"text": message}]
                }]
            }
            
            # Make the API request
            headers = {'Content-Type': 'application/json'}
            response = requests.post(url, headers=headers, json=payload)
            
            # Handle authentication errors specifically
            if response.status_code == 401:
                return ("Authentication failed. Please make sure:\n"
                       "1. You've created a project in Google Cloud Console\n"
                       "2. Enabled the Gemini API for your project\n"
                       "3. Created an API key in Google AI Studio\n"
                       "4. The API key has the necessary permissions\n"
                       "Visit: https://makersuite.google.com/app/apikey to get your API key")
            
            # Check other status codes
            response.raise_for_status()
            
            # Parse the response
            result = response.json()
            
            # Extract the response text
            if 'candidates' in result and len(result['candidates']) > 0:
                text_parts = [
                    part['text'] 
                    for part in result['candidates'][0]['content']['parts'] 
                    if 'text' in part
                ]
                return ' '.join(text_parts)
            
            return "Sorry, I couldn't generate a response."
            
        except requests.exceptions.RequestException as e:
            return f"Network error: {str(e)}"
        except json.JSONDecodeError as e:
            return f"Error parsing response: {str(e)}"
        except KeyError as e:
            return f"Unexpected response format: {str(e)}"

def main():
    """
    Main function to run the chatbot interface.
    """
    print("Welcome to the Gemini Chatbot!")
    print("\nTo get started, you need an API key from Google AI Studio:")
    print("1. Go to https://makersuite.google.com/app/apikey")
    print("2. Create or select a project")
    print("3. Generate an API key")
    print("4. Copy the key (it should start with 'AI')")
    
    # Get the API key from the user
    api_key = input("AIzaSyDx1dAKSoH8sqeX0T9miXC8WNTyteRZ12o")
    
    # Create the chatbot instance
    chatbot = GeminiChatbot(api_key)
    
    print("\nType 'quit' to exit")
    
    # Main chat loop
    while True:
        # Get user input
        user_input = input("\nYou: ").strip()
        
        # Check if user wants to quit
        if user_input.lower() == 'quit':
            print("Goodbye!")
            break
        
        # Get and display the chatbot's response
        response = chatbot.get_response(user_input)
        print(f"\nChatbot: {response}")

if __name__ == "__main__":
    main()

# Test Frontend with Production API Settings
# This test script will temporarily set your React app to use production API settings for local testing.

import os
import requests
import time

# Define the API endpoints to test
render_api_url = "https://todo-web-backend-jqp2.onrender.com/api"

print("Testing connection to Render backend...")
try:
    response = requests.get(f"{render_api_url}", timeout=5)
    print(f"Connection to Render backend: Status {response.status_code}")
    if response.status_code < 400:
        print("✅ Connection successful!")
    else:
        print(f"⚠️ Received error status code: {response.status_code}")
except Exception as e:
    print(f"❌ Failed to connect to Render backend: {str(e)}")

print("\nTo test your React app with production API settings, you can:")
print("1. Set the environment variable REACT_APP_API_BASE_URL to the Render URL")
print("2. Start your React app with the production flag")
print("\nRun the following commands in your terminal:\n")
print('set "REACT_APP_API_BASE_URL=https://todo-web-backend-jqp2.onrender.com"')
print("npm start")