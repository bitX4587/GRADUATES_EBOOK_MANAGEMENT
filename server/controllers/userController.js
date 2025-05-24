import User from "../models/userModel.js";
import Admin from "../models/adminModel.js";
import Message from "../models/messages.js";
import Post from "../models/newsfeed.js";
import bcrypt from "bcrypt"; //password encryption
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream"; // add this at the top if not already

dotenv.config();

const securePassword = async (password) => {
  console.log("Received password:", password);
  try {
    const passwordHash = await bcrypt.hash(password, 10); // 10 is the salt rounds
    return passwordHash;
  } catch (error) {
    console.log("Error hashing password:", error.message);
    throw error; // Ensure errors are thrown properly
  }
};

export const createAdmin = async (req, res) => {
  try {
    const AdminArray = JSON.parse(req.body.admin);
    const {
      name,
      email,
      mobile,
      password,
      SchoolID,
      is_admin,
      is_admin_token,
    } = AdminArray[0];

    let imageData = { url: "", public_id: "" };
    if (req.file) {
      const streamUpload = () =>
        new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "admins" },
            (error, result) => {
              if (result) {
                resolve(result);
              } else {
                reject(error);
              }
            }
          );
          Readable.from(req.file.buffer).pipe(stream);
        });

      const result = await streamUpload();
      imageData.url = result.secure_url;
      imageData.public_id = result.public_id;
    }

    const spassword = await securePassword(password);

    const AdminExist = await Admin.findOne({ email });
    if (AdminExist) {
      return res.status(400).json({ message: "Email already exists!" });
    }

    if (is_admin_token !== "0123") {
      return res.status(403).json({ message: "Invalid admin token!" });
    }

    const newAdmin = new Admin({
      name,
      email,
      mobile,
      SchoolID,
      image: imageData,
      beta_password: password,
      password: spassword,
      is_admin,
      is_admin_token,
      is_verified: 1,
    });

    const savedData = await newAdmin.save();

    if (savedData) {
      return res.status(200).json({
        message: "Admin registration has been successful.",
      });
    } else {
      return res.status(500).json({ message: "Your registration has failed." });
    }
  } catch (error) {
    console.log("Error creating Admin:", error.message);
    return res.status(500).json({ errorMessage: error.message });
  }
};

export const create = async (req, res) => {
  try {
    const userArray = JSON.parse(req.body.user);
    const {
      name,
      email,
      mobile,
      password,
      course,
      graduationYear,
      SchoolID,
      is_admin,
      address,
      birthday,
      civil_status,
      birthplace,
      nationality,
      religion,
    } = userArray[0];

    let imageData = { url: "", public_id: "" };
    if (req.file) {
      const streamUpload = () =>
        new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "users" },
            (error, result) => {
              if (result) {
                resolve(result);
              } else {
                reject(error);
              }
            }
          );
          Readable.from(req.file.buffer).pipe(stream);
        });

      const result = await streamUpload();
      imageData.url = result.secure_url;
      imageData.public_id = result.public_id;
    }

    const spassword = await securePassword(password); // Hash the password first

    // const image = req.file?.filename;
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({ message: "Email already exists!" });
    }

    const newUser = new User({
      name,
      email,
      mobile,
      image: imageData,
      course,
      graduationYear,
      SchoolID,
      beta_password: password,
      password: spassword,
      is_admin,
      is_verified: 1,
      achievements: [], // Start with no achievements

      // Optional PDS fields
      address: address || "",
      birthday: birthday || null,
      civil_status: civil_status || "Single",
      birthplace: birthplace || "",
      nationality: nationality || "",
      religion: religion || "",
    });

    const savedData = await newUser.save();

    if (savedData) {
      return res.status(200).json({
        message: "User registration has been successful.",
      });
    } else {
      return res.status(500).json({ message: "Your registration has failed." });
    }
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({ errorMessage: error.message });
  }
};

