import "dotenv/config";

export const configs = {
    environment: process.env.CA_ENVIRONMENT || "dev",
    api: {
        prefix: "/api/v1",
    },
    express: {
        host: process.env.CA_HOST_NAME || "0.0.0.0",
        port: process.env.CA_PORT_NUMBER || "6808",
    },
    mongo: {
        username: process.env.CA_MONGO_USERNAME || "quangvt5",
        password: process.env.CA_MONGO_PASSWORD || "Qvt29092001.",
        dbName: process.env.CA_MONGO_DB_NAME || "assignment",
        templateUri:
            "mongodb+srv://${username}:${password}@cluster0.k0fqybm.mongodb.net/${dbName}",
        getUri: function (): string {
            let uri = this.templateUri;
            uri = uri.replace("${username}", this.username);
            uri = uri.replace("${password}", this.password);
            uri = uri.replace("${dbName}", this.dbName);
            return uri;
        },
    },
    log: {
        logFileEnabled: process.env.CA_LOG_FILE_ENABLED || "false",
        folderLogsPath:
            process.env.CA_FOLDER_LOGS_PATH || `${__dirname}/../../logs`,
    },
    services: {},
};
