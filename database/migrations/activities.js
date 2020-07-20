module.exports = {
    table: "activities",

    run: `
        CREATE TABLE activities (
            id varchar(255) PRIMARY KEY,
            name varchar(255),
            user_id varchar(255),
            category varchar(255),
            FOREIGN KEY (user_id) REFERENCES users(id)
        );
    `
}