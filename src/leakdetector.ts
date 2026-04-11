import type MessageType from './types'

export function detectLeak(storageData: MessageType[]) {
    console.log(analyzeHeapTrend(storageData))
}

function getAverage(value: Array<number>) {
    return value.reduce((accumulator, currentValue) => accumulator + currentValue, 0) / value.length
}

function analyzeHeapTrend(sample: MessageType[]) {
    const firstFive: Array<number> = sample.slice(0, 5).map((e) => e.heap.usedJSHeapSize);
    const firstAverage = getAverage(firstFive);

    const lastFive: Array<number> = sample.slice(-5).map((e) => e.heap.usedJSHeapSize);
    const lastAverage = getAverage(lastFive)

    return (lastAverage - firstAverage) / firstAverage
}