import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


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

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}


class Board extends React.Component {

  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }




  static genSqures(){
    var toAdd = document.createDocumentFragment();
    for(var i=0; i < 3; i++){
       var newDiv = document.createElement('div');
       newDiv.className = 'board-row';

       toAdd.appendChild(newDiv);
    }
    
    document.appendChild(toAdd);
  }


  createTable(){
    let table = []

    // Outer loop to create parent
    for (let i = 0; i < 3; i++) {
      let children = []
      //Inner loop to create children
      for (let j = 0; j < 3; j++) {
        children.push(this.renderSquare(i +j *3))
      }
      //Create the parent and add the children
      table.push(<div>{children}</div>)
    }
    return table
    
}

  render() {
    return (
      <div>
        {this.createTable()}
      </div>
      
      /*<div>
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
*/
    );
  }
}



class Game extends React.Component {

  static getMoved(i){
    const x =  i %3 == 0 ? 3 : (i) %3;
    const y =  Math.floor((i - 1) / 3)+1;
    return  x + ' ' + y;
  }

  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      moves: [],
      stepNumber: 0,
      xIsNext: true,
      isAscending: true,
    };
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  changeOrdering() {
    this.setState({
      history: this.state.history,
      moves: this.state.moves,
      stepNumber: this.state.stepNumber,
      xIsNext: this.state.xIsNext,
      isAscending : !this.state.isAscending,
    });
  }


  handleClick(i) {

    
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const moves = this.state.moves.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      moves: moves.concat(
        Game.getMoved((i+1)),
      ),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }



  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      /*const desc = move ?
        'Go to move #' + move + ' ' + ' move: ' + (move % 2 != 0 ? 'X' : '0' ) + ' ' + this.state.moves[move-1]:
        'Go to game start';*/
        const index = (move ? (this.state.isAscending ? move : this.state.stepNumber - move + 1) : null);
        const desc = move ?
        'Go to move #' + index + ' ' + ' move: ' + (index % 2 != 0 ? 'X' : '0' ) + ' ' + this.state.moves[index-1]:
        'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(index)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

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
        <div className="game-info">
          <button onClick={() => this.changeOrdering()}>{this.state.isAscending ? 'ascending' : 'descanding'}</button>
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
