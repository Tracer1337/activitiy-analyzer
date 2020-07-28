const Collection = require("./Collection.js")
const { queryAsync, quotedList } = require("../app/utils")

const requiredProps = ["table", "columns", "id"]

/**
 * Class representing a Model. Strictly bound to the database.
 * 
 * @attribute {String} table - The name of the table bound to the model
 * @attribute {String[]} columns - The column names of the table in the correct order
 */
class Model {
    /**
     * Selects the first match for ``column == value`` in bound table
     * if there is any, and returns an instance of the bound model
     * representing the result.
     */
    static async findBy(column, value) {
        // Get matches from database
        const query = `SELECT * FROM ${this.table} WHERE ${column} = '${value}'`
        const results = await queryAsync(query)

        if(!results.length) {
            return
        }

        // Create new model
        const model = new this.model(results[0])
        
        if(model.init) {
            await model.init()
        }

        return model
    }

    /**
     * Same as findBy, but returns an array of all results instead
     * of only the first one.
     */
    static async findAllBy(column, value) {
        // Get matches from database
        const query = `SELECT * FROM ${this.table} WHERE ${column} = '${value}'`
        const results = await queryAsync(query)

        // Create model arrray
        const models = []

        for(let row of results) {
            const model = new this.model(row)

            if(model.init) {
                await model.init()
            }

            models.push(model)
        }

        return new Collection(models)
    }

    /**
     * Store the model into the database
     */
    async store() {
        const query = `INSERT INTO ${this.table} VALUES ${quotedList(this.columns.map(column => this[column]))}`
        await queryAsync(query)
    }

    /**
     * Update the model in the database
     */
    async update() {
        const query = `UPDATE ${this.table} SET ${this.columns.map(column => `${column} = '${this[column]}'`).join(",")} WHERE id = '${this.id}'`
        await queryAsync(query)
    }

    /**
     * Delete the model from the database
     */
    async delete() {
        const query = `DELETE FROM ${this.table} WHERE id = '${this.id}'`
        await queryAsync(query)
    }
    
    /**
     * Create a model
     */
    constructor(props) {
        // Check if the required attributes are defined
        requiredProps.forEach(attribute => {
            if (!props[attribute]) {
                throw new Error(`The attribute "${attribute}" is missing in model "${this.constructor.name}"`)
            }
        })

        // Assign props to this
        for(let key in props) {
            this[key] = props[key]
        }
    }
}

module.exports = Model