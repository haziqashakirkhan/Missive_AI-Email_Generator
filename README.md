# Missive — AI Email Generator

> Generate polished, context-aware emails in seconds with the help of Generative AI.

**Missive** is an AI-powered email generation web application built with **FastAPI** and **Google Gemini**. It helps users create professional emails by providing a purpose, recipient details, context, and preferred tone.

The application is designed to make email writing faster while still allowing users to control the style and intent of the generated message.

---

## Overview

Writing professional emails can be time-consuming, especially when you need to adjust the tone for different situations.

Missive simplifies the process by allowing users to describe what they want to communicate and select a suitable writing tone. The AI then generates a complete email that can be reviewed and edited before use.

### Supported tones

* Warm
* Direct
* Persuasive
* Apologetic
* Confident

---

## Features

* **AI-powered email generation** using Google Gemini
* **Multiple writing tones** for different communication scenarios
* **Context-based generation** for more relevant emails
* **FastAPI backend** for handling requests and AI integration
* **Clean web interface** for entering email requirements
* **Dynamic email generation** without manually writing the complete message
* **Environment-based API configuration** to keep credentials separate from source code
* Responsive and professional interface

---

## How It Works

The application follows a simple workflow:

```text
User Input
    ↓
Email Details + Context + Tone
    ↓
FastAPI Backend
    ↓
Prompt Construction
    ↓
Google Gemini
    ↓
Generated Email
    ↓
User Reviews / Uses the Draft
```

The user provides the information needed for the email, and the backend constructs a structured prompt for Gemini. The generated response is then returned to the frontend.

---

## Tech Stack

| Technology    | Purpose                         |
| ------------- | ------------------------------- |
| Python        | Core programming language       |
| FastAPI       | Backend and API framework       |
| Google Gemini | Generative AI model             |
| HTML          | Frontend structure              |
| CSS           | Styling and UI                  |
| JavaScript    | Frontend interaction            |
| Uvicorn       | ASGI server                     |
| python-dotenv | Environment variable management |

---

## Project Structure

```text
Missive_AI-Email_Generator/
│
├── static/
│   ├── css/
│   └── js/
│
├── templates/
│   └── index.html
│
├── app.py
├── requirements.txt
├── .env
├── .gitignore
└── README.md
```

> The exact structure may vary depending on the current version of the project.

---

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/haziqashakirkhan/M
```
