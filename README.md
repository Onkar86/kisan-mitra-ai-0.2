# Kisan Mitra AI - Smart Farmer Assistant

**Developed by Onkar Mahamuni**

An advanced agricultural advisor providing dual solutions: modern scientific (chemical) and traditional natural (Rajiv Dixit inspired) methods for crop health and pest management.

## Features

- **AI Diagnostic Tool:** Identify crop diseases from photos using Gemini or ChatGPT.
- **Smart Advisor:** Get real-time farming advice with Google Search grounding.
- **Vedic Krishi Wisdom:** Access traditional natural farming formulas (Jeevamrut, Neem-Astra, etc.).
- **Voice Assistant:** Hands-free consultation with Kisan Mitra AI (Powered by Gemini Live).
- **Multi-AI Support:** Choose between Google Gemini and OpenAI ChatGPT.
- **Multi-Language Support:** Available in Hindi, Marathi, Punjabi, Gujarati, Tamil, Telugu, Kannada, Bengali, Malayalam, Odia, and English.

## Deployment Instructions

### 1. GitHub Pages (Automatic)

This repository is configured with GitHub Actions for automatic deployment.

1.  Push this code to your repository: `https://github.com/Onkar86/kisan-mitra-ai.git`
2.  Go to your GitHub Repository **Settings** > **Secrets and variables** > **Actions**.
3.  Add the following **Repository secrets**:
    -   `GEMINI_API_KEY`: Your Google AI Studio API Key.
    -   `OPENAI_API_KEY`: Your OpenAI API Key.
4.  Go to **Settings** > **Pages**.
5.  Under **Build and deployment** > **Source**, select **GitHub Actions**.
6.  The app will be deployed automatically on every push to the `main` branch.

### 2. Manual Local Setup

1.  Clone the repository.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in the root directory:
    ```env
    GEMINI_API_KEY=your_gemini_key
    OPENAI_API_KEY=your_openai_key
    ```
4.  Start the development server:
    ```bash
    npm run dev
    ```

## Credits

- **Developer:** Onkar Mahamuni
- **Inspiration:** Shri Rajiv Dixit (Natural Farming Principles)
- **AI Engines:** Google Gemini & OpenAI GPT-4o

---
© 2025 Onkar Mahamuni. All Rights Reserved.
