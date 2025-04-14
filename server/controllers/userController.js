import User from "../models/userModel.js";
import Admin from "../models/adminModel.js";
import Message from "../models/messages.js";

import mongoose from "mongoose";

import { emailPassword, emailUser } from "../config/config.js";

import bcrypt from "bcrypt"; //password encryption
import randomstring from "randomstring";
import nodemailer from "nodemailer";

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
  console.log("hey im listening");
  try {
    console.log("Received data:", req.body);
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    // Parse the Admin array from the body (it was sent as a string)
    const AdminArray = JSON.parse(req.body.admin); // Now it's an array
    const { name, email, mobile, password } = AdminArray[0]; // if you're expecting an array with one object
    const spassword = await securePassword(password); // Hash the password first

    const image = req.file?.filename; // Optional chaining in case file isn't uploaded
    console.log("Uploaded image filename:", image);
    const AdminExist = await Admin.findOne({ email });
    if (AdminExist) {
      return res.status(400).json({ message: "Email already exists!" });
    }

    const newAdmin = new Admin({
      name,
      email,
      mobile,
      image,
      beta_password: password, // Raw password (shouldn't store this in production)
      password: spassword, // The hashed password
      is_admin: 1,
    });

    const savedData = await newAdmin.save();

    if (savedData) {
      await sendVerifyMail(name, email, savedData._id);
      return res.status(200).json({
        message:
          "Your registration has been successful. Please verify your email.",
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
  console.log("hey im listening");
  try {
    console.log("Received data:", req.body);
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    // Parse the user array from the body (it was sent as a string)
    const userArray = JSON.parse(req.body.user); // Now it's an array
    const { name, email, mobile, password, course } = userArray[0]; // if you're expecting an array with one object
    const spassword = await securePassword(password); // Hash the password first

    const image = req.file?.filename; // Optional chaining in case file isn't uploaded
    console.log("Uploaded image filename:", image);
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({ message: "Email already exists!" });
    }

    const newUser = new User({
      name,
      email,
      mobile,
      image,
      course,
      beta_password: password, // Raw password (shouldn't store this in production)
      password: spassword, // The hashed password
      is_admin: 0,
    });

    const savedData = await newUser.save();

    if (savedData) {
      await sendVerifyMail(name, email, savedData._id);
      return res.status(200).json({
        message:
          "Your registration has been successful. Please verify your email.",
      });
    } else {
      return res.status(500).json({ message: "Your registration has failed." });
    }
  } catch (error) {
    console.log("Error creating user:", error.message);
    return res.status(500).json({ errorMessage: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const userData = await User.find();
    if (!userData || userData.length === 0) {
      console.log("There are no users at the moment"); // ✅ log message
      return res.status(404).json({ message: "User data is not found" });
    }
    res.status(200).json(userData);
  } catch (error) {
    res.status(500).json({ errorMessage: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const id = req.params.id;
    const userExist = await User.findById(id);
    if (!userExist) {
      return res.status(404).json({ message: "User data is not found" });
    }
    res.status(200).json(userExist);
  } catch (error) {
    res.status(500).json({ errorMessage: error.message });
  }
};

export const update = async (req, res) => {
  try {
    const { name, email, mobile, password } = req.body;
    const image = req.file ? req.file.filename : null; // Get image filename if uploaded
    const userId = req.params.id;

    // Update the user in the database
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        name,
        email,
        mobile,
        password, // Remember to hash the password before saving
        image, // If an image is uploaded, store the filename
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the email exists and doesn't belong to the user being updated
    const userEmailExist = await User.findOne({ email });

    if (userEmailExist && userEmailExist._id.toString() !== userId) {
      return res.status(400).json({ message: "Email already exists!" });
    }

    console.log(updatedUser);

    res.status(200).json({ message: "User updated successfully", updatedUser });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error updating user." });
  }
};

export const getAdminById = async (req, res) => {
  try {
    const id = req.params.id;
    const adminExist = await Admin.findById(id);
    if (!adminExist) {
      return res.status(404).json({ message: "Admin data is not found" });
    }
    res.status(200).json(adminExist);
  } catch (error) {
    res.status(500).json({ errorMessage: error.message });
  }
};

export const updateAdmin = async (req, res) => {
  try {
    const { name, email, mobile, password } = req.body;
    const image = req.file ? req.file.filename : null; // Get image filename if uploaded
    const adminId = req.params.id;

    // Update the user in the database
    const updatedAdmin = await Admin.findByIdAndUpdate(
      adminId,
      {
        name,
        email,
        mobile,
        password, // Remember to hash the password before saving
        image, // If an image is uploaded, store the filename
      },
      { new: true }
    );

    if (!updatedAdmin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Check if the email exists and doesn't belong to the user being updated
    const adminEmailExist = await Admin.findOne({ email });

    if (adminEmailExist && adminEmailExist._id.toString() !== adminId) {
      return res.status(400).json({ message: "Email already exists!" });
    }

    console.log(updatedAdmin);

    res
      .status(200)
      .json({ message: "Admin updated successfully", updatedAdmin });
  } catch (error) {
    console.log(error);
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
    await User.findByIdAndDelete(id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ errorMessage: error.message });
  }
};

// SEND MAIL
export const sendVerifyMail = async (name, email, user_id) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: emailUser, // Replace with your email
        pass: emailPassword, //google app password
      },
      tls: {
        rejectUnauthorized: false, // Ignore self-signed certificate error
      },
    });
    const mailOptions = {
      from: emailUser,
      to: email,
      subject: "For Verification",
      text: "Good Morning, Have A Good Day Norwesian",
      html:
        "<h1>Hello! " +
        name +
        ',</h1><p> please click here to <a href="http://localhost:8000/api/verify?id=' +
        user_id +
        '"> Verify </a> your mail.</p>', //change href
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Error:", error);
      } else {
        console.log("Email has been sent:", info.response);
      }
    });
  } catch (error) {
    console.log(error.message);
  }
};

