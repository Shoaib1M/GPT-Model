import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./configs/db.js";
import userRouter from "./routes/userRoutes.js";
import chatRouter from "./routes/chatRoutes.js";
import messageRouter from "./routes/messagesRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.send("server is Live!"));
app.use("/api/user", userRouter);
app.use("/api/chat", chatRouter);
app.use("/api/message", messageRouter);

// Only connect DB and listen when running locally
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 3000;

  const startServer = async () => {
    try {
      await connectDB();
      app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
      });
    } catch (error) {
      console.error("Failed to start server:", error);
    }
  };

  startServer();
} else {
  // On Vercel, just connect DB once and export the app
  connectDB().catch((err) => console.error("DB connection failed:", err));
}

// Export app for Vercel serverless functions
export default app;
