import React from "react";
import "./App.css";
import Cell from "./Cell";

const App: React.FC = () => {
  const [wasmModule, setWasmModule] = React.useState<any>();

  const loadWasm = async () => {
    try {
      const wasm = await import("sudoku");
      setWasmModule(wasm);
    } catch (err) {
      console.error(`Unexpected error in loadWasm. [Message: ${err.message}]`);
    }
  };

  // load wasm asynchronously
  wasmModule === undefined && loadWasm();
  let board: any = null;
  if (wasmModule !== undefined) {
    board = wasmModule.Board.new();
    board.generate_problem(20);
    let problem = board.print_board().trim().split("\n");
    if (problem.length != 9) {
      throw "Invalid board";
    }
    for (let row = 0; row < 9; row++) {
      if (problem[row].length != 9) {
        throw "Invalid board";
      }
    }
    let game = [];
    for (let row = 0; row < 9; row++) {
      let line = [];
      for (let col = 0; col < 9; col++) {
        let value =
          problem[row][col] === "0" ? null : parseInt(problem[row][col]);
        line.push(
          Cell.newCell(row, col, value, false, problem[row][col] === "0")
        );
      }
      game.push(line);
    }

    return (
      <div className="App">
        {/* <p>{board.print_board()}</p> */}
        <table className="sudoku-table">
          <tbody>
            {game.map(function (line, i) {
              return (
                <tr key={i}>
                  {line.map(function (cell) {
                    return <Cell cell={cell} board={board} key={cell.column} />;
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  } else {
    return <p>Loading</p>;
  }
};

export default App;
