import {useEffect, useState} from 'react';
import {useNumberInLocalStorage} from '../useLocalStorage';
import {useCounterAPI} from '../api/useCounterAPI';
import {useNetworkState} from './useConnectionState';

export function useCounterService() {
    const [inFlightDelta, setInFlightDelta] = useState(0)
    const [syncingSuspended, setSyncingSuspended] = useState(false)
    const counterAPI = useCounterAPI()
    const isOnline = useNetworkState()
    const [counterValue, setCounterValue] = useNumberInLocalStorage('counter-value', 0)
    const [localDelta, setLocalDelta] = useNumberInLocalStorage('stored-delta', 0)

    const adjustCount = (delta = 0) => {
        setSyncingSuspended(false)
        setLocalDelta(localDelta + delta)
        setCounterValue(counterValue + delta)
    }

    const syncDeltaToServer = async (deltaToApply: number) => {
        if (!deltaToApply) return // special case: nothing to apply
        try {
            console.log('Sending request to adjust counter by', deltaToApply)
            setInFlightDelta(deltaToApply)
            const valueFromServer = await counterAPI.updateCounter(deltaToApply)
            console.log('Counter adjustment by ', deltaToApply, 'confirmed by server, server value now', valueFromServer)
            const newLocalDelta = localDelta - deltaToApply
            setSyncingSuspended(false)
            setLocalDelta(newLocalDelta)
            setCounterValue(valueFromServer + newLocalDelta)
        } catch (err) {
            setSyncingSuspended(true)
            console.log('Failed to update count on server')
        } finally {
            setInFlightDelta(0)
        }
    }

    useEffect(() => {
        console.log('DELTA local', localDelta, 'in flight', inFlightDelta)
        if (!inFlightDelta && !syncingSuspended) syncDeltaToServer(localDelta)
    }, [localDelta, inFlightDelta])

    useEffect(() => {
        console.log('connection state:', isOnline)
        if (isOnline && !inFlightDelta) {
            setSyncingSuspended(false)
            syncDeltaToServer(localDelta)
        }
    }, [isOnline])

    const refreshCountFromServer = async () => {
        const val = await counterAPI.fetchCounterValue()
        setCounterValue(val)
    }


    return {
        localDelta,
        counterValue,
        adjustCount,
        refreshCountFromServer
    }
}
