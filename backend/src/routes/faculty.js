import express from 'express';
import prisma from '../utils/database.js';
import authMiddleware from '../middleware/auth.js';
import { body, validationResult } from "express-validator";
import { UserRole } from '@prisma/client';

const facultyRouter = express.Router();

facultyRouter.use(authMiddleware)

facultyRouter.get("/api/faculty", async (req, res) => {
    const faculty = await prisma.faculty.findMany()

    res.json({
        code: 200,
        message: "Success get faculty",
        data: faculty
    })
})

facultyRouter.post("/api/faculty",
    body("id").notEmpty().withMessage("ID is required"),
    body("name").notEmpty().withMessage("Name is required"),
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

        // check if role admins
        const decoded = res.locals.decoded

        const status = await checkRoles(res, decoded.email)
        if (!status) {
            return
        }

        const { id, name } = req.body

        // check if faculty alread exist
        const statusExist = await checkIfFacultyExist(id, name, res)
        console.log(statusExist)
        if (!statusExist) {
            return
        }

        const faculty = await prisma.faculty.create({
            data: {
                id: id,
                name: name
            }
        })

        res.json({
            code: 200,
            message: "Success create faculty",
            data: faculty
        })
    })

facultyRouter.put("/api/faculty",
    body("id").notEmpty().withMessage("ID is required"),
    body("name").notEmpty().withMessage("Name is required"),
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

        // check if role admins
        const decoded = res.locals.decoded

        const status = await checkRoles(res, decoded.email)
        if (!status) {
            return
        }


        const { id, name } = req.body

        const old = await prisma.faculty.findFirst({
            where: {
                id: id,
            }
        })

        if (old === null) {
            res.json({
                code: 404,
                message: "Faculty does not exist",
                data: null
            })

            return
        }

        const faculty = await prisma.faculty.update({
            where: {
                id: id
            },
            data: {
                name: name
            }
        })

        res.json({
            code: 200,
            message: "Success update faculty",
            data: faculty
        })
    })


const checkRoles = async (res, email) => {
    const user = await prisma.user.findFirst({
        where: {
            email: email
        }
    })

    if (user === null) {
        res.json({
            code: 404,
            message: "Email does not exist",
            data: null
        })

        return false
    }

    if (user.role !== UserRole.ADMIN) {
        res.json({
            code: 403,
            message: "You didnt have access to this resource",
            data: null
        })

        return false
    }

    return true
}

const checkIfFacultyExist = async (id, name, res) => {
    const old = await prisma.faculty.count({
        where: {
            OR: [
                { id: id },
                { name: name }
            ]
        },
    })

    if (old > 0) {
        res.json({
            code: 400,
            message: "ID or Name already exist",
            data: null
        })

        return false
    }

    return true
}

export default facultyRouter