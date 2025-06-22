import path from "path"
import sqlite3 from "sqlite3"
import {open} from "sqlite"
import { fileURLToPath } from "url"
import fs from "fs"


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)
const dbPath = path.join(__dirname, "database.sqlite");

if (!fs.existsSync(dbPath)){
    console.error("Db file not found", dbPath);
    process.exit(1);
}

const tmDbPath = path.join("/sqlite", "database.sqlite");
if(!fs.existsSync(tmDbPath)){
    fs.copyFileSync(dbPath, tmDbPath)
}

export const initialDB = async () => {
    const db = await open({
        filename: tmDbPath,
        driver: sqlite3.Database
    });

    await db.exec(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT,
                email TEXT UNIQUE,
                password  TEXT,
                role TEXT CHECK(role IN ('patient', 'caretaker')) NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS medications (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                name TEXT NOT NULL,
                dosage TEXT NOT NULL,
                frequency TEXT NOT NULL,
                last_taken_today BOOLEAN DEFAULT 0,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            );

            DROP TABLE IF EXISTS medication_logs;
            CREATE TABLE IF NOT EXISTS medication_logs(
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                medication_id INTEGER NOT NULL,
                photo TEXT NOT NULL,
                taken_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (medication_id) REFERENCES medications(id)
            );
        `)

        console.log('Database connected')

    return db
}