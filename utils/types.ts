/**
 * The user's data
 * @property id The user's discord id
 * @property uuid The user's uuid
 * @property scraps The user's amount of scraps
 * @property wins The user's amount of wins
 */
export type UserData = {
	id: number;
	uuid: string;
	scraps: number;
	wins: number;
};

/**
 * The user's board
 * @property board The user's board
 */
export type BoardCell = {
	owner: "X" | "O" | null;
	isEmpty: boolean;
	powerUp: "upShift" | "leftShift" | "replace" | "destroy" | "wipeRow" | "wipeCol" | null;
};

/**
 *  const board: Board = [
 *  	[
 * 			{ owner: null, isEmpty: true, powerUp: null },
 *  		{ owner: null, isEmpty: true, powerUp: null },
 *  		{ owner: null, isEmpty: true, powerUp: null },
 *  	],
 *  	[
 *  		{ owner: null, isEmpty: true, powerUp: null },
 *  		{ owner: null, isEmpty: true, powerUp: null },
 *  		{ owner: null, isEmpty: true, powerUp: null },
 *  	],
 *  ];
 */
export type Board = BoardCell[][];
