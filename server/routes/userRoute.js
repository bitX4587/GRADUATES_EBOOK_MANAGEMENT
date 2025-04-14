// frameworks
import express from "express";
import session from "express-session";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { sessionSecret } from "../config/config.js";
import { isLogin, isLogout } from "../middleware/auth.js";

// methods
import {
  create,
  createAdmin,
  deleteUser,
  getAllUsers,
  getUserById,
  getAdminById,
  update,
  updateAdmin,
  verifyLogin,
  verifyAdminLogin,
  loadHome,
  loadHomeAdmin,
  userLogout,
  verifyMail,
  forgetVerify,
  resetPassword,
  downloadUserData,
  storeMessage,
  getMessages,
} from "../controllers/userController.js";

// Initialize router
const route = express.Router();

// for seamless view routing
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Setup session
route.use(
  session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: true,
  })
);

// Serve static files from the 'public/userImages' folder inside the server directory
route.use(
  "/userImages",
  express.static(path.join(__dirname, "../public/userImages"))
);

// Setup multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log(file);
    cb(null, path.join(__dirname, "../public/userImages"));
  },
  filename: function (req, file, cb) {
    const now = new Date();
    const formattedDate =
      String(now.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(now.getDate()).padStart(2, "0") +
      "-" +
      now.getFullYear();
    const name = `${formattedDate}-${file.originalname}`;
    cb(null, name);
  },
});

const upload = multer({ storage });

// ADMIN Routes
route.post("/admin", upload.single("image"), createAdmin); // CREATE ADMIN
route.get("/admin/:id", getAdminById); //READ-UPDATE ADMIN
route.put("/update/admin/:id", upload.single("image"), updateAdmin); //UPDATE ADMIN
route.post("/loginAdmin", verifyAdminLogin); //AUTHENTICATION ADMIN
route.get("/dashboardAdmin", isLogin, loadHomeAdmin); //PROFILE ADMIN

// USER Routes
route.post("/user", upload.single("image"), create); // CREATE USER
route.get("/users", getAllUsers); //READ USER
route.get("/user/:id", getUserById); //READ-UPDATE USER
route.put("/update/user/:id", upload.single("image"), update); //UPDATE USER
route.delete("/delete/user/:id", deleteUser); //DELETE USER

route.get("/verify", verifyMail); //VERIFICATION USER
route.post("/login", verifyLogin); //AUTHENTICATION USER
route.get("/dashboard", isLogin, loadHome); //PROFILE USER
route.get("/logout", isLogout, userLogout); //LOGOUT USER

route.post("/forget", forgetVerify);
route.post("/resetpassword", resetPassword);
route.get("/download-data", downloadUserData);

route.post("/message", storeMessage);
route.get("/messages", getMessages);

export default route; //MOUNT ROUTE TO /API
