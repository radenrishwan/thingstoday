import express from 'express';
import prisma from '../utils/database.js';
import authMiddleware from '../middleware/auth.js';
import { v4 as uuidv4 } from 'uuid';
import { body, validationResult } from "express-validator";
import { UserRole } from '@prisma/client';
import { Category } from '../model/category.js';

const categoryRouter = express.Router();

categoryRouter.use(authMiddleware)

categoryRouter.get("/api/category", async (req, res) => {
    const category = await prisma.category.findMany()

    res.json({
        code: 200,
        message: "Success get category",
        data: category
    })
})

categoryRouter.post("/api/category",
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

        const status = await checkRoles(res, decoded.id)
        if (!status) {
            return
        }

        const { name } = req.body

        // check if category alread exist
        const statusExist = await checkIfCategoryExist(name, res)
        if (!statusExist) {
            return
        }

        const category = new Category(uuidv4(), name)

        const result = await prisma.category.create({
            data: category.forInsertPrisma()
        })

        res.json({
            code: 200,
            message: "Success create category",
            data: result
        })
    })

categoryRouter.put("/api/category",
    body("old").notEmpty().withMessage("Old name is required"),
    body("new").notEmpty().withMessage("New name is required"),
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

        const status = await checkRoles(res, decoded.id)
        if (!status) {
            return
        }

        const { old } = req.body

        // check if category is exist
        const exist = await prisma.category.findFirst({
            where: {
                name: old,
            }
        })

        if (exist === null) {
            res.json({
                code: 404,
                message: "Category does not exist",
                data: null
            })

            return
        }

        const category = await prisma.category.update({
            where: {
                name: old
            },
            data: {
                name: req.body.new
            }
        })

        res.json({
            code: 201,
            message: "Success update category",
            data: category
        })
    })

const checkRoles = async (res, id) => {
    const user = await prisma.user.findFirst({
        where: {
            id: id
        }
    })

    if (user === null) {
        res.json({
            code: 403,
            message: "You didnt have access to this resource or user not found",
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

const checkIfCategoryExist = async (name, res) => {
    const category = await prisma.category.findFirst({
        where: {
            name: name
        }
    })

    if (category !== null) {
        res.json({
            code: 409,
            message: "Category already exist",
            data: null
        })

        return false
    }

    return true
}

export default categoryRouter