from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI
import json
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# 🔐 Set your OpenAI API Key
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
if not OPENAI_API_KEY:
    raise ValueError("OPENAI_API_KEY environment variable is required")

# Initialize OpenAI client
client = OpenAI(api_key=OPENAI_API_KEY)


def generate_tour_plan_prompt(city, days, user_id):
    return f"""
    Act like a local tour guide planner AI. Generate a JSON tour plan for {days} days in {city}. Structure the JSON exactly like this:

    {{
      "city": "{city}",
      "days": {days},
      "main_attractions": [
        {{"name": "Attraction 1", "description": "...", "category": "historical", "must_visit": true, "best_time": "morning"}},
        ...
      ],
      "local_foods": [
        {{"name": "local food 1", "description": "...", "restaurant": "Famous food hotel name"}},
        ...
      ],
      "itinerary": [
        {{
          "day": 1,
          "title": "...",
          "main_attraction": "...",
          "activities": [
            {{"time": "09:00", "activity": "...", "description": "...", "type": "sightseeing", "attraction_related": "..."}},
            ...
          ]
        }},
        ...
      ],
      "highlights": ["...", "...", "..."] ,
      "budget": {{
        "accommodation": "$100-200/night",
        "food": "$30-50/day",
        "activities": "$20-40/day",
        "transport": "$10-20/day"
      }}
    }}

    Ensure the JSON is valid, clean, and does not include any Markdown-style code blocks like ```.
    """


def create_fallback_plan(city, days):
    return {
        "city": city,
        "days": days,
        "main_attractions": [],
        "local_foods": [],
        "itinerary": [],
        "highlights": [],
        "budget": {
            "accommodation": "$100-200/night",
            "food": "$30-50/day",
            "activities": "$20-40/day",
            "transport": "$10-20/day"
        }
    }


@app.route("/api/tour-plan", methods=["POST"])
def generate_tour_plan():
    try:
        data = request.get_json()
        city = data.get("city", "").strip()
        days = int(data.get("days", 3))
        user_id = data.get("userId", "")

        if not city:
            return jsonify({"error": "City is required"}), 400

        prompt = generate_tour_plan_prompt(city, days, user_id)
        
        # Call OpenAI API
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are a helpful tour guide planner AI assistant. Always respond with valid JSON only, without any markdown code blocks."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=2000
        )

        raw_text = response.choices[0].message.content.strip() if response.choices else ""

        # Clean raw OpenAI response from ```json or ``` wrappers
        if raw_text.startswith("```json"):
            raw_text = raw_text.removeprefix("```json").strip()
        elif raw_text.startswith("```"):
            raw_text = raw_text.removeprefix("```").strip()
        if raw_text.endswith("```"):
            raw_text = raw_text.removesuffix("```").strip()

        try:
            tour_plan = json.loads(raw_text)
        except json.JSONDecodeError as e:
            print(f"JSON error: {e}")
            tour_plan = create_fallback_plan(city, days)

        return jsonify(tour_plan)

    except Exception as e:
        print(f"Error: {e}")
        fallback = create_fallback_plan("Unknown", 3)
        return jsonify(fallback), 500


if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
