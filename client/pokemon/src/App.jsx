import React, { useState, useEffect } from "react";
import "./styles/App.css";

const types1 = [
  "",

  "Normal",
  "Fire",
  "Water",
  "Grass",
  "Electric",
  "Ice",
  "Fighting",
  "Poison",
  "Ground",
  "Flying",
  "Psychic",
  "Bug",
  "Rock",
  "Ghost",
  "Dark",
  "Dragon",
  "Steel",
  "Fairy",
];
const types2 = ["None", ...types1];
export default function App() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [guesses, setGuesses] = useState([
    {
      name: "",
      type1: "",
      type2: "",
      generation: "",
      correct: { name: false, type1: false, type2: false, generation: false },
    },
  ]);
  const [gameWon, setGameWon] = useState(false);

  useEffect(() => {
    if (!data) {
      fetch("http://localhost:1212/data")
        .then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
          }
          return res.json();
        })
        .then((data) => {
          setData(data);
          console.log(data);
        })
        .catch((error) => {
          setError(error.message);
        });
    }
  }, [data]);

  const updateGuess = (index, field, value) => {
    setGuesses((prevGuesses) => {
      const newGuesses = [...prevGuesses];
      newGuesses[index] = { ...newGuesses[index], [field]: value };
      return newGuesses;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setGuesses((prevGuesses) => {
      const currentIndex = prevGuesses.length - 1;
      const currentGuess = prevGuesses[currentIndex];

      const correctName =
        currentGuess.name.trim().toLowerCase() ===
        data.pokemon_name.trim().toLowerCase();
      const correctType1 =
        currentGuess.type1.trim().toLowerCase() ===
        data.type1.trim().toLowerCase();
      const correctType2 =
        currentGuess.type2.trim().toLowerCase() ===
        data.type2.trim().toLowerCase();
      const correctGeneration =
        currentGuess.generation === String(data.generation);

      const newCorrect = {
        name: correctName,
        type1: correctType1,
        type2: correctType2,
        generation: correctGeneration,
      };

      const updatedGuesses = prevGuesses.map((row, idx) =>
        idx === currentIndex ? { ...row, correct: newCorrect } : row
      );

      if (correctName && correctType1 && correctType2 && correctGeneration) {
        setGameWon(true);
        return updatedGuesses;
      } else {
        return [
          ...updatedGuesses,
          {
            name: correctName ? currentGuess.name : "",
            type1: correctType1 ? currentGuess.type1 : "",
            type2: correctType2 ? currentGuess.type2 : "",

            generation: correctGeneration ? currentGuess.generation : "",
            correct: {
              name: correctName,
              type1: correctType1,
              type2: correctType2,
              generation: correctGeneration,
            },
          },
        ];
      }
    });
  };

  const handleReset = () => {
    setData(null);
    setGuesses([
      {
        name: "",
        type1: "",
        type2: "",
        generation: "",
        correct: { name: false, type1: false, type2: false, generation: false },
      },
    ]);
    setGameWon(false);
  };

  if (error) return <div>Error: {error}</div>;

  return (
    <div className="app-container">
      <div className="game-container">
        {data && <h1>Guess the Pokémon</h1>}
        {data && (
          <form onSubmit={handleSubmit}>
            {guesses.map((guess, index) => (
              <div className="input-row" key={index}>
                <input
                  type="text"
                  placeholder="Name"
                  required="true"
                  value={guess.name}
                  onChange={(e) => updateGuess(index, "name", e.target.value)}
                  className={guess.correct.name ? "correct" : ""}
                />

                <select
                  required="true"
                  value={guess.type1}
                  onChange={(e) => updateGuess(index, "type1", e.target.value)}
                  className={guess.correct.type1 ? "correct" : ""}
                >
                  {types1.map((t) => (
                    <option key={t} value={t}>
                      {t === "" ? "Select Type 1" : t}
                    </option>
                  ))}
                </select>

                <select
                  required="true"
                  value={guess.type2}
                  onChange={(e) => updateGuess(index, "type2", e.target.value)}
                  className={guess.correct.type2 ? "correct" : ""}
                >
                  {types2.map((t) => (
                    <option key={t} value={t}>
                      {t === "" ? "Select Type 2" : t}
                    </option>
                  ))}
                </select>

                <input
                  required="true"
                  type="number"
                  placeholder="Generation"
                  value={guess.generation}
                  onChange={(e) =>
                    updateGuess(index, "generation", e.target.value)
                  }
                  className={guess.correct.generation ? "correct" : ""}
                />
              </div>
            ))}
            <button type="submit">Submit Guess</button>
          </form>
        )}
        {gameWon && <p className="success-message">Correct! Well done!</p>}
        <button onClick={handleReset}>Start New Game</button>
      </div>
    </div>
  );
}
