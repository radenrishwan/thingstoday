import express from 'express';
import prisma from '../utils/database.js';
import authMiddleware from '../middleware/auth.js';
import { body } from "express-validator";
import { Faculty } from '../model/faculty.js';
import { checkRoles, checkValidationRequest } from "../utils/auth.js";

const facultyRouter = express.Router();

facultyRouter.use(authMiddleware)

facultyRouter.get("/api/faculty", async (req, res) => {
    const faculty = await prisma.faculty.findMany()

    res.status(200)
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
        const valid = checkValidationRequest(req, res)
        if (!valid) {
            return
        }

        // check if role admins
        const decoded = res.locals.decoded

        const status = await checkRoles(res, decoded.id)
        if (!status) {
            return
        }

        const { id, name } = req.body

        // check if faculty already exist
        const statusExist = await checkIfFacultyExist(id, name, res)
        if (!statusExist) {
            return
        }

        const faculty = new Faculty(id, name)

        const result = await prisma.faculty.create({
            data: faculty.forInsertPrisma()
        })

        res.status(201)
        res.json({
            code: 201,
            message: "Success create faculty",
            data: result
        })
    })

facultyRouter.put("/api/faculty",
    body("id").notEmpty().withMessage("ID is required"),
    body("name").notEmpty().withMessage("Name is required"),
    async (req, res) => {
        const valid = checkValidationRequest(req, res)
        if (!valid) {
            return
        }

        // check if role admins
        const decoded = res.locals.decoded

        const status = await checkRoles(res, decoded.id)
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
            res.status(404)
            res.json({
                code: 404,
                message: "Faculty does not exist",
                data: null
            })

            return
        }

        const existNew = await prisma.faculty.findFirst({
            where: {
                name: name,
            }
        })

        if (existNew !== null) {
            res.status(400)
            res.json({
                code: 400,
                message: "Faculty with new name already exist",
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

        res.status(200)
        res.json({
            code: 200,
            message: "Success update faculty",
            data: faculty
        })
    })



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
        res.status(400)
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