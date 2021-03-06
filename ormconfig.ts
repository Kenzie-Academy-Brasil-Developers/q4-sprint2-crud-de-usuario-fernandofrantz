export default {
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "password",
    database: "docker_kenzie",
    synchronize: true,
    logging: false,
    entities: ["src/entity/**/*.ts"],
    migrations: ["src/migrations/**/*.ts"],
    cli: {
        entitiesDir: "src/entity",
        migrationsDir: "src/migrations",
    },
};