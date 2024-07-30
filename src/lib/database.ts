import sqlite3 from "sqlite3";
import { open } from "sqlite";

async function openDB() {
  return open({
    filename: "./movies.db",
    driver: sqlite3.Database,
  });
}

export async function createTables() {
  const db = await openDB();
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE,
      password TEXT
    );
    CREATE TABLE IF NOT EXISTS movies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER,
      title TEXT,
      year TEXT,
      image TEXT,
      FOREIGN KEY (userId) REFERENCES users(id)
    );
  `);
}

export async function getUserByEmail(email: string) {
  const db = await openDB();
  return db.get("SELECT * FROM users WHERE email = ?", email);
}

export async function addUser(email: string, password: string) {
  const db = await openDB();
  await db.run("INSERT INTO users (email, password) VALUES (?, ?)", [
    email,
    password,
  ]);
}

export async function getMoviesByUserId(userId: string) {
  const db = await openDB();
  return db.all("SELECT * FROM movies WHERE userId = ?", userId);
}

export async function addMovie(
  userId: string,
  title: string,
  year: string,
  image: string
) {
  const db = await openDB();
  await db.run(
    "INSERT INTO movies (userId, title, year, image) VALUES (?, ?, ?, ?)",
    [userId, title, year, image]
  );
}

export async function updateMovie(
  id: string,
  title: string,
  year: string,
  image: string
) {
  const db = await openDB();
  await db.run(
    "UPDATE movies SET title = ?, year = ?, image = ? WHERE id = ?",
    [title, year, image, id]
  );
}

export async function deleteMovie(id: string) {
  const db = await openDB();
  await db.run("DELETE FROM movies WHERE id = ?", id);
}
