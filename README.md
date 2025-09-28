# LangChain + Google Gemini AI Chat with MySQL

## Overview

This project demonstrates how to create a chatbot API using **LangChain**, **Google Gemini AI**, and **MySQL**. Users can ask questions in plain English, and the system automatically generates SQL queries, fetches data from MySQL, and returns clean answers.

The backend is built with **Node.js** and **Express**, and uses **TypeORM** to interact with MySQL.

---
## Technologies Used

* Node.js
* Express
* TypeORM
* MySQL
* LangChain
* Google Gemini AI
* dotenv

---

## Prerequisites

* Node.js v20+
* MySQL database
* Google Gemini API key ( https://aistudio.google.com/app/api-keys )
* npm installed

---

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/dranjna/chat_with_database_langchain.git
cd chat_with_database_langchain
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create `.env` file in project root

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=your_database_name
GEMINI_API_KEY=your_google_gemini_api_key
```

### 4. Configure package.json for ES modules

Make sure you have:

```json
{
  "type": "module"
}
```

### 5. Create MySQL database and tables

```sql
CREATE DATABASE your_database_name;
-- Add your tables as required
```

### 6. Start the server

```bash
# Run normally
node server.js

# Or with nodemon for development
npx nodemon server.js
```

### 7. Test the API

Use **Postman** or **curl** to test:

```bash
curl -X POST http://localhost:3000/chat \
  -H "Content-Type: application/json" \
  -d '{"question": "Get all active users with their last login"}'
```

Response:

```json
{
  "question": "Get all active users with their last login",
  "answer": "Alice - 2025-09-28, Charlie - 2025-09-27"
}
```

---

## Code Overview

* `server.js` - Main server file.
* `extractFinalAnswer` - Function to clean AI responses.
* `createSqlQueryChain` - LangChain function that converts natural language to SQL.
* MySQL connection via TypeORM.

---

## Sample queries

* Can you please tell me which products Manveer purchased?
* Could you please provide a list of all users?
* Can you please show me the list of all products?
* Provide a list of users along with the products they purchased?
---

## License

MIT
