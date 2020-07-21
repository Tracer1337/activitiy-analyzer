module.exports = {
    table: "activities",

    columns: [
        "id varchar(255) PRIMARY KEY",
        "name varchar(255) NOT NULL",
        "category_id varchar(255) NOT NULL",
        "user_id varchar(255) NOT NULL",
        "FOREIGN KEY (user_id) REFERENCES users(id)",
        "FOREIGN KEY (category_id) REFERENCES categories(id)"
    ]
}