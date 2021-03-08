export function useCounterAPI() {
    return {fetchCounterValue, updateCounter}
}

async function updateCounter(delta: number): Promise<number> {
    const res = await fetch(`https://api.countapi.xyz/update/pwa-demo/counter?amount=${delta}`)
    const body = await res.json()
    return Number(body.value)
}

async function fetchCounterValue(): Promise<number> {
    const res = await fetch('https://api.countapi.xyz/get/pwa-demo/counter')
    const body = await res.json()
    return Number(body.value)
}
