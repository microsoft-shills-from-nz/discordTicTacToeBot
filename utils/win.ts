import type { Board } from "./types";

export function hasWon(
  board: Board,
  lineLength = 4,
): { winner: "X" | "O"; cells: [row: number, column: number][] } | null {
  const directions = [
    { rowStep: 0, columnStep: 1 }, // horizontal →
    { rowStep: 1, columnStep: 0 }, // vertical ↓
    { rowStep: 1, columnStep: 1 }, // diagonal ↘
    { rowStep: 1, columnStep: -1 }, // diagonal ↙
  ];

  for (let startRow = 0; startRow < board.length; startRow++) {
    for (
      let startColumn = 0;
      startColumn < board[startRow].length;
      startColumn++
    ) {
      const owner = board[startRow][startColumn].owner;
      if (owner === null) continue;

      for (const { rowStep, columnStep } of directions) {
        const lineCells: [number, number][] = [[startRow, startColumn]];

        for (
          let stepsFromStart = 1;
          stepsFromStart < lineLength;
          stepsFromStart++
        ) {
          const nextRow = startRow + rowStep * stepsFromStart;
          const nextColumn = startColumn + columnStep * stepsFromStart;

          if (board[nextRow]?.[nextColumn]?.owner !== owner) break;
          lineCells.push([nextRow, nextColumn]);
        }

        if (lineCells.length === lineLength) {
          return { winner: owner, cells: lineCells };
        }
      }
    }
  }

  return null;
}
