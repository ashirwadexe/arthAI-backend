import User from "../models/user.model.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


// FUNCTION TO GENERATE TOKEN USING JWT
const generateToken = (userId) => {
    const token = jwt.sign({userId}, process.env.JWT_SECRET_KEY, {expiresIn: '2d'});
    return token;
};

// REGISTRATION LOGIC
// /api/user/register
export const register = async (req, res) => {
    try {
        const { name, email, password, phone, address } = req.body;

        // CHECK IF REQUIRED FEILDS ARE PRESENT
        if( !name || !email || !password || !phone || !address ) {
            return res.status(400).json({
                message: "Somedata is missing!",
                success: false
            });
        }

        //  CHECK IF USER ALREADY EXISTS
        const user = await User.findOne({email});
        if(user) {
            return res.status(400).json({
                message: "Email already exist, try another!",
                success: false
            });
        }

        // HASH PASSWORD TO STORE
        const hashedPassword = await bcrypt.hash(password, 10);

        // CREATE NEW USER ACCOUNT
        const newUser = await User.create({
            name,
            email,
            phone,
            address,
            password: hashedPassword
        });

        // GENERATE TOKEN
        const token = generateToken(newUser._id);

        newUser.password = undefined;

        // RETURN SUCCESS MESSAGE
        return res.status(201).json({
            message: "Acount Created!",
            token,
            user: newUser,
            success: true
        });
        
    } catch (error) {
        console.log("Registration Error: ",error)
        return res.status(400).json({
            message: error.message,
            success: false
        });
    }
};

// LOGIN LOGIC
// /api/user/login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if(!email || !password) {
            return res.status(400).json({
                message: "Email or Password is missing!",
                succes: false
            });
        }

        const user = await User.findOne({email});
        if(!user) {
            return res.status(400).json({
                message: "User not exists!",
                success: false
            });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if(!isPasswordCorrect) {
            return res.status(400).json({
                message: "Incorrect Password!",
                success: false
            });
        }

        const token = generateToken(user._id);
        user.password = undefined;

        return res.status(200).json({
            message: "Logged In!",
            token,
            user,
            success: true
        });

    } catch (error) {
        console.log("Login Error: ",error)
        return res.status(400).json({
            message: error.message,
            success: false
        });
    }
};

// LOGIC TO GET USER BY ID
// GET: /api/user/data
export const getUserById = async (req, res) => {
    try {
        // THIS userId IS ADDED BY ISAUTHENTICATED MIDDLEWARE
        const userId = req.userId;

        // CHECK IF USER EXISTS
        const user = await User.findById(userId);
        if(!user) {
            return res.status(400).json({
                message: "User not exists!",
                success: false
            });
        }

        // RETURN USER
        user.password = undefined;
        return res.status(200).json({
            user
        });
        
    } catch (error) {
        console.log("Get User by Id error: ", error);
        return res.status(400).json({
            message: error.message,
            succes:false
        });
    }
};