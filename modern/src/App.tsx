import React from 'react';
import {GithubIcon} from './GithubIcon';
import {useNumberInLocalStorage} from './useLocalStorage';

export const App = () => {

    const [counterValue, setCounterValue] = useCounterValue()
    const [localDelta, setLocalDelta] = useLocalDelta()

    return (
        <>
            <div className="main-text" id="counter">?</div>
            <div className="sub-text" id="local-delta"></div>

            <div className="bubble-button" id="plus-button">+</div>
            <div className="bubble-button" id="minus-button">-</div>
            <div className="bubble-button" id="refresh-button">&#8635;</div>
            <div className="status-text">
                <div id="version"></div>
                <div id="network-status">online</div>
            </div>

            <GithubIcon url={'https://github.com/michal-bures/pwa'}/>
        </>
    )
}


export function useCounterValue() {
    return useNumberInLocalStorage('counter-value', 0)
}

export function useLocalDelta() {
    return useNumberInLocalStorage('local-delta', 0)
}
