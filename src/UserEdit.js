import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, Link } from 'react-router-dom';

import {getDefaultName, getStorageUsers, saveUserName} from "./util";

export function UserEdit() {
    const { id } = useParams();
    const [name, setName] = useState();
    const [userInfo, setUserInfo] = useState();
    const [loading, setLoading] = useState(true);
    const initName = useMemo(() => userInfo?.name !== getDefaultName(id) ? userInfo?.name : '', [id, userInfo?.name]);

    useEffect(() => {
        setLoading(true);
        setUserInfo(getStorageUsers()[id]);
        setLoading(false);
    }, [id]);

    const onNameChange = useCallback((event) => {
        const value = event.target.value;
        setName(value);
    }, []);

    const onNameBlur = useCallback(() => {
        saveUserName(id, name);
    }, [id, name]);

    if (loading) {
        return <div>Loading...</div>
    }
    if (!userInfo) {
        // TODO add an error page
        return <div>No user found. Please go back to Home and select a user.</div>
    }

    return (
        <div>
            <h2>User Name</h2>
            <div>
                <input type="text" value={name ?? initName} onChange={onNameChange} onBlur={onNameBlur} placeholder="Enter your name" />
            </div>
            <Link to="/">{'< Home'}</Link>
            &nbsp;&nbsp;&nbsp;
            <Link to={`/wordlist/${id}`}>Create a New List</Link>
        </div>
    );
}