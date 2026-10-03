import { createClient, type Client, type Row } from "@libsql/client";
import type { UserData } from "./types";

const globalForDb = globalThis as unknown as { libsqlClient?: Client };

/**
 * Get the database client
 */
export function getDb(): Client {
  if (!globalForDb.libsqlClient) {
    globalForDb.libsqlClient = createClient({
      url: process.env.TURSO_URL || "",
      authToken: process.env.TURSO_KEY || "",
    });
  }
  return globalForDb.libsqlClient;
}

/**
 * Update the user data in the database
 * @param uid The user's discord id
 * @param newScraps The new amount of scraps
 * @param newWins The new amount of wins
 * @returns Whether the update was successful
 */
export async function updateUserData(
  uid: string,
  newScraps?: number,
  newWins?: number,
) {
  try {
    const user = await getDb().execute("SELECT * FROM users WHERE uid = ?", [
      uid,
    ]);

    if (user.rows.length === 0) {
      console.log("User not found, creating new user...");
      await getDb().execute(
        "INSERT INTO users (uid, scraps, wins) VALUES (?, ?, ?)",
        [uid, newScraps ?? user.rows[0].scraps, newWins ?? user.rows[0].wins],
      );
      return true;
    }

    await getDb().execute(
      "UPDATE users SET scraps = ?, wins = ? WHERE uid = ?",
      [newScraps || user.rows[0].scraps, newWins || user.rows[0].wins, uid],
    );
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
}

/**
 * Update the user data in the database
 * @param uid The user's discord id
 * @param newScraps The new amount of scraps
 * @param newWins The new amount of wins
 * @returns Whether the update was successful
 */
export async function addUser(uid: string, scraps: number, wins: number) {
  try {
    await getDb().execute(
      "INSERT INTO users (uid, scraps, wins) VALUES (?, ?, ?)",
      [uid, scraps, wins],
    );

    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
}

/**
 * Get the user data from the database
 * @param uid The user's discord id
 * @returns The user's data
 */
export async function getUserData(uid: string): Promise<UserData[]> {
  const protoRes = (
    await getDb().execute("SELECT * FROM users WHERE uid = ?", [uid])
  ).rows;

  let res: UserData[] = [];

  for (const row of protoRes) {
    res.push({
      id: row.id as number,
      uid: row.uid as number,
      scraps: row.scraps as number,
      wins: row.wins as number,
    });
  }

  if (res.length === 0) {
    await addUser(uid, 10, 0);

    return getUserData(uid);
  }

  return res;
}

/**
 * Get the user data from the database
 * @param limit The amount of users to get
 * @returns The user's data
 */
export async function getUserLeaderboard(limit: number): Promise<UserData[]> {
  const protoRes = (
    await getDb().execute("SELECT * FROM users ORDER BY scraps DESC LIMIT ?", [
      limit,
    ])
  ).rows;

  let res: UserData[] = [];

  for (const row of protoRes) {
    res.push({
      id: row.id as number,
      uid: row.uid as number,
      scraps: row.scraps as number,
      wins: row.wins as number,
    });
  }

  return res;
}