export const getSingleUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("id name image");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllUsersSchoolID = async (req, res) => {
  try {
    const currentSchoolID = req.user.SchoolID;

    const users = await User.find({ SchoolID: currentSchoolID }, "-password");

    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();

    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getAllUsersAdminToken = async (req, res) => {
  try {
    // req.user was set in the auth middleware
    const admin = await Admin.findById(req.admin.id); // or req.user._id if your payload uses that

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const users = await User.find({ is_admin: admin.is_admin }, "-password");

    if (!users.length) {
      return res.status(404).json({ message: "No users found for this admin" });
    }

    return res.status(200).json(users);
  } catch (error) {
    console.error("JWT user fetch error:", error);
    return res.status(500).json({ message: error.message });
  }
};

export const addUserAchievementByAdmin = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id);
    if (!admin) {
      return res
        .status(403)
        .json({ message: "Admin not found or unauthorized" });
    }

    const { userId, achievement } = req.body;
    if (!userId || !achievement) {
      return res.status(400).json({ message: "Missing userId or achievement" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Confirm that the user belongs to this admin
    if (user.is_admin.toString() !== admin.is_admin.toString()) {
      return res
        .status(403)
        .json({ message: "User does not belong to this admin" });
    }

    user.achievements = [...(user.achievements || []), achievement];
    await user.save();

    return res.status(200).json({ message: "Achievement added", user });
  } catch (error) {
    console.error("Error adding achievement:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const deleteUserAchievementByAdmin = async (req, res) => {
  const { userId } = req.params;
  const { achievements } = req.body; // This should be the updated list of achievements

  try {
    // Find the user by userId and update the achievements
    const user = await User.findByIdAndUpdate(
      userId,
      { achievements }, // Updating achievements field with the new array
      { new: true } // This returns the updated user document
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Send the updated user object back
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating achievements" });
  }
};

export const getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find({}, "name is_admin SchoolID");
    res.status(200).json(admins);
  } catch (error) {
    console.log("Hu");
    console.error("Error fetching admins:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getUserById = async (req, res) => {
  try {
    const userId = req.user.id; // get from decoded token
    const userExist = await User.findById(userId);

    if (!userExist) {
      return res.status(404).json({ message: "User data is not found" });
    }

    res.status(200).json({ user: userExist });
  } catch (error) {
    res.status(500).json({ errorMessage: error.message });
  }
};

export const update = async (req, res) => {
  try {
    const {
      name,
      email,
      mobile,
      address,
      birthday,
      civil_status,
      birthplace,
      nationality,
      religion,
    } = req.body;

    const userId = req.user.id;

    // Check for email conflict
    const userEmailExist = await User.findOne({ email });
    if (userEmailExist && userEmailExist._id.toString() !== userId) {
      return res.status(400).json({ message: "Email already exists!" });
    }

    // Fetch the current user to get their existing image
    const currentUser = await User.findById(userId);
    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    let imageData = currentUser.image;

    if (req.file) {
      // Delete old image from Cloudinary if it exists
      if (currentUser.image?.public_id) {
        await cloudinary.uploader.destroy(currentUser.image.public_id);
      }

      const streamUpload = () =>
        new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "users" },
            (error, result) => {
              if (result) {
                resolve(result);
              } else {
                reject(error);
              }
            }
          );
          Readable.from(req.file.buffer).pipe(stream);
        });

      const result = await streamUpload();
      imageData = {
        url: result.secure_url,
        public_id: result.public_id,
      };
    }

    const updateData = {
      name,
      email,
      mobile,
      address,
      birthday,
      civil_status,
      birthplace,
      nationality,
      religion,
      image: imageData,
    };

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    });

    res.status(200).json({ message: "User updated successfully", updatedUser });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error updating user." });
  }
};

export const getAdminById = async (req, res) => {
  try {
    const id = req.admin.id;
    const adminExist = await Admin.findById(id);

    if (!adminExist) {
      return res.status(404).json({ message: "Admin data is not found" });
    }

    res.status(200).json({ admin: adminExist });
  } catch (error) {
    res.status(500).json({ errorMessage: error.message });
  }
};

