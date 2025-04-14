//frameworks
import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import route from "./routes/userRoute.js";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import Message from "./models/messages.js"; // <- You need this model for chat storage

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// API routes
app.use("/api", route);

// MongoDB connection
const PORT = process.env.PORT || 8000;
const MONGOURL = process.env.MONGO_URL;

mongoose
  .connect(MONGOURL)
  .then(() => {
    console.log("DB connected!");

    // Instead of app.listen()
    const server = http.createServer(app);
    const io = new Server(server, {
      cors: {
        origin: "http://localhost:3000", // your frontend URL
        methods: ["GET", "POST"],
        credentials: true,
      },
    });

    const users = {}; // 👈 userId => socket.id

    io.on("connection", (socket) => {
      console.log("User connected");

      // Listen for user joining with their ID
      socket.on("join", (userId) => {
        if (!userId) {
          console.log("Invalid userId");
          return;
        }
        users[userId] = socket.id;
        console.log(`User ${userId} connected with socket ${socket.id}`);
      });

      // Handle private messaging
      socket.on("privateMessage", async ({ from, to, message }) => {
        console.log(
          `📤 Server: Message sent from ${from} to ${to}: "${message}"`
        );

        const newMessage = new Message({
          from,
          to,
          message,
          timestamp: new Date(),
        });
        await newMessage.save();

        const recipientSocketId = users[to];
        if (recipientSocketId) {
          io.to(recipientSocketId).emit("privateMessage", newMessage);
          console.log(`📬 Server: Message delivered to ${to}`);
        }

        socket.emit("privateMessage", newMessage);
        console.log(`📨 Server: Message echoed back to ${from}`);
      });

      console.log("Here");

      socket.on("disconnect", () => {
        // Remove the disconnected user
        for (const userId in users) {
          if (users[userId] === socket.id) {
            delete users[userId];
            break;
          }
        }
        console.log("User disconnected");
      });
    });

    server.listen(PORT, () => {
      console.log(`Server running on port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
