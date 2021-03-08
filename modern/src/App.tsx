import React, {useEffect} from 'react';
import {GithubIcon} from './GithubIcon';
import {useServiceWorkerVersion} from './hooks/useServiceWorkerVersion';
import {useNetworkStatus} from './hooks/useNetworkStatus';
import {useCounterService} from './hooks/useCounterService';


export const App = () => {

    const {
        localDelta,
        counterValue,
        adjustCount,
        refreshCountFromServer
    } = useCounterService()
    const swVersion = useServiceWorkerVersion()
    const networkStatus = useNetworkStatus()

    return (
        <>
            <div id="counter">{counterValue}</div>
            <div id="local-delta">{formatDelta(localDelta)}</div>

            <div className="bubble-button" id="plus-button" onClick={() => adjustCount(+1)}>+</div>
            <div className="bubble-button" id="minus-button" onClick={() => adjustCount(-1)}>-</div>
            <div className="bubble-button" id="refresh-button" onClick={refreshCountFromServer}>&#8635;</div>
            <div className="status-text">
                <div id="version">{swVersion}</div>
                <div id="network-status">{networkStatus}</div>
            </div>

            <GithubIcon url={'https://github.com/michal-bures/pwa'}/>
        </>
    )
}

function formatDelta(delta: number) {
    if (delta > 0) {
        return `(+${delta})`
    } else if (delta < 0) {
        return `(${delta})`
    } else {
        return ''
    }
}
