# AI Tour Guide Backend

A Flask-based backend service that uses OpenAI's GPT-4 to generate personalized tour plans.

## Features

- 🤖 **AI-Powered**: Uses OpenAI GPT-4 for intelligent tour planning
- 🌍 **Global Coverage**: Generate plans for any city worldwide
- 📅 **Flexible Duration**: Support for 1-30 day itineraries
- 💰 **Budget Estimates**: Realistic cost breakdowns
- 🛡️ **Error Handling**: Robust fallback mechanisms
- 🔄 **CORS Enabled**: Ready for frontend integration

## Quick Start

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Set Up Environment

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env and add your OpenAI API key
# Get your API key from: https://platform.openai.com/api-keys
```

### 3. Run the Server

```bash
python app.py
```

The server will start on `http://localhost:5000`

## API Endpoints

### POST /api/tour-plan

Generate a personalized tour plan.

**Request Body:**
```json
{
  "city": "Paris",
  "days": 3,
  "userId": "user@example.com"
}
```

**Response:**
```json
{
  "city": "Paris",
  "days": 3,
  "itinerary": [
    {
      "day": 1,
      "title": "Welcome to Paris",
      "activities": [
        {
          "time": "09:00",
          "activity": "Eiffel Tower Visit",
          "description": "Start your Paris adventure at the iconic Eiffel Tower",
          "type": "sightseeing"
        }
      ]
    }
  ],
  "highlights": ["Eiffel Tower", "Louvre Museum", "Seine River Cruise"],
  "budget": {
    "accommodation": "$80-150/night",
    "food": "$30-50/day",
    "activities": "$25-45/day",
    "transport": "$15-25/day"
  }
}
```

### GET /api/health

Health check endpoint.

### GET /

API information and available endpoints.

## Configuration

### Environment Variables

- `OPENAI_API_KEY`: Your OpenAI API key (required)
- `FLASK_ENV`: Flask environment (development/production)
- `FLASK_DEBUG`: Enable debug mode (True/False)

### Getting an OpenAI API Key

1. Visit [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign in with your OpenAI account
3. Create a new API key
4. Copy the key to your `.env` file

## Error Handling

The API includes comprehensive error handling:

- **Invalid Input**: Returns 400 with error message
- **AI Generation Failure**: Falls back to template-based plans
- **JSON Parsing Errors**: Uses structured fallback data
- **Network Issues**: Graceful degradation with mock data

## Development

### Project Structure

```
backend/
├── app.py              # Main Flask application
├── requirements.txt    # Python dependencies
├── .env.example       # Environment template
└── README.md          # This file
```

### Adding Features

1. **Custom Prompts**: Modify `generate_tour_plan_prompt()` function
2. **New Endpoints**: Add routes in `app.py`
3. **Enhanced Validation**: Update `validate_and_clean_tour_plan()`
4. **Better Fallbacks**: Improve `create_fallback_plan()`

## Deployment

### Local Development
```bash
python app.py
```

### Production (using Gunicorn)
```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

### Docker (Optional)
```dockerfile
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 5000
CMD ["python", "app.py"]
```

## Troubleshooting

### Common Issues

1. **API Key Error**: Ensure your OpenAI API key is valid and has quota
2. **CORS Issues**: The backend includes CORS headers for frontend integration
3. **JSON Parsing**: The system falls back to structured data if AI response isn't valid JSON
4. **Rate Limits**: OpenAI API has rate limits; implement caching if needed

### Logs

The application logs important events:
- Tour plan generation requests
- AI response parsing
- Error conditions
- Fallback activations

## Security Notes

- Never commit API keys to version control
- Use environment variables for sensitive data
- Consider implementing rate limiting for production
- Add authentication for user-specific features

## License

This project is for educational and development purposes.