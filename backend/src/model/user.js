import { UserRole } from "@prisma/client"

export const toUserRole = (role) => {
    role = role.toUpperCase()

    switch (role) {
        case "ADMIN":
            return UserRole.ADMIN
        case "LECTURERS":
            return UserRole.LECTURERS
        case "STUDENTS":
            return UserRole.STUDENTS
    }
}

export class User {
    constructor(id, name, email, password, role, createdAt, updatedAt) {
        this.id = id
        this.name = name
        this.email = email
        this.password = password
        this.role = role
        this.createdAt = createdAt
        this.updatedAt = updatedAt
    }

    forInsertPrisma() {
        return {
            id: this.id,
            name: this.name,
            email: this.email,
            role: toUserRole(this.role),
            password: this.password
        }
    }
}