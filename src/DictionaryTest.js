import React, { useState, useCallback } from 'react';
import {getDictionaryEntry, playAudio} from "./util";

export function DictionaryTest() {
    const [word, setWord] = useState('');
    const [definition, setDefinition] = useState();
    const [audio, setAudio] = useState();

    async function handleSearch() {
        setDefinition(undefined);
        setAudio(undefined);

        const data = await getDictionaryEntry(word);
        console.log(data);

        if (data.definition) {
            setDefinition(data.definition);
        }
        if (data.audio) {
            setAudio(data.audio);
        }
    }

    const onPlay = useCallback(() => {
        playAudio(word, audio);
    }, [word, audio]);

    return (
            <div>
                <h1>Dictionary</h1>
                <input type="text" value={word} onChange={(e) => setWord(e.target.value)} />
                <button onClick={handleSearch}>Search</button>
                {definition && <p>Example: {definition.example}</p>}
                {definition && <p>Definition: {definition.definition}</p>}
                {word && <div><button onClick={onPlay}>Play</button></div>}
            </div>
    );
}
