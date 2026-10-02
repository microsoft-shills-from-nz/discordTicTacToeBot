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
 * @param uuid The user's discord id
 * @param newScraps The new amount of scraps
 * @param newWins The new amount of wins
 * @returns Whether the update was successful
 */
export async function updateUserData(uuid: string, newScraps: number, newWins: number) {
	try {
		const user = await getDb().execute("SELECT * FROM users WHERE uuid = ?", [uuid]);

		if (user.rows.length === 0) {
			console.log("User not found, creating new user...");
			await getDb().execute("INSERT INTO users (uuid, scraps, wins) VALUES (?, ?, ?)", [
				uuid,
				newScraps,
				newWins,
			]);
			return true;
		}

		await getDb().execute("UPDATE users SET scraps = ?, wins = ? WHERE uuid = ?", [
			newScraps,
			newWins,
			uuid,
		]);
		return true;
	} catch (e) {
		console.error(e);
		return false;
	}
}

/**
 * Get the user data from the database
 * @param uuid The user's discord id
 * @returns The user's data
 */
export async function getUserData(uuid: string): Promise<UserData[]> {
	const protoRes = (await getDb().execute("SELECT * FROM users WHERE uuid = ?", [uuid]))
		.rows;

	let res: UserData[] = [];

	for (const row of protoRes) {
		res.push({
			id: row.id as number,
			uuid: row.uuid as number,
			scraps: row.scraps as number,
			wins: row.wins as number,
		});
	}

	return res;
}
