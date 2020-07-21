module.exports = {
    table: "model_tags",

    columns: [
        "id varchar(255) PRIMARY KEY",
        "model_name varchar(255) NOT NULL",
        "model_id varchar(255) NOT NULL",
        "tag_id varchar(255) NOT NULL",
        "FOREIGN KEY (tag_id) REFERENCES tags(id)"
    ]
}