# Smart SIAK - Academic Recommendation System

A smart academic system with an AI agent that uses the Perplexity API to recommend personalized study plans based on student motivation.

## Features

- Student motivation assessment
- AI-powered study plan generation
- Personalized learning recommendations
- Motivation-based academic strategies
- Weekly schedule creation

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Perplexity API key

### Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/smart-siak.git
cd smart-siak
```

2. Install dependencies

```bash
npm install
```

3. Set up environment variables

```bash
# Create a .env file in the root directory and add your Perplexity API key
PERPLEXITY_API_KEY=your_perplexity_api_key_here
```

4. Start the development server

```bash
npm run start:dev
```

## API Endpoints

### Generate Study Plan

```
POST /ai-agent/study-plan
```

Request body example:

```json
{
  "studentId": "S12345",
  "name": "John Doe",
  "academicLevel": "Undergraduate",
  "subjects": ["Mathematics", "Computer Science", "Physics"],
  "interests": ["Programming", "Machine Learning", "Game Development"],
  "goals": [
    "Improve GPA",
    "Master programming concepts",
    "Prepare for internship"
  ],
  "motivationLevel": 7,
  "motivationDescription": "I'm generally motivated but sometimes struggle with difficult concepts and lose focus.",
  "learningStyle": "Visual and hands-on",
  "timeAvailability": 20,
  "previousPerformance": [
    {
      "subject": "Mathematics",
      "grade": "B+"
    },
    {
      "subject": "Computer Science",
      "grade": "A-"
    },
    {
      "subject": "Physics",
      "grade": "B"
    }
  ]
}
```

Response: A detailed study plan tailored to the student's motivation and learning style.

## Architecture

The system uses a NestJS backend with the following components:

- **AI Agent Module**: Handles the integration with Perplexity API and generates personalized study plans
- **Perplexity API Service**: Manages communication with the Perplexity AI service
- **DTOs**: Define the data structures for student motivation input and study plan output

## Development

### Running Tests

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

### Building for Production

```bash
npm run build
npm run start:prod
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.
