import React, {useCallback, useEffect, useMemo, useState} from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faTrashCan, faSpinner, faPencil} from '@fortawesome/free-solid-svg-icons'

import {getStorageUsers, getStorageWordList, userListId, removeStorageWordList, addUser, removeUser} from "./util";
import logo from "./Canva Design.png";

export function Home() {
    const [users, setUsers] = useState();
    const userNames = useMemo(() => Object.keys(users || {}), [users]);
    const navigate = useNavigate();

    useEffect(() => {
        setUsers(getStorageUsers());
    }, []);

    const removeList = useCallback((user, list) => {
        // TODO add a confirmation of delete
        removeStorageWordList(user, list);
        setUsers(getStorageUsers());
    }, []);

    const _addUser = useCallback(() => {
        const newUserId = addUser();
        setUsers(getStorageUsers());

        setTimeout(() => {
            navigate('/user/' + newUserId);
        }, 100);
    }, [navigate]);

    const _removeUser = useCallback((userId) => {
        removeUser(userId);
        setUsers(getStorageUsers());
    }, []);

    if (!users) {
        return <FontAwesomeIcon icon={faSpinner} spinPulse size={"2x"} />;
    }

    return (
        <div className="page">
            <img src={logo} />
            {userNames.map(user => {
                const userInfo = users[user];
                return (
                    <div key={user} className="user-chip">
                        <div className="user-chip-name">{userInfo?.name ?? '#' + user}</div>
                        <FontAwesomeIcon icon={faTrashCan} className="user-chip-remove" onClick={() => _removeUser(user)} />
                        <Link to={`/user/${user}`}>
                            <FontAwesomeIcon icon={faPencil} className="user-chip-edit" />
                        </Link>
                        <br/>
                        {userInfo?.lists?.map(list => {
                            const wordList = getStorageWordList(userListId(user, list), false);
                            if (!wordList) return null;

                            return (
                                <div key={list}>
                                    <Link to={`/wordlist/${user}|${list}`}>{wordList.name}</Link>
                                    <FontAwesomeIcon icon={faTrashCan} className="user-list-remove" onClick={() => removeList(user, list)} />
                                </div>
                            )
                        })}
                        <Link to={`/wordlist/${user}`}>Create a New List</Link>
                    </div>
                )
            })}
            <div className="button" style={{width: '125px'}} onClick={_addUser}>Add a Speller!</div>
            {/*<FontAwesomeIcon icon={faBasketball} size="3x" style={{padding: 5}} />*/}
        </div>
    );
}