import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const HEADERS_WITH_SECRET = {
  headers: {
    "Authorization": `Bearer ${process.env.SECRET}`, 
    "Notion-Version": "2022-06-28",
    "Content-Type": "application/json"
  }
};

const TASK_DATABASE_ID = "067c9bb7f0894b5988f6b6d4a23d2df1";

export { axios, HEADERS_WITH_SECRET, TASK_DATABASE_ID };