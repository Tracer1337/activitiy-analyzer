module.exports = {
    table: "shortcuts",

    run: `
        CREATE TABLE shortcuts (
            id varchar(255) PRIMARY KEY,
            icon varchar(255),
            user_id varchar(255) NOT NULL,
            activity_id varchar(255) NOT NULL,

            FOREIGN KEY (user_id) REFERENCES users(id),
            FOREIGN KEY (activity_id) REFERENCES activities(id)
        );
    `
}