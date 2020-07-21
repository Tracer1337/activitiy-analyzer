class User {
    constructor({ id, email, password, created_at }) {
        this.id = id
        this.email = email
        this.password = password
        this.created_at = created_at
    }

    toJSON() {
        return {
            id: this.id,
            email: this.email,
            created_at: this.created_at
        }
    }
}

module.exports = User