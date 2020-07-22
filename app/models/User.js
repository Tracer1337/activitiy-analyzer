const Model = require("../../lib/Model.js")

class User extends Model {
    static findBy = super.findBy.bind({ model: User, table: "users" })

    constructor(values) {
        super({
            table: "users",
            columns: ["id", "email", "password", "created_at"],
            ...values
        })
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