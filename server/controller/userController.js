import bcrypt from "bcrypt";
import { initialDB } from "../config/db.js";
import jwt from "jsonwebtoken"

// Signup user  --->  /api/signup
export const signup =  async (req, res) => {
    const {username, email, password, role} = req.body;
    const db = await initialDB()

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.run(
            'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
            [username, email, hashedPassword, role]
        );
        res.json({success: true, message: 'User registered successfully'});
    } catch (error) {
        console.error(error)
        res.json({success: false, message: 'User already registered'});
    }
};


// Login user ---> /api/login
export const login =  async (req, res) => {
    const {email, password} = req.body;
    const db = await initialDB();

    try {
        const user = await db.get('SELECT * FROM users WHERE email = ? ', [email]);
        if (!user) return res.json({success: false, message: 'User not found'});

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.json({success: false, message: 'Invalid credentials'});

        const token = jwt.sign(
            {userId: user.id, username: user.username},
            process.env.JWT_SECRET,
            {expiresIn: '1d'}
        )

        res.json({success: true, message: "User login successfull", token, user: {id: user.id, username: user.username, role: user.role}});
    } catch (error) {
        console.error(error)
        res.json({success: false, message: 'Server error'});
    }
}


export const logout = async (req, res) => {
    try {
        res.clearCookie('jwtToken', {
            httpOnly: true,
            secure: process.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        })

        return res.json({success: true, message: 'Logged out successfully'})
    } catch (error) {
        console.error(error.message)
        return res.json({success: false, message: 'Failed to log out'})
    }
}