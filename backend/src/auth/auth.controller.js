import bcrypt from "bcrypt";
import User from "./auth.model.js";
import jwt from "jsonwebtoken";

// create users
const createUser = async (req, res)=>{
    try {
        const { name, email, password } = req.body;

        if(!name || !email || !password){
            return res.status(400).json({ message: 'Required All Fields' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const register = await User.create({
            name,
            email,
            password: hashedPassword
        });

        const user = register.toObject();
        delete user.password;

        // jwt token
        const token = jwt.sign(
            { id: register._id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(201).json({
            message: 'User Register Successfully',
            user,
            token
        });
    } catch (err) {
        console.log(`Something went wrong`, err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// login users
const loginUser = async (req, res)=>{
    try {
        const { email, password } = req.body;

        if(!email || !password){
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // check user exist in DB
        const existingUser = await User.findOne({ email });
        if(!existingUser){
            return res.status(401).json({ message: 'Invalid Email or Password.' });
        }

        const comparePassword = await bcrypt.compare(password, existingUser.password);
        if(!comparePassword){
            return res.status(401).json({ message: 'Invalid Email or Password.' });
        }

        const user = existingUser.toObject();
        delete user.password

        const token = jwt.sign(
            { id: existingUser._id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({
            message: 'User Login Successfully',
            user,
            token
        });
    } catch (err) {
        console.log(`Somthing went wrong`, err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const logoutUser = (req, res) => {
  res.status(200).json({ message: "Logged out successfully" });
};

export { createUser, loginUser, logoutUser };