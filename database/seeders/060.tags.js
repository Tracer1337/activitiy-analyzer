module.exports = {
    table: "tags",

    run: `
        CREATE TABLE tags (
            id varchar(255) PRIMARY KEY,
            name varchar(255) NOT NULL,
            user_id varchar(255) NOT NULL,

            FOREIGN KEY (user_id) REFERENCES users(id)
        );
    `
}