module.exports = {
    table: "shortcuts",

    columns: [
        "id varchar(255) PRIMARY KEY",
        "icon varchar(255)",
        "activity_id varchar(255) NOT NULL",
        "user_id varchar(255) NOT NULL",
        "FOREIGN KEY (user_id) REFERENCES users(id)",
        "FOREIGN KEY (activity_id) REFERENCES activities(id)"
    ]
}