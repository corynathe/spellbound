import React, { useCallback } from "react";
import {useNavigate} from 'react-router-dom';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faHouseChimney} from '@fortawesome/free-solid-svg-icons'

export function Header(props) {
    const navigate = useNavigate();

    const onHome = useCallback(() => {
        navigate('/spellbound');
    }, [navigate]);

    return (
        <div className="header">
            <div className="title">{props.title}</div>
            <div className="right">
                <FontAwesomeIcon icon={faHouseChimney} size="2x" onClick={onHome} />
            </div>
        </div>
    );
}