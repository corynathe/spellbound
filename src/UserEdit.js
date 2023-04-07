import React, { useState, useEffect, useCallback, useMemo } from "react";
import {useParams, Link, useNavigate} from 'react-router-dom';

import {getDefaultName, getStorageUsers, saveUserName} from "./util";

export function UserEdit() {
    const { id } = useParams();
    const navigate = useNavigate();
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

    const onCreateList = useCallback((event) => {
        if (event?.key === 'Tab' || event?.shiftKey) {
            return;
        }
        navigate(`/wordlist/${id}`);
    }, [id, navigate]);

    const onHome = useCallback((event) => {
        if (event?.key === 'Tab' || event?.shiftKey) {
            return;
        }
        navigate('/');
    }, [navigate]);

    if (loading) {
        return <div>Loading...</div>
    }
    if (!userInfo) {
        // TODO add an error page
        return <div>No user found. Please go back to Home and select a user.</div>
    }

    return (
        <div className="page">
            <h2>User Name</h2>
            <div>
                <input type="text" autoFocus value={name ?? initName} onChange={onNameChange} onBlur={onNameBlur} placeholder="Enter your name" />
            </div>
            <div className="button" onClick={onCreateList} onKeyDown={onCreateList} tabIndex={0}>Create a New List</div>
            <div className="button secondary" onClick={onHome} onKeyDown={onHome} tabIndex={0}>Home</div>
        </div>
    );
}