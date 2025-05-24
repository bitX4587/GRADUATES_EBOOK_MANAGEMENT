// frameworks
import express from "express";
import multer from "multer";
// import path from "path";
// import { fileURLToPath } from "url";
// import { dirname } from "path";
import { isLogin, isLogout } from "../middleware/auth.js";

// methods
import {
  create,
  createAdmin,
  deleteUser,
  getAllUsersSchoolID,
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
  resetPassword,
  resetPasswordAdmin,
  downloadUserData,
  getMessages,
  getSingleUser,
  getAllAdmins,
  getAllUsersAdminToken,
  addUserAchievementByAdmin,
  deleteUserAchievementByAdmin,
  checkAuth,
  getPosts,
  createPost,
  editPost,
  deletePost,
} from "../controllers/userController.js";

// Initialize router
const route = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

// ADMIN Routes
route.post("/admin", upload.single("image"), createAdmin); // CREATE ADMIN
route.get("/adminID", isLogin, getAdminById); //READ-UPDATE ADMIN
route.get("/admins", getAllAdmins); //READ ADMINS
route.put("/update/adminID", isLogin, upload.single("image"), updateAdmin); //UPDATE ADMIN
route.post("/loginAdmin", verifyAdminLogin); //AUTHENTICATION ADMIN
route.get("/dashboardAdmin", isLogin, loadHomeAdmin); //PROFILE ADMIN

// USER Routes
route.post("/user", upload.single("image"), create); // CREATE USER
route.get("/users", isLogin, getAllUsersSchoolID); //READ USER SCHOOL ID
route.get("/allusers", isLogin, getAllUsers); //READ USER SCHOOL ID
route.get("/usersAdminToken", isLogin, getAllUsersAdminToken); //READ ADMIN-USERS
route.post("/usersAdminToken/achievement", isLogin, addUserAchievementByAdmin);
route.put(
  "/usersAdminToken/:userId/achievement/delete",
  isLogin,
  deleteUserAchievementByAdmin
);
route.get("/users/:id", isLogin, getSingleUser);
route.get("/userID", isLogin, getUserById); //READ-UPDATE USER
route.put("/update/userID", isLogin, upload.single("image"), update); //UPDATE USER
route.delete("/delete/user/:id", isLogin, deleteUser); //DELETE USER

// route.get("/verify", verifyMail); //VERIFICATION USER
route.get("/check", isLogin, checkAuth);
route.post("/login", verifyLogin); //AUTHENTICATION USER
route.get("/dashboard", isLogin, loadHome); //PROFILE USER
route.get("/logout", isLogout, userLogout); //LOGOUT USER

// route.post("/forget", forgetVerify);
route.post("/resetpassword", resetPassword);
route.post("/resetpasswordAdmin", resetPasswordAdmin);
route.get("/download-data", isLogin, downloadUserData);

// route.post("/message/admin", isLogin, storeMessage); // Secure message sending
route.get("/messages", isLogin, getMessages); // Secure message fetching
route.get("/getnewsfeed", isLogin, getPosts);
route.post("/postnewsfeed", upload.single("image"), isLogin, createPost);
route.put("/editpost/:postId", upload.single("image"), isLogin, editPost);
route.delete("/deletepost/:postId", isLogin, deletePost);

export default route; //MOUNT ROUTE TO /API
