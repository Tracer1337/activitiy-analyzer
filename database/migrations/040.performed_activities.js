module.exports = {
    table: "performed_activities",

    run: `
        CREATE TABLE performed_activities (
            id varchar(255) PRIMARY KEY,
            finished_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            user_id varchar(255) NOT NULL,
            activity_id varchar(255) NOT NULL,

            FOREIGN KEY (user_id) REFERENCES users(id),
            FOREIGN KEY (activity_id) REFERENCES activities(id)
        );
    `
}