export const updateAdmin = async (req, res) => {
  try {
    const { name, email, mobile } = req.body;
    const adminId = req.admin.id;

    const currentAdmin = await Admin.findById(adminId);
    if (!currentAdmin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Check if email already exists in another admin
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin && existingAdmin._id.toString() !== adminId) {
      return res.status(400).json({ message: "Email already exists!" });
    }

    let imageData = currentAdmin.image;

    if (req.file) {
      // Delete old image from Cloudinary if it exists
      if (currentAdmin.image?.public_id) {
        await cloudinary.uploader.destroy(currentAdmin.image.public_id);
      }

      const streamUpload = () =>
        new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "admins" },
            (error, result) => {
              if (result) {
                resolve(result);
              } else {
                reject(error);
              }
            }
          );
          Readable.from(req.file.buffer).pipe(stream);
        });

      const result = await streamUpload();
      imageData = {
        url: result.secure_url,
        public_id: result.public_id,
      };
    }

    // Build update data dynamically
    const updateData = {
      name,
      email,
      mobile,
      image: imageData,
    };

    const updatedAdmin = await Admin.findByIdAndUpdate(adminId, updateData, {
      new: true,
    });

    res
      .status(200)
      .json({ message: "Admin updated successfully", updatedAdmin });
  } catch (error) {
    console.log("Error updating admin:", error);
    res.status(500).json({ message: "Error updating admin." });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const id = req.params.id;

    const userExist = await User.findById(id);
    if (!userExist) {
      return res.status(404).json({ message: "User data is not found" });
    }

    console.log("Public ID to delete:", userExist.image?.public_id);

    // Delete profile image from Cloudinary with fallback
    if (userExist.image?.public_id) {
      try {
        const result = await cloudinary.uploader.destroy(
          userExist.image.public_id
        );
        console.log("Cloudinary deletion result:", result); // Should say: { result: 'ok' }
      } catch (cloudErr) {
        console.error("Cloudinary deletion failed:", cloudErr); // Show full error
      }
    }
    // Delete all messages where the user is the sender or receiver
    await Message.deleteMany({
      $or: [{ from: id }, { to: id }],
    });

    // Delete the user
    await User.findByIdAndDelete(id);

    res
      .status(200)
      .json({ message: "User and related messages deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ errorMessage: error.message });
  }
};

// Auth check controller
export const checkAuth = (req, res) => {
  // req.user or req.admin is already set by isLogin middleware
  const user = req.user || req.admin;
  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  res.status(200).json({
    message: "Authenticated",
    user,
  });
};

export const verifyLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userData = await User.findOne({ email });

    if (!userData) {
      return res
        .status(400)
        .json({ message: "Email and Password are incorrect" });
    }

    if (userData.is_verified === 0) {
      return res.status(401).json({ message: "Please verify your email" });
    }

    const passwordMatch = await bcrypt.compare(password, userData.password);
    if (!passwordMatch) {
      return res
        .status(400)
        .json({ message: "Email and Password are incorrect" });
    }

    // 🔐 JWT payload
    const payload = {
      id: userData._id,
      course: userData.course,
      SchoolID: userData.SchoolID,
      role: "user",
    };

    // 🔐 Sign token
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // 🍪 Set JWT cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // set to true in production with HTTPS
      sameSite: "Lax",
      maxAge: 3600000, // 1 hour
    });

    res.status(200).json({
      message: "User login successful",
      user: {
        id: userData._id,
        name: userData.name,
        email: userData.email,
        course: userData.course,
        SchoolID: userData.SchoolID,
      },
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const verifyAdminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const adminData = await Admin.findOne({ email });

    if (!adminData) {
      return res
        .status(400)
        .json({ message: "Email and Password are incorrect" });
    }

    if (adminData.is_verified === 0) {
      return res.status(401).json({ message: "Please verify your email" });
    }

    const passwordMatch = await bcrypt.compare(password, adminData.password);
    if (!passwordMatch) {
      return res
        .status(400)
        .json({ message: "Email and Password are incorrect" });
    }

    // 🔐 JWT payload
    const payload = {
      id: adminData._id,
      role: "admin",
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
      maxAge: 3600000,
    });

    res.status(200).json({
      message: "Admin login successful",
      user: {
        id: adminData._id,
        name: adminData.name,
        email: adminData.email,
      },
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const loadHome = async (req, res) => {
  try {
    // Get user ID from token (decoded in middleware)
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const userData = await User.findById(userId);

    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      user: {
        id: userData._id,
        name: userData.name,
        email: userData.email,
        mobile: userData.mobile,
        image: userData.image,
        course: userData.course,
        graduationYear: userData.graduationYear,
        SchoolID: userData.SchoolID,
        address: userData.address,
        birthday: userData.birthday,
        civil_status: userData.civil_status,
        birthplace: userData.birthplace,
        nationality: userData.nationality,
        religion: userData.religion,
        achievements: userData.achievements,
        is_admin: userData.is_admin,
        is_verified: userData.is_verified,
      },
      message: "Welcome to the site!",
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "An error occurred" });
  }
};

export const loadHomeAdmin = async (req, res) => {
  try {
    // Get admin ID from JWT payload
    const adminId = req.admin?.id;

    if (!adminId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const adminData = await Admin.findById(adminId);

    if (!adminData) {
      return res.status(404).json({ message: "Admin not found" });
    }

    return res.status(200).json({
      admin: {
        id: adminData._id,
        name: adminData.name,
        mobile: adminData.mobile,
        email: adminData.email,
        image: adminData.image, // ✅ this must be present
        is_admin: adminData.is_admin,
      },
      message: "Welcome to the Admin dashboard!",
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "An error occurred" });
  }
};

export const userLogout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
    }); // Clear JWT cookie
    res.status(200).json({ message: "Successfully logged out" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "An error occurred during logout" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const updateResult = await User.updateOne(
      { email },
      {
        $set: {
          password: hashedPassword,
          beta_password: newPassword, // REMOVE THIS IN PRODUCTION
        },
      }
    );

    console.log(updateResult);
    res.status(200).json({ message: "Password reset successful." });
  } catch (error) {
    console.error("Password reset error:", error.message);
    res.status(500).json({ message: "Server error." });
  }
};

