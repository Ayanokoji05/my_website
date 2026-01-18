import requests

# This is the admin script to add sample data to the deployed backend without pushing to GitHub

BASE_URL = "https://academic-portfolio-api.onrender.com"

# Add blog post
blog_data = {
    "title": "Checking Deployment from script",
    "content": "This is my third blog post!",
    "excerpt": "Introduction",
    "author": "Your Name",
    "published": True,
    "tags": "testing"
}

response = requests.post(f"{BASE_URL}/api/blogs/", json=blog_data)
print(f"Blog created: {response.json()}")

# Add more data...