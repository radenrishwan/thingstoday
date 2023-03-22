import express from 'express';
import prisma from '../utils/database.js';
import { saltRounds, bcrypt } from '../utils/password.js';
import { generateToken } from '../utils/jwt.js';
import { body, validationResult } from "express-validator";
import { User } from '../model/user.js';
import { v4 as uuidv4 } from 'uuid'

const userRouter = express.Router();

userRouter.post('/api/user/register',
    body('name').notEmpty().withMessage('Name is required'),
    body('email').notEmpty().isEmail().withMessage('Email is required'),
    body('password').notEmpty().isLength({ min: 8 }).withMessage("Password is required or minimum 8 characters"),
    body('role').notEmpty().withMessage('Role is required').custom(value => {
        if (value != "admin" && value != "lecturers" && value != "students") {
            throw new Error('Role must be admin, lecturers or students')
        }

        return true
    }),
    async (req, res) => {
        const err = validationResult(req)
        if (!err.isEmpty()) {
            res.json({
                code: 400,
                message: "Bad request",
                data: err.array().map((e) => {
                    return {
                        field: e.param,
                        message: e.msg
                    }
                })
            })

            return
        }

        const { name, email, password, role } = req.body;

        // check if email or name already exist
        const old = await prisma.user.count({
            where: {
                OR: [
                    { email: email },
                    { name: name }
                ]
            },
        })

        if (old > 0) {
            res.json({
                code: 400,
                message: "Email or name already exist",
                data: null
            })

            return
        }

        // create token
        const token = generateToken({ name, email })

        // create user
        bcrypt.hash(password, saltRounds, async (err, hash) => {
            const data = new User(
                uuidv4(),
                name,
                email,
                hash,
                role,
            )

            const user = await prisma.user.create({
                data: data.forInsertPrisma()
            })

            res.json({
                code: 201,
                message: "User created successfully",
                data: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    token: token
                }
            })
        })
    })

userRouter.post('/api/user/login',
    body('email').notEmpty().isEmail().withMessage('Email is required or invalid'),
    body('password').notEmpty().isLength({ min: 8 }).withMessage("Password is required or minimum 8 characters"),
    async (req, res) => {
        const err = validationResult(req)
        if (!err.isEmpty()) {
            res.json({
                code: 400,
                message: "Bad request",
                data: err.array().map((e) => {
                    return {
                        field: e.param,
                        message: e.msg
                    }
                })
            })

            return
        }

        const { password, email } = req.body;

        // check if email already exist
        const user = await prisma.user.findFirst({
            where: {
                email: email,
            },
        })

        if (user === null) {
            res.json({
                code: 404,
                message: "Email does not exist",
                data: null
            })

            return
        }

        // check if password is correct
        const match = await bcrypt.compare(password, user.password)

        if (!match) {
            res.json({
                code: 400,
                message: "Password is incorrect",
                data: null
            })

            return
        }

        // create token
        const token = generateToken(user)

        res.json({
            code: 200,
            message: "User login successfully",
            data: {
                id: user.id,
                name: user.name,
                email: user.email,
                token: token
            }
        })
    })

export default userRouter