export const resetPasswordAdmin = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(404).json({ message: "Admin not found." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const updateResult = await Admin.updateOne(
      { email },
      {
        $set: {
          password: hashedPassword,
          beta_password: newPassword, // REMOVE THIS IN PRODUCTION
        },
      }
    );

    console.log(updateResult);
    res.status(200).json({ message: "Password reset successful." });
  } catch (error) {
    console.error("Password reset error:", error.message);
    res.status(500).json({ message: "Server error." });
  }
};

export const downloadUserData = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "User not logged in" });
    }

    const userData = await User.findById(userId).select(
      "-image -password -beta_password -_id -is_admin -is_verified -token -__v"
    );

    if (!userData) {
      return res.status(404).json({ message: "No data found for this user" });
    }

    res.json(userData);
  } catch (err) {
    console.error("Error downloading user data:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  const userId = req.user.id;
  const { targetId } = req.query;

  console.log("message get");

  try {
    const messages = await Message.find({
      $or: [
        { from: userId, to: targetId },
        { from: targetId, to: userId },
      ],
    }).sort({ timestamp: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Error fetching messages" });
  }
};

export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate("user", "name image"); // populate name and image fields
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: "Error fetching posts" });
  }
};

export const createPost = async (req, res) => {
  try {
    const { content } = req.body;

    if ((!content || !content.trim()) && !req.file) {
      return res.status(400).json({ error: "Post must have content or image" });
    }

    console.log("req.body:", req.body);

    let imageData = null;

    if (req.file) {
      const streamUpload = () =>
        new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "posts" },
            (error, result) => {
              if (result) {
                resolve(result);
              } else {
                reject(error);
              }
            }
          );
          Readable.from(req.file.buffer).pipe(stream);
        });

      const result = await streamUpload();
      imageData = {
        url: result.secure_url,
        public_id: result.public_id,
      };
    }
    console.log(imageData);

    const newPost = new Post({
      content: content?.trim() || "",
      user: req.user.id,
      image: imageData || { url: "", public_id: "" },
    });

    const savedPost = await newPost.save();
    await savedPost.populate("user", "name image");

    res.status(201).json(savedPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creating post" });
  }
};

export const editPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });
    if (post.user.toString() !== userId.toString())
      return res.status(403).json({ message: "Unauthorized" });

    // Allow content to be empty string if user wants
    post.content = content !== undefined ? content.trim() : post.content;

    if (req.file) {
      if (post.image && post.image.public_id) {
        await cloudinary.uploader.destroy(post.image.public_id);
      }

      const streamUpload = () =>
        new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "posts" },
            (error, result) => {
              if (result) {
                resolve(result);
              } else {
                reject(error);
              }
            }
          );
          Readable.from(req.file.buffer).pipe(stream);
        });

      const result = await streamUpload();
      post.image = {
        url: result.secure_url,
        public_id: result.public_id,
      };
    }

    await post.save();
    res.json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error editing post" });
  }
};

export const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id;

    const post = await Post.findById(postId);
    console.log("Image info:", post.image);
    console.log("Deleting post:", post);

    if (!post) return res.status(404).json({ message: "Post not found" });
    if (post.user.toString() !== userId.toString())
      return res.status(403).json({ message: "Unauthorized" });

    // Delete Cloudinary image
    if (post.image && post.image.public_id) {
      await cloudinary.uploader.destroy(post.image.public_id);
    }

    await post.deleteOne();
    res.status(200).json({ message: "Post deleted successfully", postId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error deleting post" });
  }
};
