const express = require("express")
const usersModel = require("../models/usersModel")
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require("dotenv").config()
const verifyToken = require('../middleware/VerifyToken')



const router = express.Router()

router.get("/verify", verifyToken, (req, res) => {
    res.status(200).json({ message: "Welcome to your profile!", user: req.user });
  });
  


router.post("/create-users", async (req, res) => {
  let message;
  let status;

  try {
    const { name, email, userType, password } = req.body;

    // Check for required fields
    if (!name || !email || !userType || !password) {
      message = "Please fill the required fields";
      status = 400;
      return res.status(status).json({ message });
    }

    const userExist = await usersModel.findOne({ email: req.body.email });
    if(userExist) {
        message = "Email already exists"
        status = 401
        return res.status(status).json({ message });

    }

    // Hash the password
    const hashPassword = async (password) => {
      try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        return hashedPassword;
      } catch (error) {
        throw new Error('Error hashing password');
      }
    };

    // Wait for the hashed password
    const hashedPassword = await hashPassword(password);

    // Create new user
    const newUser = new usersModel({
      name,
      email,
      userType,
      password: hashedPassword,
    });

    // Save to DB
    await newUser.save();
    message = "User created successfully";
    status = 200;

  } catch (e) {
    message = e.message || "Internal Server Error";
    status = 500;
  }

  // Send Response
  res.status(status).json({ message });
});

router.post("/login", async(req, res) => {
    const JWT_SECRET = process.env.JWT_SECRET

    const {email, password} = req.body

    if(!email || !password){
        return res.status(400).json({ message: "Please fill all required fields" });
    }

    try{

  // Check if user exists
        const user = await usersModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Create JWT token
        const token = jwt.sign(
            { id: user._id, name: user.name, email: user.email, userType: user.userType },
            JWT_SECRET,
            { expiresIn: "2h" } // Token valid for 1 hour
        );

        res.status(200).json({
            message: "Login successful",
            token,
            user: { id: user._id, name: user.name, email: user.email, userType: user.userType }
        });

    }catch(e){
        res.status(500).json({ message: error.message });
    }


})




module.exports = router