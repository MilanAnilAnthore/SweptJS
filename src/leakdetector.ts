import type MessageType from './types'
const HEAP_GROWTH_THRESHOLD = 0.20; // 20%
const ALIVE_GROWTH_THRESHOLD = 10;

export function detectLeak(storageData: MessageType[]) {
    return analyzeHeapTrend(storageData)
}

function getAverage(value: Array<number>) {
    return value.reduce((accumulator, currentValue) => accumulator + currentValue, 0) / value.length
}

function analyzeHeapTrend(samples: MessageType[]) {
    const firstFive: Array<number> = samples.slice(0, 5).map((e) => e.heap.usedJSHeapSize);
    const firstAverage = getAverage(firstFive);

    const lastFive: Array<number> = samples.slice(-5).map((e) => e.heap.usedJSHeapSize);
    const lastAverage = getAverage(lastFive)

    const growth = (lastAverage - firstAverage) / firstAverage
    const isLeaking = growth >= HEAP_GROWTH_THRESHOLD;
    return { growthPercentage: growth, thresholdExceeded: isLeaking }
}

function analyzeDOMTrend(samples: MessageType[]) {
    const firstFive: Array<number> = samples.slice(0, 5).map((e) => e.lifecycle.alive);
    const firstAverage = getAverage(firstFive);

    const lastFive: Array<number> = samples.slice(-5).map((e) => e.lifecycle.alive);
    const lastAverage = getAverage(lastFive)
}