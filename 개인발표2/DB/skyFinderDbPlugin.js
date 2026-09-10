import { DatabaseSync } from "node:sqlite";
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

function sendJson(response, status, payload) {
  response.statusCode = status;
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.end(JSON.stringify(payload));
}

function readJson(request) {
  return new Promise((resolve, reject) => {
    let body = "";
    request.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1_000_000) reject(new Error("요청이 너무 큽니다."));
    });
    request.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        reject(new Error("올바른 JSON이 아닙니다."));
      }
    });
    request.on("error", reject);
  });
}

function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function passwordMatches(password, saved) {
  const [salt, hash] = saved.split(":");
  if (!salt || !hash) return false;
  const actual = scryptSync(password, salt, 64);
  const expected = Buffer.from(hash, "hex");
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

function openDatabase(root) {
  const databasePath = join(root, "data", "skyfinder.db");
  mkdirSync(dirname(databasePath), { recursive: true });
  const db = new DatabaseSync(databasePath);
  db.exec("PRAGMA foreign_keys = ON");
  db.exec(`
    CREATE TABLE IF NOT EXISTS accounts (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      birth_date TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      avatar TEXT NOT NULL DEFAULT 'pilot'
    ) STRICT;
    CREATE TABLE IF NOT EXISTS bookings (
      number TEXT PRIMARY KEY,
      owner_id TEXT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
      payload TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    ) STRICT;
    CREATE TABLE IF NOT EXISTS questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      owner_id TEXT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      author TEXT NOT NULL,
      answer TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    ) STRICT;
  `);
  return db;
}

export function skyFinderDbPlugin() {
  let db;

  const attachMiddleware = (server) => {
    db ??= openDatabase(server.config.root);
    server.middlewares.use(async (request, response, next) => {
      const url = new URL(request.url, "http://localhost");
      const path = url.pathname;
      if (!path.startsWith("/api/")) return next();

      try {
        if (request.method === "POST" && path === "/api/accounts") {
          const { id, name, birthDate, password } = await readJson(request);
          if (
            !id?.trim() ||
            !name?.trim() ||
            !birthDate ||
            password?.length < 4
          )
            return sendJson(response, 400, {
              message: "회원 정보를 확인해 주세요.",
            });
          try {
            db.prepare(
              "INSERT INTO accounts (id, name, birth_date, password_hash) VALUES (?, ?, ?, ?)",
            ).run(id.trim(), name.trim(), birthDate, hashPassword(password));
          } catch (error) {
            if (error.message.includes("UNIQUE"))
              return sendJson(response, 409, {
                message: "이미 사용 중인 아이디입니다.",
              });
            throw error;
          }
          return sendJson(response, 201, { id: id.trim() });
        }

        if (request.method === "POST" && path === "/api/login") {
          const { id, password } = await readJson(request);
          const account = db
            .prepare("SELECT * FROM accounts WHERE id = ?")
            .get(id);
          if (
            !account ||
            !passwordMatches(password ?? "", account.password_hash)
          )
            return sendJson(response, 401, {
              message: "아이디 또는 비밀번호가 올바르지 않습니다.",
            });
          return sendJson(response, 200, {
            user: {
              id: account.id,
              name: account.name,
              avatar: account.avatar,
            },
          });
        }

        if (request.method === "GET" && path === "/api/accounts/find-id") {
          const rows = db
            .prepare("SELECT id FROM accounts WHERE name = ? ORDER BY id")
            .all(url.searchParams.get("name") ?? "");
          return sendJson(response, 200, { ids: rows.map(({ id }) => id) });
        }

        if (request.method === "PATCH" && path === "/api/accounts/password") {
          const { id, name, password } = await readJson(request);
          const result = db
            .prepare(
              "UPDATE accounts SET password_hash = ? WHERE id = ? AND name = ?",
            )
            .run(hashPassword(password ?? ""), id, name);
          if (!result.changes)
            return sendJson(response, 404, {
              message: "아이디와 이름이 일치하는 계정을 찾을 수 없습니다.",
            });
          return sendJson(response, 200, { ok: true });
        }

        const accountMatch = path.match(/^\/api\/accounts\/([^/]+)$/);
        if (accountMatch && request.method === "GET") {
          const account = db
            .prepare("SELECT id, name, avatar FROM accounts WHERE id = ?")
            .get(decodeURIComponent(accountMatch[1]));
          if (!account)
            return sendJson(response, 404, {
              message: "계정을 찾을 수 없습니다.",
            });
          return sendJson(response, 200, { user: account });
        }
        if (accountMatch && request.method === "PATCH") {
          const id = decodeURIComponent(accountMatch[1]);
          const { name, avatar } = await readJson(request);
          const result = db
            .prepare("UPDATE accounts SET name = ?, avatar = ? WHERE id = ?")
            .run(name, avatar, id);
          if (!result.changes)
            return sendJson(response, 404, {
              message: "계정을 찾을 수 없습니다.",
            });
          return sendJson(response, 200, { user: { id, name, avatar } });
        }
        if (accountMatch && request.method === "DELETE") {
          db.prepare("DELETE FROM accounts WHERE id = ?").run(
            decodeURIComponent(accountMatch[1]),
          );
          return sendJson(response, 200, { ok: true });
        }

        if (request.method === "GET" && path === "/api/bookings") {
          const rows = db
            .prepare("SELECT payload FROM bookings ORDER BY created_at DESC")
            .all();
          return sendJson(response, 200, {
            bookings: rows.map(({ payload }) => JSON.parse(payload)),
          });
        }
        if (request.method === "POST" && path === "/api/bookings") {
          const booking = await readJson(request);
          db.prepare(
            "INSERT INTO bookings (number, owner_id, payload) VALUES (?, ?, ?)",
          ).run(booking.number, booking.ownerId, JSON.stringify(booking));
          return sendJson(response, 201, { booking });
        }
        const bookingMatch = path.match(/^\/api\/bookings\/([^/]+)$/);
        if (bookingMatch && request.method === "DELETE") {
          db.prepare("DELETE FROM bookings WHERE number = ?").run(
            decodeURIComponent(bookingMatch[1]),
          );
          return sendJson(response, 200, { ok: true });
        }

        if (request.method === "GET" && path === "/api/questions") {
          const questions = db
            .prepare(
              `SELECT id, title, content, answer, owner_id AS ownerId, author
            FROM questions ORDER BY id DESC`,
            )
            .all();
          return sendJson(response, 200, { questions });
        }
        if (request.method === "POST" && path === "/api/questions") {
          const { ownerId, title, content, author } = await readJson(request);
          const result = db
            .prepare(
              "INSERT INTO questions (owner_id, title, content, author) VALUES (?, ?, ?, ?)",
            )
            .run(ownerId, title, content, author);
          const question = {
            id: Number(result.lastInsertRowid),
            ownerId,
            title,
            content,
            author,
            answer: null,
          };
          return sendJson(response, 201, { question });
        }
        const questionMatch = path.match(/^\/api\/questions\/(\d+)$/);
        if (questionMatch && request.method === "DELETE") {
          db.prepare("DELETE FROM questions WHERE id = ?").run(
            Number(questionMatch[1]),
          );
          return sendJson(response, 200, { ok: true });
        }

        return next();
      } catch (error) {
        console.error(error);
        return sendJson(response, 500, {
          message: "데이터베이스 처리 중 오류가 발생했습니다.",
        });
      }
    });
  };

  return {
    name: "sky-finder-sqlite",
    configureServer: attachMiddleware,
    configurePreviewServer: attachMiddleware,
  };
}
