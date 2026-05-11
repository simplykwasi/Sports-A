import os
import requests

API_KEY = os.getenv('VITE_SPORTS_API_KEY')
if not API_KEY:
    print("Error: VITE_SPORTS_API_KEY environment variable not set.")
else:
    url = "https://v3.football.api-sports.io/fixtures?date=2026-05-11&next=5&timezone=Africa/Accra"
    headers = {
        'x-rapidapi-key': API_KEY,
        'x-rapidapi-host': 'v3.football.api-sports.io',
        'Accept': 'application/json',
    }
    print(f"Testing API key with URL: {url}")
    response = requests.get(url, headers=headers, timeout=10)
    print(f"Response Status Code: {response.status_code}")
    if response.status_code == 200:
        data = response.json()
        fixtures = data.get('response', [])
        print(f"Success: Found {len(fixtures)} fixtures.")
        if fixtures:
            first = fixtures[0]
            league = first.get('league', {})
            print(f"Sample League: {league.get('name')} - {league.get('country')}")
    else:
        print(f"Error: {response.text}")
        try:
            error_data = response.json()
            print(f"API Error Message: {error_data.get('message', 'Unknown error')}")
        except:
            print("Could not parse error response.")