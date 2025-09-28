import express from "express";
import dotenv from "dotenv";
import { DataSource } from "typeorm";
import { SqlDatabase } from "langchain/sql_db";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { createSqlQueryChain } from "langchain/chains/sql_db";
import { RunnableLambda } from "@langchain/core/runnables";

dotenv.config();
const app = express();
app.use(express.json());

async function main() {
  // Initialize MySQL DataSource
  const dataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST,
    port: 3306,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: false,
  });

  await dataSource.initialize();
  console.log(" MySQL DataSource initialized");

  const db = await SqlDatabase.fromDataSourceParams({
    appDataSource: dataSource,
  });

  // Initialize ChatGoogleGenerativeAI
  const llm = new ChatGoogleGenerativeAI({
    apiKey: process.env.GEMINI_API_KEY, 
    model: "gemini-2.5-flash", 
  });

  // Create the core SQL query chain (outputs the full verbose string)
  const sqlChain = await createSqlQueryChain({
    llm,
    db,
    dialect: "mysql",
  });

  const finalChain = sqlChain.pipe(
    new RunnableLambda({ func: extractFinalAnswer })
  );

  app.post("/chat", async (req, res) => {
    const { question } = req.body;
    try {
      // ⚡️ Use the composed finalChain, which automatically cleans the output
      const cleanAnswer = await finalChain.invoke({ question }); 
      
      // Send the clean result to the client
      res.json({ question, answer: cleanAnswer });
    } catch (error) {
      console.error("Chat error:", error);
      res.status(500).json({ error: "Something went wrong." });
    }
  });

  app.listen(3000, () =>
    console.log(`server running on http://localhost:3000`)
  );
}

function extractFinalAnswer(rawAnswerString) {
    const delimiter = "Answer:";
    const startIndex = rawAnswerString.indexOf(delimiter);
  
    if (startIndex === -1) {
      return rawAnswerString.trim();
    }
  
    // Extract the substring starting immediately after the delimiter
    const finalAnswer = rawAnswerString.substring(startIndex + delimiter.length);
  
    // Trim whitespace and return
    return finalAnswer.trim();
  }

main().catch((err) => console.error("❌ Failed to start server:", err));
