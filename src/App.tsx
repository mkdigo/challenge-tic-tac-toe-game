import { useEffect, useState } from 'react';

import './App.scss';

type Player = 'x' | 'o';
type Position = Player | null;
type Orientation = 'horizontal' | 'vertical' | 'diagonal';
type Winner = {
  player: Player;
  orientation: Orientation;
  index: number;
};

const initialPositions = [null, null, null, null, null, null, null, null, null];
const winConditions = {
  horizontal: [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
  ],
  vertical: [
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
  ],
  diagonal: [
    [0, 4, 8],
    [2, 4, 6],
  ],
};

function App() {
  const [positions, setPositions] = useState<Position[]>(initialPositions);

  const [initialPlayer, setInitialPlayer] = useState<Player>('x');
  const [currentPlayer, setCurrentPlayer] = useState<Player>('x');
  const [winner, setWinner] = useState<Winner>();
  const [score, setScore] = useState({
    x: 0,
    o: 0,
  });

  function handleClick({
    position,
    index,
  }: {
    position: Position;
    index: number;
  }) {
    if (position || winner) return;

    const newPositions = [...positions];
    newPositions[index] = currentPlayer;
    setPositions(newPositions);
    setCurrentPlayer((prev) => (prev === 'x' ? 'o' : 'x'));
  }

  function handleRestart() {
    setPositions(initialPositions);
    setWinner(undefined);

    const nextPlayer: Player = initialPlayer === 'x' ? 'o' : 'x';
    setCurrentPlayer(nextPlayer);
    setInitialPlayer(nextPlayer);
  }

  function checkIfHasWinner(player: Player): boolean {
    let hasWinner = false;

    const orientations: Array<Orientation> = [
      'horizontal',
      'vertical',
      'diagonal',
    ];

    function checkFromOrientation({
      condition,
      orientation,
      index,
    }: {
      condition: number[];
      orientation: Orientation;
      index: number;
    }) {
      if (
        positions[condition[0]] === player &&
        positions[condition[1]] === player &&
        positions[condition[2]] === player
      ) {
        setWinner({
          player,
          orientation,
          index,
        });

        hasWinner = true;
      }
    }

    orientations.forEach((orientation) => {
      winConditions[orientation].forEach((condition, index) => {
        checkFromOrientation({ condition, index, orientation });
      });
    });

    return hasWinner;
  }

  useEffect(() => {
    if (checkIfHasWinner('x')) {
      setScore((prev) => ({
        ...prev,
        x: prev.x + 1,
      }));
    }
    if (checkIfHasWinner('o')) {
      setScore((prev) => ({
        ...prev,
        o: prev.o + 1,
      }));
    }
  }, [positions]);

  return (
    <main>
      <div className='container'>
        <h1>Tic-tac-toe</h1>

        <section className='score'>
          <ul>
            <strong>Score</strong>
            <li>
              <strong>x :</strong>
              <span>{score.x}</span>
            </li>
            <li>
              <strong>o :</strong>
              <span>{score.o}</span>
            </li>
          </ul>
          <div>
            {winner && <span className='winner'>Winner</span>}
            <span className='turn'>
              Player {winner ? winner.player : currentPlayer}
            </span>
          </div>
        </section>

        <ul className='gameBox'>
          {winner && (
            <div
              className={`winLine ${winner.orientation}`}
              style={{
                ['--position' as any]: winner.index,
              }}
            ></div>
          )}
          {positions.map((position, index) => (
            <li
              key={index}
              className={!position && !winner ? 'isClickable' : ''}
              onClick={() => handleClick({ position, index })}
            >
              {position}
            </li>
          ))}
        </ul>
        <button type='button' onClick={handleRestart}>
          Restart
        </button>
      </div>
    </main>
  );
}

export default App;
