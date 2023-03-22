import express from 'express';
import prisma from '../utils/database.js';
import authMiddleware from '../middleware/auth.js';
import { v4 as uuidv4 } from 'uuid';
import { body, param, query } from "express-validator";
import { Book } from '../model/book.js';
import { checkRoles, checkValidationRequest } from "../utils/auth.js";

const booksRouter = express.Router();

booksRouter.use(authMiddleware)

booksRouter.get("/api/books",
    query('page').notEmpty().withMessage('Page is required')
        .isNumeric().isLength({ min: 1 }).withMessage('Page must be number and greater than 0'),
    query('limit').notEmpty().withMessage('Limit is required')
        .isNumeric().isLength({ min: 1, max: 10 }).withMessage('Limit must be number and max 10'),
    async (req, res) => {
        const valid = checkValidationRequest(req, res)
        if (!valid) {
            return
        }

        var { page, limit } = req.query

        page = parseInt(page)
        limit = parseInt(limit)

        const books = await prisma.books.findMany({
            skip: (page - 1) * limit,
            take: limit,
            orderBy: {
                createdAt: 'desc'
            }, // TODO: add filter by later
            include: {
                BookCategory: {
                    select: {
                        category: true,
                    }
                }
            }
        })

        const count = await prisma.books.count()

        res.json({
            code: 200,
            message: "Success get books",
            data: {
                page: page,
                limit: limit,
                total: count,
                result: books.length,
                index_start: (page - 1) * limit + 1,
                books: books
            }
        })
    })

booksRouter.get("/api/books/search",
    query('q').notEmpty().withMessage('Query is required')
        .isString().isLength({ min: 1 }).withMessage('Query must be string'),
    query('page').notEmpty().withMessage('Page is required').isNumeric()
        .isLength({ min: 1 }).withMessage('Page must be number and greater than 0'),
    query('limit').notEmpty().withMessage('Limit is required')
        .isNumeric().isLength({ min: 1, max: 10 }).withMessage('Limit must be number and max 10'),
    async (req, res) => {
        const valid = checkValidationRequest(req, res)
        if (!valid) {
            return
        }
        var { page, limit, q } = req.query

        page = parseInt(page)
        limit = parseInt(limit)

        const books = await prisma.books.findMany({
            skip: (page - 1) * limit,
            take: limit,
            orderBy: {
                createdAt: 'desc'
            }, // TODO: add filter by later
            where: {
                name: {
                    search: q,
                },
                author: {
                    search: q,
                },
                description: {
                    search: q,
                },
            },
            include: {
                BookCategory: {
                    select: {
                        category: true,
                    }
                }
            }
        })

        const count = await prisma.books.count({
            where: {
                name: {
                    search: q,
                },
                author: {
                    search: q,
                },
                description: {
                    search: q,
                },
            }
        })

        res.json({
            code: 200,
            message: "Success search books",
            data: {
                page: page,
                lmit: limit,
                total: count,
                result: books.length,
                index_start: (page - 1) * limit + 1,
                books: books
            }
        })
    })

booksRouter.post("/api/books",
    body("name").notEmpty().withMessage("Name is required"),
    body('author').notEmpty().withMessage("Author is required"),
    body('category').notEmpty().withMessage("Category is required").isArray().withMessage("Category must be array"),
    body('faculty').notEmpty().withMessage("Faculty is required"),
    body('description').notEmpty().withMessage("Description is required"),
    body('image').notEmpty().withMessage("Image is required").isURL().withMessage("Image must be url"),
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

        const { name, author, category, faculty, description, image } = req.body

        // check if books alread exist
        const statusExist = await checkIfBookExist(name, res)
        if (!statusExist) {
            return
        }

        // check if category exist
        const statusCategory = await checkIfCategoryExist(category, res) //TODO: fix fcking this one
        if (!statusCategory) {
            return
        }

        const book = new Book(uuidv4(), name, image, author, description, faculty, category)
        const result = await prisma.books.create({
            data: book.forInsertPrisma()
        })

        await insertAllBookCategory(book.id, book.category)

        res.status(201)
        res.json({
            code: 201,
            message: "Success create books",
            data: result
        })
    })

booksRouter.put("/api/books",
    body("id").notEmpty().withMessage("ID is required"),
    body("name").notEmpty().withMessage("Name is required"),
    body('author').notEmpty().withMessage("Author is required"),
    body('category').notEmpty().withMessage("Category is required").isArray().withMessage("Category must be array"),
    body('faculty').notEmpty().withMessage("Faculty is required"),
    body('description').notEmpty().withMessage("Description is required"),
    body('image').notEmpty().withMessage("Image is required").isURL().withMessage("Image must be url"),
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

        const { id, name, author, category, faculty, description, image } = req.body

        // check if books alread exist
        const statusExist = await checkIfBookExist(name, res)
        if (!statusExist) {
            return
        }

        // check if category exist
        const statusCategory = await checkIfCategoryExist(category, res)
        if (!statusCategory) {
            return
        }

        const book = new Book(id, name, image, author, description, faculty, category)
        const result = await prisma.books.update({
            where: {
                id: book.id
            },
            data: book.forUpdatePrisma()
        })

        await insertAllBookCategoryWhenExist(book.id, book.category)

        res.json({
            code: 200,
            message: "Success update books",
            data: result
        })
    }) // TODO: fix later i need rest hjeh

booksRouter.get("/api/books/:id",
    param('id').notEmpty().withMessage('Id is required').isString().withMessage('Id must be string'),
    async (req, res) => {
        const valid = checkValidationRequest(req, res)
        if (!valid) {
            return
        }

        const { id } = req.params

        const books = await prisma.books.findFirst({
            where: {
                id: id
            },
            include: {
                BookCategory: {
                    select: {
                        category: true,
                    }
                }
            }
        })

        res.json({
            code: 200,
            message: "Success get books",
            data: books
        })
    })

booksRouter.delete("/api/books/:id",
    param('id').notEmpty().withMessage('Id is required').isString().withMessage('Id must be string'),
    async (req, res) => {
        const valid = checkValidationRequest(req, res)
        if (!valid) {
            return
        }

        const { id } = req.params

        const books = await prisma.books.delete({
            where: {
                id: id
            },
        })

        res.json({
            code: 200,
            message: "Success get books",
            data: books
        })
    })

const checkIfBookExist = async (name, res) => {
    const books = await prisma.books.findFirst({
        where: {
            name: name
        }
    })

    if (books !== null) {
        res.status(409)
        res.json({
            code: 409,
            message: "books already exist",
            data: null
        })

        return false
    }

    return true
}

const checkIfCategoryExist = async (category, res) => {
    for (const value of category) {
        const category = await prisma.category.findFirst({
            where: {
                name: value
            }
        })

        if (category === null) {
            res.status(404)
            res.json({
                code: 404,
                message: "Category not found",
                data: null
            })

            return false
        }
    }

    return true
}


const insertAllBookCategory = async (bookId, category) => {
    const data = []

    await category.forEach(async (value) => {
        data.push({
            id: uuidv4(),
            bookId: bookId,
            category: value
        })
    })

    await prisma.bookCategory.createMany({
        data: data,
        skipDuplicates: true
    })
}

const insertAllBookCategoryWhenExist = async (bookId, category) => {
    await prisma.bookCategory.deleteMany({
        where: {
            bookId: bookId
        }
    })

    await insertAllBookCategory()
}
export default booksRouter