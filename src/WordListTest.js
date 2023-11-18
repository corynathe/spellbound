import React, { useState, useEffect, useCallback, useMemo } from "react";
import {useNavigate, useParams} from 'react-router-dom';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheckCircle, faCircleXmark} from "@fortawesome/free-solid-svg-icons";

import {Header} from "./Header";
import {ListenButton} from './ListenButton';
import {
    DEFINITIONS,
    getStorageWordList,
    splitWordListId,
    userListId,
    getStorageUsers, playAudio,
} from "./util";

export function WordListTest() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [listInfo, setListInfo] = useState();
    const [answers, setAnswers] = useState([]);
    const [results, setResults] = useState([]);
    const { user, listId } = useMemo(() => splitWordListId(id), [id]);
    const userInfo = useMemo(() => getStorageUsers()[user], [user]);
    const id_ = userListId(user, listId);

    useEffect(() => {
        const list = getStorageWordList(id_, true);
        setListInfo(list);
    }, [id_]);

    const onWordChange = useCallback((event, index) => {
        setAnswers((current) => {
            const newAnswers = [...current];
            newAnswers[index] = event.target.value;
            return newAnswers;
        });
    }, []);

    const onWordFocus = useCallback((event, index) => {
        const word = listInfo?.words[index];
        if (word) {
            const data = DEFINITIONS[word.toLowerCase()];
            playAudio(word, data?.audio);
        }
    }, [listInfo?.words]);

    const checkAnswers = useCallback(() => {
        if (!listInfo.words) return;

        setResults(listInfo.words.map((word, i) => {
            return word.toLowerCase() === answers?.[i]?.toLowerCase();
        }));
    }, [answers, listInfo?.words]);

    const onButtonKeyDown = useCallback((event) => {
        if (event?.key === 'Tab' || event?.shiftKey) {
            return;
        }
        if (event.keyCode === 13) {
            event.preventDefault();
            checkAnswers();
        }
    }, [checkAnswers]);

    const onDone = useCallback((event) => {
        if (event?.key === 'Tab' || event?.shiftKey) {
            return;
        }
        navigate(`/spellbound/wordlist/${id_}`);
    }, [id_, navigate]);

    if (!user) {
        // TODO add an error page
        return <div>No list selected. Please go back to Home and select a list.</div>
    }
    if (!listInfo) {
        return <div>Loading...</div>
    }

    return (
        <div className="page">
            <Header title={userInfo?.name}/>
            <h2>{listInfo.name + ' Words'}</h2>
            <div>
                {listInfo.words.map((word, i) => {
                    return (
                        <div key={i}>
                            <input
                                type="text"
                                name={`word-${i}`}
                                value={answers?.[i] ?? ''}
                                onFocus={(event) => onWordFocus(event, i)}
                                onChange={(event) => onWordChange(event, i)}
                                placeholder="Enter word"
                                autoFocus={i === 0}
                                spellCheck={false}
                                autoComplete={'off'}
                            />
                            {DEFINITIONS[word?.toLowerCase()] && <ListenButton word={listInfo.words[i]} />}
                            {results[i] === true && <FontAwesomeIcon className="answer-correct" icon={faCheckCircle} />}
                            {results[i] === false && <FontAwesomeIcon className="answer-wrong" icon={faCircleXmark} />}
                        </div>
                    )
                })}
            </div>
            <div className="button" onClick={checkAnswers} onKeyDown={onButtonKeyDown} tabIndex={0}>Check It!</div>
            <div className="button secondary" onClick={onDone} onKeyDown={onDone} tabIndex={0}>Done</div>
        </div>
    );
}
