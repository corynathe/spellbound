import React, { useState, useEffect } from "react";

export const SpellTest = () => {
    const [words, setWords] = useState([]);

    useEffect(() => {
        const storedWords = localStorage.getItem("spellTestWords");
        if (storedWords) {
            setWords(JSON.parse(storedWords));
        }
    }, []);

    const handleAddWord = (event) => {
        event.preventDefault();
        const newWord = event.target.elements.word.value;
        if (newWord) {
            const newWords = [...words, newWord];
            setWords(newWords);
            localStorage.setItem("spellTestWords", JSON.stringify(newWords));
            event.target.reset();
        }
    };

    return (
            <div>
                <h2>Spell Bound</h2>
                <form onSubmit={handleAddWord}>
                    <input type="text" name="word" placeholder="Enter a word" />
                    <button type="submit">Add Word</button>
                </form>
                <ul>
                    {words.map((word) => (
                            <li key={word}>{word}</li>
                    ))}
                </ul>
            </div>
    );
};