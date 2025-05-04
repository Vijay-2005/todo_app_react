# test_render_connection.py
import requests

# Define the Render API URL
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

print("\nTo test your React app with production API settings locally, run these commands:")
print('\nFor Windows:')
print('set "REACT_APP_API_BASE_URL=https://todo-web-backend-jqp2.onrender.com"')
print('npm start')
print('\nThis will make your local React app use the production Render backend API.')