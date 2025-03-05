import bcrypt from 'bcrypt';
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

export const login = (req, res) => {
    console.log('login router works!');
}

export const logout = (req, res) => {
    console.log('register router works!');
}
