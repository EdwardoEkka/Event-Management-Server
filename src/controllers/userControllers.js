require("dotenv").config();
const prisma = require("../prismaClient")
const jwt = require("jsonwebtoken");
const argon2 = require('argon2');


const SignUpController = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Email already exists" });
    }

    // Hash password using Argon2
    const hashedPassword = await argon2.hash(password);

    // Create new user with the hashed password
    const newUser = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    res
      .status(201)
      .json({
        success: true,
        message: "User created successfully",
        user: newUser,
      });
  } catch (error) {
    console.error("Error in signup:", error);
    res.status(500).json({ success: false, error });
  }
};

const SignInController = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Email and password are required" });
  }

  try {
    // Find user by email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Compare passwords using Argon2
    const isMatch = await argon2.verify(user.password, password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    // Generate JWT
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res
      .status(200)
      .json({ success: true, token, message: "Sign In Successful" });
  } catch (error) {
    console.error("Error in signing in:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const AuthenticateUser = async (req, res) => {
  const user = req.user;
  const id = user.id;
  const userDetails = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });
  res.json({
    message: "Authentication Successful.",
    user: userDetails,
  });
};

const GetAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json({ users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching users.' });
  }
}


const ApproveUserRole = async (req, res) => {
  const { id, role } = req.body;
  if (!id || !role) {
    return res.status(400).json({ message: "User ID and role are required." });
  }
  try {
    const updatedUser = await prisma.user.update({
      where: { id },
      data: { role },
    });
    return res.status(200).json({ message: "User role updated successfully.", user: updatedUser });
  } catch (error) {
    console.error("Error updating user role:", error);
    return res.status(500).json({ message: "An error occurred while updating the user role." });
  }
};

const GetAllAdmins= async (req, res) =>{
  try {
    const admins= await prisma.user.findMany({
      where: { role:"ADMIN"}
    });
    return res.status(200).json(admins);
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "An error occurred while updating the user role." });
  }
}



module.exports = { SignUpController, SignInController, AuthenticateUser, ApproveUserRole, GetAllUsers, GetAllAdmins}
