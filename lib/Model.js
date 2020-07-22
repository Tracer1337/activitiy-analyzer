const requiredProps = ["table", "columns"]

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
        const result = await queryAsync(query)

        if(!result.length) {
            return
        }

        return new this.model(result[0])
    }

    /**
     * Stores the model into the database
     */
    async store() {
        const query = `INSERT INTO ${this.table} VALUES (${this.columns.map(column => `'${this[column]}'`).join(",")})`
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