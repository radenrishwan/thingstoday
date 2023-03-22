export class Book {
    constructor(id, name, imageUrl, author, description, facultyId, category ,createdAt, updatedAt) {
        this.id = id
        this.name = name
        this.imageUrl = imageUrl
        this.author = author
        this.description = description
        this.facultyId = facultyId
        this.category = category
        this.createdAt = createdAt
        this.updatedAt = updatedAt
    }

    forInsertPrisma() {
        return {
            id: this.id,
            name: this.name,
            imageUrl: this.imageUrl,
            author: this.author,
            facultyId: this.facultyId,
            description: this.description
        }
    }

    forUpdatePrisma() {
        return {
            name: this.name,
            imageUrl: this.imageUrl,
            author: this.author,
            facultyId: this.facultyId,
            description: this.description
        }
    }
}