//RESET PASSWORD MAIL
const sendResetPasswordMail = async (name, email, token) => {
  try {
    console.log("Hello wrold");
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: emailUser, // Replace with your email
        pass: emailPassword, //google app password
      },
      tls: {
        rejectUnauthorized: false, // Ignore self-signed certificate error
      },
    });
    console.log("Hello wrold");
    const mailOptions = {
      from: emailUser,
      to: email,
      subject: "For Reset Password",
      text: "Good Morning, Have A Good Day Norwesian",
      html: `<h1>Hello, ${name}</h1>
   <p>Please click here to 
   <a href="http://localhost:3000/resetpassword?token=${token}">Reset</a> 
   your password.</p>`,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Error:", error);
      } else {
        console.log("Email has been sent:", info.response);
      }
    });
  } catch (error) {
    console.log(error.message);
  }
};

export const verifyMail = async (req, res) => {
  try {
    // First, check if the user exists in the User collection
    let updatedUser = await User.updateOne(
      { _id: req.query.id },
      { $set: { is_verified: 1 } }
    );

    // If no user is found, check if the admin exists
    if (updatedUser.modifiedCount === 0) {
      updatedUser = await Admin.updateOne(
        { _id: req.query.id },
        { $set: { is_verified: 1 } }
      );
    }

    // If neither user nor admin was found
    if (updatedUser.modifiedCount === 0) {
      return res.status(404).json({ message: "User or Admin not found" });
    }

    // Successfully updated
    console.log(updatedUser);
    res.status(200).send("✅ Email verified successfully!");
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const verifyLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Im here");

    let userData = await User.findOne({ email });

    if (!userData) {
      return res
        .status(400)
        .json({ message: "Email and Password are incorrect" });
    }

    // Check if email is verified
    if (userData.is_verified === 0) {
      return res.status(401).json({ message: "Please verify your email" });
    }

    // console.log("Verified");

    console.log("Password: ", password);
    console.log("User Password: ", userData.password);

    // Compare hashed password with input password ;problem here also
    const passwordMatch = await bcrypt.compare(password, userData.password);
    if (!passwordMatch) {
      return res
        .status(400)
        .json({ message: "Email and Password are incorrect" });
    }

    console.log(userData);
    // Store the user's _id in session after successful login
    req.session.user_id = userData._id;
    req.session.course = userData.course;

    // If it's a regular user
    res.status(200).json({
      message: "User login successful",
      user: userData,
      userId: userData._id,
      course: userData.course,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const verifyAdminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Im here");

    let userData = await Admin.findOne({ email });

    if (!userData) {
      return res
        .status(400)
        .json({ message: "Email and Password are incorrect" });
    }

    // Check if email is verified
    if (userData.is_verified === 0) {
      return res.status(401).json({ message: "Please verify your email" });
    }

    // console.log("Verified");

    console.log("Password: ", password);
    console.log("User Password: ", userData.password);

    // Compare hashed password with input password ;problem here also
    const passwordMatch = await bcrypt.compare(password, userData.password);
    if (!passwordMatch) {
      return res
        .status(400)
        .json({ message: "Email and Password are incorrect" });
    }

    console.log(userData);
    // Store the user's _id in session after successful login
    req.session.user_id = userData._id;

    // If it's a regular user
    if (userData.is_admin) {
      res.status(200).json({
        message: "User login successful",
        user: userData,
      });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const loadHome = async (req, res) => {
  try {
    if (!req.session.user_id) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    console.log("Im Home");
    console.log("User ID in session:", req.session.user_id);

    const userData = await User.findById(req.session.user_id);

    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }
    console.log("User Found");
    return res.status(200).json({
      user: userData,
      message: "Welcome to the site!",
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "An error occurred" });
  }
};

export const loadHomeAdmin = async (req, res) => {
  try {
    if (!req.session.user_id) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    console.log("Im Home");
    console.log("Admin ID in session:", req.session.user_id);

    const adminData = await Admin.findById(req.session.user_id);

    if (!adminData) {
      return res.status(404).json({ message: "Admin not found" });
    }
    console.log("User Found");
    return res.status(200).json({
      user: adminData,
      message: "Welcome to the site!",
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "An error occurred" });
  }
};

export const userLogout = async (req, res) => {
  try {
    req.session.destroy(); // Destroys the session
    res.status(200).json({ message: "Successfully logged out" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "An error occurred during logout" });
  }
};

export const forgetVerify = async (req, res) => {
  try {
    const { email } = req.body;
    const userData = await User.findOne({ email });

    if (userData) {
      if (userData.is_verified === 0) {
        return res.status(400).json({ message: "Please verify your email." });
      } else {
        const randomString = randomstring.generate();
        await User.updateOne(
          { email: email },
          { $set: { token: randomString } }
        );

        // Send reset password email
        await sendResetPasswordMail(
          userData.name,
          userData.email,
          randomString
        );

        return res.status(200).json({
          message: "Please check your email to reset your password.",
        });
      }
    } else {
      return res.status(404).json({ message: "User email is incorrect." });
    }
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Server error." });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    // Log token for debugging
    console.log("Token from body:", token);

    // Find the user with the token in the database
    const user = await User.findOne({ token });
    console.log("User found:", user);

    if (!user) {
      return res.status(400).json({ message: "Invalid token." });
    }

    console.log("New Password from frontend:", newPassword);

    if (user) {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const updateResult = await User.updateOne(
        { token },
        {
          $set: {
            password: hashedPassword,
            beta_password: newPassword,
            token: "",
          },
        }
      );
      console.log("Hashed Password:", hashedPassword);

      console.log("User found:", user.token);

      console.log("Update result:", updateResult); // Log update result to check if the update was successful

      res.status(200).json({ message: "Password reset successful." });
    } else {
      res.status(400).json({ message: "Invalid token." });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Server error." });
  }
};

export const downloadUserData = async (req, res) => {
  try {
    const userId = req.session.user_id; // <-- Use the session-based ID

    if (!userId) {
      return res.status(401).json({ message: "User not logged in" });
    }

    // Fetch the current user's data from the User collection
    const userData = await User.findById(userId).select(
      "-password -beta_password"
    );
    // ^ Exclude sensitive fields like passwords

    if (!userData) {
      return res.status(404).json({ message: "No data found for this user" });
    }

    res.json(userData); // Send user data as JSON (frontend can handle PDF export)
  } catch (err) {
    console.error("Error downloading user data:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const storeMessage = async (req, res) => {
  const { from, to, message } = req.body;
  const newMessage = new Message({ from, to, message });
  await newMessage.save();
  res.status(201).json(newMessage);
};

export const getMessages = async (req, res) => {
  const { userId, targetId } = req.query;

  try {
    const messages = await Message.find({
      $or: [
        { from: userId, to: targetId },
        { from: targetId, to: userId },
      ],
    }).sort({ timestamp: 1 }); // Sorting by timestamp to show messages in order

    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Error fetching messages" });
  }
};
