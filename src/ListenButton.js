import React, { useCallback } from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faVolumeHigh} from "@fortawesome/free-solid-svg-icons";

import {DEFINITIONS, playAudio} from "./util";

export function ListenButton(props) {
    const { word } = props;
    const data = DEFINITIONS[word.toLowerCase()];

    const onPlayWord = useCallback(() => {
        playAudio(word, data?.audio);
    }, [data?.audio, word]);

    const onPlayWordOther = useCallback(() => {
        playAudio(word);
    }, [word]);

    return (
        <div className="listen-area">
            <FontAwesomeIcon className="listen-icon" icon={faVolumeHigh} onClick={onPlayWord} />
            {data?.audio && <FontAwesomeIcon className="listen-icon listen-icon-other" icon={faVolumeHigh} onClick={onPlayWordOther} />}
        </div>
    )
}