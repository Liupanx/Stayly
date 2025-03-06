import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma.js';

export const register = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log(hashedPassword);

        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
            }
        });
        console.log(newUser);
        res.status(201).json({ message: 'User created successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to create user!' });
        console.log(error);
    }
}

export const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await prisma.user.findUnique({
            where: { username }
        })
        if (!user) {
            res.status(401).json({ message: 'Invalid credentials!' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({ message: 'Invalid credentials!' });
        }
        // generate token
        // expires time
        const age = 1000 * 60 * 60 * 24 * 7;
        const token = jwt.sign(
            {
                id: user.id
            },
            process.env.JWT_SECRET_KEY,
            { expiresIn: age }
        );
        res
            .cookie('token', token, {
                httpOnly: true,
                maxAge: age,
                // secure: true
            })
            .status(200)
            .json({ message: 'Logged in successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to login!' });
        console.log(error);
    }
    console.log('login router works!');
}

export const logout = (req, res) => {
    console.log('register router works!');
}
