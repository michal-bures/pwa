import {useEffect, useState} from 'react';

export function useServiceWorkerVersion() {

    const [version, setVersion] = useState('?')

    useEffect(() => {
        if (!navigator?.serviceWorker) return
        // display current service worker version
        navigator.serviceWorker.addEventListener('message', event => {
            if (event.data.serviceWorkerVersion) {
                setVersion(event.data.serviceWorkerVersion)
            }
        });
        navigator.serviceWorker.ready.then(registration => {
            console.log('SENDING VERSION REQUEST')
            registration.active!.postMessage('version')
        })
    }, [])

    return version
}
