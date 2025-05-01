# My Urban Oasis Backend

## Dependencies
npm install

## Start
fastify start -p 8080 app.js

## This is the backend server for the **My Urban Oasis** project, implemented using **Node.js** and **Express**. It serves APIs for green space search, EV charging stations, weather data, user suggestions, and includes integration with LLM (Large Language Models) services.

---

## 📁 Project Structure

```
MY-URBAN-OASIS-BACKEND_S2/
├── .env                 # Environment variables (not committed)
├── .gitignore           # Git ignore rules
├── app.js               # Project entry point
├── package.json         # Project metadata and scripts
├── pnpm-lock.yaml       # Lock file for pnpm
├── README.md            # Project documentation
│
├── plugins/             # Custom plugin modules
│   ├── sensible.js
│   └── support.js
│
├── routes/              # API route handlers
│   ├── ev-charing-station/
│   │   └── index.js
│   ├── greenspace/
│   │   └── index.js
│   ├── place/
│   │   └── index.js
│   ├── suggestion/
│   │   └── index.js
│   ├── weather/
│   │   └── index.js
│   └── root.js
│
├── test/                # Test files
│   └── utils/
│       ├── llm-api.test.js
│       └── helper.js
│
├── utils/               # Utility modules
│   ├── date-utils.js
│   ├── db-utils.js
│   └── llm-api.js       # LLM API integration
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js v16+
- pnpm (preferred over npm for performance)

Install pnpm (if not already):
```bash
npm install -g pnpm
```

### Install Dependencies

```bash
pnpm install
```

### Start Development Server

```bash
node app.js
```

You can also define a `dev` script in `package.json` to simplify this:
```json
"scripts": {
  "dev": "node app.js"
}
```
Then run:
```bash
pnpm dev
```

---

## 🌐 API Modules

Defined under `/routes/`:

- **/ev-charing-station** — EV charging station endpoints
- **/greenspace** — Green space search and information
- **/place** — Point-of-interest APIs
- **/suggestion** — LLM generated suggestions
- **/weather** — Weather-related endpoints
- **/** — Root/health-check route

---

## 🤖 LLM Integration

Located in `utils/llm-api.js`, this module handles requests to external Large Language Models (e.g., OpenAI).

### 🔐 Configure API Key

Use a `.env` file like below:

```env
OPENAI_API_KEY=your-api-key-here
```

This should **not** be committed to Git thanks to `.gitignore`.

---

## 🧪 Testing

Unit tests are located in `/test/utils/`, and currently include:

- `llm-api.test.js`: Test suite for LLM integration
- `helper.js`: Common testing utilities

To run tests (assuming you're using Jest or another framework):

```bash
pnpm test
```

---

## 🛠 Utilities

- `date-utils.js`: Date/time formatting helpers
- `db-utils.js`: Database utility functions
- `llm-api.js`: Integration wrapper for LLM API services

---

## ✅ Notes

- Always use `.env` to store secrets like API keys.
- Ensure `pnpm-lock.yaml` is committed to maintain consistent dependencies.
- Folder `te/` seems unused — consider cleaning it up.
