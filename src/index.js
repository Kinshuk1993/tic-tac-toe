import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// function components
/**
 * 
 * In React, function components are a simpler way to write components that only contain a render method and don’t have their own state. Instead of defining a class which extends React.Component, we can write a function that takes props as input and returns what should be rendered. Function components are less tedious to write than classes, and many components can be expressed this way.
 * 
 */
function Square(props) {
  return (
    <button
      className="square"
      onClick={props.onClick}
    >
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return <Square
      value={this.props.squares[i]}
      onClick={() => this.props.onClick(i)}
    />;
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        { squares: Array(9).fill(null) }
      ],
      step: 0,
      isX: true
    };
  }

  handleClick(i) {
    // This ensures that if we “go back in time” and then make a new move from that point, we throw away all the “future” history that would now become incorrect.
    const history = this.state.history.slice(0, this.state.step + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    // the or part is to avoid changing the state if the square is already filled
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const isX = this.state.isX;
    squares[i] = isX ? 'X' : 'O';
    this.setState({
      history: history.concat([
        { squares: squares }
      ]),
      step: history.length,
      isX: !isX
    });
  }

  // ignoring history keeps it unchanged as its not altered in any way
  jumpTo(step, winner) {
    // cannot go back once the game is over
    // also handles game restart
    if (winner || step === 0) {
      this.setState({
        history: [
          { squares: Array(9).fill(null) }
        ],
        step: 0,
        isX: true
      });
      return;
    }
    this.setState({
      step: step,
      isX: (step % 2) === 0,
    });
  }

  render() {
    const history = this.state.history;
    // rendering the currently selected move according to stepNumber
    const current = history[this.state.step];
    let winner = calculateWinner(current.squares);

    let moves = history.map((_step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Restart Game';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move, winner)}>{desc}</button>
        </li>
      );
    });

    let status = "";
    if (winner) {
      // const newMoves = moves.slice(0, 1);
      moves = moves.slice(0, 1);
      status = 'Game over! Winner: ' + winner;
    }
    else
      status = 'Turn for player: ' + (this.state.isX ? 'X' : 'O');

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
