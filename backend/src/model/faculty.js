export class Faculty {
    constructor(id, name, createdAt, updatedAt) {
        this.id = id,
        this.name = name,
        this.createdAt = createdAt,
        this.updatedAt = updatedAt
    }

    forInsertPrisma() {
        return {
            id: this.id,
            name: this.name
        }
    }
}