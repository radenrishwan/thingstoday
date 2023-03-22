import prisma from "./database.js";
import { UserRole } from "@prisma/client";
import {validationResult} from "express-validator";

export const checkValidationRequest = (req, res) => {
    const err = validationResult(req)

    if (!err.isEmpty()) {
        res.status(400)
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

        return false
    }

    return true
}

export const checkRoles = async (res, id) => {
    const user = await prisma.user.findFirst({
        where: {
            id: id
        }
    })

    if (user === null) {
        res.status(403)
        res.json({
            code: 403,
            message: "You didnt have access to this resource or user not found",
            data: null
        })

        return false
    }

    if (user.role !== UserRole.ADMIN) {
        res.status(403)
        res.json({
            code: 403,
            message: "You didnt have access to this resource",
            data: null
        })

        return false
    }

    return true
}