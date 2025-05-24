//frameworks
import express from "express";
import mongoose from "mongoose";
import cloudinary from "./cloudinaryConfig.js";
import dotenv from "dotenv";
import route from "./routes/userRoute.js";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import Message from "./models/messages.js"; // <- You need this model for chat storage
import cookieParser from "cookie-parser";
import { createClient } from "redis";
import { createAdapter } from "@socket.io/redis-adapter";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://graduates-ebook-management.vercel.app",
    ],
    credentials: true,
  })
);

// API routes
app.use("/api", route);

import https from "https";

https
  .get("https://api.ipify.org?format=json", (res) => {
    let data = "";
    res.on("data", (chunk) => (data += chunk));
    res.on("end", () => {
      console.log("Current public IP:", JSON.parse(data).ip);
    });
  })
  .on("error", (err) => {
    console.error("Error fetching IP:", err);
  });

// MongoDB connection
const PORT = process.env.PORT || 8000;
const MONGOURL = process.env.MONGO_URL;

mongoose
  .connect(MONGOURL)
  .then(async () => {
    console.log("DB connected!");

    // Create HTTP server
    const server = http.createServer(app);

    // Create Socket.IO server
    const io = new Server(server, {
      cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true,
      },
    });

    // ✅ Redis Pub/Sub Setup (Async Required)
    const pubClient = createClient({
      url: process.env.REDIS_URL,
    });
    const subClient = pubClient.duplicate();

    await pubClient.connect();
    await subClient.connect();

    pubClient.on("error", (err) =>
      console.error("Redis Client Error (pubClient):", err)
    );
    subClient.on("error", (err) =>
      console.error("Redis Client Error (subClient):", err)
    );

    console.log("Redis clients connected");

    // ✅ Use Redis adapter
    io.adapter(createAdapter(pubClient, subClient));

    io.on("connection", (socket) => {
      console.log("User connected");

      socket.on("join", async (userId) => {
        if (!userId) return;

        // Save userId on socket for disconnect cleanup
        socket.data.userId = userId;

        // Join a room with the userId
        socket.join(userId);

        // Add userId to Redis online set
        await pubClient.sAdd("online-users", userId);

        // Get updated list of online users
        const onlineUsers = await pubClient.sMembers("online-users");

        // Broadcast updated online users list
        io.emit("updateUserStatus", onlineUsers);

        console.log(`User ${userId} joined`);
      });

      socket.on("privateMessage", async ({ from, to, message }) => {
        const newMessage = new Message({
          from,
          to,
          message,
          timestamp: new Date(),
        });
        await newMessage.save();

        // Emit to both sender and recipient rooms
        io.to(to).emit("privateMessage", newMessage);
        io.to(from).emit("privateMessage", newMessage);
      });

      socket.on("disconnect", async () => {
        const userId = socket.data.userId;
        if (!userId) return;

        // Remove this socket from the room by default done by Socket.IO,
        // but check if user still has other sockets connected

        // Check if any sockets still in user's room
        const socketsInRoom = await io.in(userId).allSockets();

        // If no more sockets for this user, remove from online set
        if (socketsInRoom.size === 0) {
          await pubClient.sRem("online-users", userId);
          const onlineUsers = await pubClient.sMembers("online-users");
          io.emit("updateUserStatus", onlineUsers);
          console.log(
            `User ${userId} disconnected and removed from online users`
          );
        } else {
          console.log(
            `User ${userId} disconnected one socket but still online`
          );
        }
      });
    });

    server.listen(PORT, () => {
      console.log(`Server running on port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect Redis:", error);
    console.error("DB connection failed:", error);
  });
