import express from 'express';
import prisma from '../utils/database.js';
import authMiddleware from '../middleware/auth.js';
import { v4 as uuidv4 } from 'uuid';
import { body, validationResult } from "express-validator";
import { Category } from '../model/category.js';
import { checkRoles, checkValidationRequest } from "../utils/auth.js";

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

        // check if category already exist
        const statusExist = await checkIfCategoryExist(name, res)
        if (!statusExist) {
            return
        }

        const category = new Category(uuidv4(), name.toLocaleLowerCase())

        const result = await prisma.category.create({
            data: category.forInsertPrisma()
        })

        res.status(200)
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

        const { old } = req.body

        // check if category is exist
        // check old value
        const exist = await prisma.category.findFirst({
            where: {
                name: old,
            }
        })

        if (exist === null) {
            res.status(400)
            res.json({
                code: 400,
                message: "Category does not exist",
                data: null
            })

            return
        }

        const existNew = await prisma.category.findFirst({
            where: {
                name: req.body.new, //TODO: change to lowercase later
            }
        })

        if (existNew !== null) {
            res.status(400)
            res.json({
                code: 400,
                message: "Category already with new name already exist",
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

        res.status(200)
        res.json({
            code: 200,
            message: "Success update category",
            data: category
        })
    })


const checkIfCategoryExist = async (name, res) => {
    const category = await prisma.category.findFirst({
        where: {
            name: name
        }
    })

    if (category !== null) {
        res.status(409)
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