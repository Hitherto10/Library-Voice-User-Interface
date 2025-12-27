# Library Voice User Interface

This project is a web-based voice user interface for a library system. It allows users to interact with the library's catalog and other services using voice commands. The application uses the Web Speech API for speech recognition and synthesis, and it integrates with external APIs for fetching book information and providing a chatbot functionality.

## Features

- **Voice-based interaction:** Control the application using your voice.
- **Library locations:** View a map of nearby libraries.
- **Book search:** Search for books using Google Books.
- **Course materials:** Fetch course materials for specific courses.
- **Chatbot:** Ask questions to an AI-powered chatbot.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

You will need to have the following software installed on your machine:

- [Node.js and npm](https://nodejs.org/en/download/)

You will also need API keys for the following services:

- **RapidAPI (for the ChatGPT API):** You can get a free API key by signing up on [RapidAPI](https://rapidapi.com/).
- **Google Books API:** You can get a free API key from the [Google Cloud Console](https://console.cloud.google.com/).

### Installation

1.  Clone the repository to your local machine:

    ```bash
    git clone https://github.com/your-username/Library-Voice-User-Interface.git
    ```

2.  Navigate to the project directory:

    ```bash
    cd Library-Voice-User-Interface
    ```

3.  Install the dependencies:

    ```bash
    npm install
    ```

### Configuration

1.  Create a `.env` file in the root of the project by copying the example file:

    ```bash
    cp .env.example .env
    ```

2.  Open the `.env` file and add your API keys:

    ```
    X_RAPIDAPI_KEY="your-rapidapi-key"
    GOOGLE_BOOKS_API_KEY="your-google-books-api-key"
    RAPIDAPI_GPT_URL="https://chatgpt-api8.p.rapidapi.com/"
    RAPIDAPI_GPT_HOST="chatgpt-api8.p.rapidapi.com"
    ```

## Usage

To start the application, run the following command in the root of the project:

```bash
node server.mjs
```

This will start the server on `http://localhost:8080`. You can open this URL in your web browser to use the application.

## Available Voice Commands

- **"hello" / "hi":** Greet the application.
- **"libraries near me":** Show a map with library locations.
- **"close map":** Close the map view.
- **"google books on [topic]":** Search for books on a specific topic.
- **"find books on [topic]":** Find books on a topic in the Middlesex Library.
- **"show me reading sources":** Display a list of recommended reading sources.
- **"course materials for [course code]":** Fetch materials for a specific course.
- **"open link [number]":** Open a specific link from the search results.
- **"ask open ai [question]":** Ask a question to the chatbot.

## Project Structure

```
.
├── .env.example
├── content.jpeg
├── courses.json
├── guidebook.png
├── help-web-button.png
├── index.html
├── index.jpeg
├── mark.png
├── microphone.png
├── microphone2.png
├── novelbook2.jpeg
├── package-lock.json
├── package.json
├── README.md
├── script.js
├── server.mjs
├── styles.css
├── ug1.jpeg
├── ug2.jpeg
└── voice-recorder.png
```
