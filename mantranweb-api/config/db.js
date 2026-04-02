import sql from "mssql";

export const sqlConfig = {
    user: "sa",
    password: "SENHA",
    database: "MantranWeb",
    server: "192.168.0.10",
    pool: {
        max: 20,
        min: 0,
        idleTimeoutMillis: 30000,
    },
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
};

export async function getPool() {
    if (sql.connected) return sql;
    return sql.connect(sqlConfig);
}
