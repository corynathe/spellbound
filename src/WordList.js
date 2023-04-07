import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faTrashCan} from '@fortawesome/free-solid-svg-icons'

import {ListenButton} from './ListenButton';
import {
    DEFINITIONS,
    getStorageWordList,
    saveStorageWordList,
    splitWordListId,
    userListId,
    getDictionaryEntry,
    getStorageUsers
} from "./util";

export function WordList() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [name, setName] = useState();
    const [words, setWords] = useState();
    const { user, listId } = useMemo(() => splitWordListId(id), [id]);
    const userInfo = useMemo(() => getStorageUsers()[user], [user]);
    const id_ = userListId(user, listId);

    useEffect(() => {
        const list = getStorageWordList(id_, true);
        setName(list.name);
        setWords(list.words);
    }, [id_]);

    // TODO on unmount, set wordlist in localStorage, trim and remove blanks

    const updateWords = useCallback(async (index, word, remove, save) => {
        if (save) {
            await getDictionaryEntry(word);
        }

        setWords((current) => {
            const newWords = [...current];
            if (remove) {
                newWords.splice(index, 1);
            } else if (index !== undefined) {
                newWords[index] = word;
            }
            if (save) {
                saveStorageWordList(id_, name, newWords);
            }
            return newWords;
        });
    }, [id_, name]);

    const onNameChange = useCallback((event) => {
        const value = event.target.value;
        setName(value);
    }, []);

    const onWordChange = useCallback((event) => {
        const index = parseInt(event.target.name?.replace('word-', ''), 10);
        const value = event.target.value;
        updateWords(index, value, false, false);
    }, [updateWords]);

    const onWordBlur = useCallback((event) => {
        const index = parseInt(event.target.name?.replace('word-', ''), 10);
        const value = event.target.value?.trim();
        updateWords(index, value, false, true);
    }, [updateWords]);

    const onAddWord = useCallback((value) => {
        if (value.trim() !== '') {
            updateWords(words.length, value, false, true);
            document.getElementsByName('word')[0].value = '';
        }
    }, [updateWords, words]);

    const onNewWordBlur = useCallback((event) => {
        const value = event.target.value?.trim();
        onAddWord(value);
    }, [onAddWord]);

    const onRemoveWord = useCallback((index) => {
        updateWords(index, undefined, true, true);
    }, [updateWords]);

    const onKeyDown = useCallback((event) => {
        if (event.keyCode === 9 || event.keyCode === 13) {
            const value = document.getElementsByName('word')[0].value;
            if (value.trim().length > 0) {
                event.preventDefault();
                onAddWord(value);
            }
        }
    }, [onAddWord]);

    const onTakeTest = useCallback((event) => {
        if (event?.key === 'Tab' || event?.shiftKey) {
            return;
        }
        navigate(`/wordlist/${id_}/test`);
    }, [id_, navigate]);

    const onHome = useCallback((event) => {
        if (event?.key === 'Tab' || event?.shiftKey) {
            return;
        }
        navigate(`/`);
    }, [navigate]);

    if (!user) {
        // TODO add an error page
        return <div>No user selected. Please go back to Home and select a user.</div>
    }
    if (!words) {
        return <div>Loading...</div>
    }

    return (
        <div className="page">
            <h2>{userInfo?.name}'s List Name</h2>
            <div>
                <input type="text" autoFocus={name?.length === 0} value={name} onChange={onNameChange} placeholder="Give the list a name" />
            </div>
            <h2>Words</h2>
            <div>
                {words.map((word, i) => {
                    return (
                        <div key={i}>
                            <input type="text" name={`word-${i}`} autoComplete={'off'} value={word} onChange={onWordChange} onBlur={onWordBlur} placeholder="Add a word" />
                            {DEFINITIONS[word?.toLowerCase()] && <ListenButton word={words[i]} />}
                            <FontAwesomeIcon icon={faTrashCan} className="word-remove-icon" onClick={() => onRemoveWord(i)} />
                        </div>
                    )
                })}
                <div>
                    <input type="text" name="word" autoComplete={'off'} onBlur={onNewWordBlur} onKeyDown={onKeyDown} placeholder="Enter a word" />
                </div>
            </div>
            <br/>
            {words.length > 0 && <div className="button" onClick={onTakeTest} onKeyDown={onTakeTest} tabIndex={0}>Take Test</div>}
            <div className="button secondary" onClick={onHome} onKeyDown={onHome} tabIndex={0}>Home</div>
        </div>
    );
}
