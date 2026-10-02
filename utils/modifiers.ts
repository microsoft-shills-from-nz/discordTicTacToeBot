import type { Board, BoardCell } from "./types";

type Player = "X" | "O";

const createEmptyCell = (): BoardCell => ({
  owner: null,
  isEmpty: true,
  powerUp: null,
});

export function applyModifier(
  board: Board,
  modifier: number,
  placedRow: number,
  placedColumn: number,
  placingPlayer: Player,
): void {
  switch (modifier) {
    // Column of the placed piece moves down 1
    case 0: {
      const columnCells = board.map((row) => row[placedColumn]);
      columnCells.forEach((cell, rowIndex) => {
        const destinationRow = (rowIndex + 1) % board.length;
        board[destinationRow][placedColumn] = cell;
      });
      break;
    }

    // Row of the placed piece moves left 1
    case 1: {
      const [firstCell, ...remainingCells] = board[placedRow];
      board[placedRow] = [...remainingCells, firstCell];
      break;
    }

    // Delete a random cell owned by the opponent
    case 3: {
      const opponent: Player = placingPlayer === "X" ? "O" : "X";
      const opponentCells = board.flatMap((row, rowIndex) =>
        row
          .map((cell, columnIndex) => ({ cell, rowIndex, columnIndex }))
          .filter(({ cell }) => cell.owner === opponent),
      );
      if (opponentCells.length === 0) break;

      const target =
        opponentCells[Math.floor(Math.random() * opponentCells.length)];
      board[target.rowIndex][target.columnIndex] = createEmptyCell();
      break;
    }

    // Wipe the row
    case 4: {
      for (
        let columnIndex = 0;
        columnIndex < board[placedRow].length;
        columnIndex++
      ) {
        if (columnIndex !== placedColumn) {
          board[placedRow][columnIndex] = createEmptyCell();
        }
      }
      break;
    }

    // Wipe the column
    case 5: {
      for (let rowIndex = 0; rowIndex < board.length; rowIndex++) {
        if (rowIndex !== placedRow) {
          board[rowIndex][placedColumn] = createEmptyCell();
        }
      }
      break;
    }
  }
}
