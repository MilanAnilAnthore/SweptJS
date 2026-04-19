import type { MessageType } from './types'
const HEAP_GROWTH_THRESHOLD = 0.20; // 20%
const ALIVE_GROWTH_THRESHOLD = 10;

export function detectLeak(storageData: MessageType[]) {
    return {
        analyzedHeap: analyzeHeapTrend(storageData),
        analyzedDom: analyzeDOMTrend(storageData)
    }
}

function getAverage(value: Array<number>) {
    return value.reduce((accumulator, currentValue) => accumulator + currentValue, 0) / value.length
}

function analyzeHeapTrend(samples: MessageType[]) {
    // Take the first five heap from the array and calculate the average
    const firstFive: Array<number> = samples.slice(0, 5).map((e) => e.heap.usedJSHeapSize);
    const firstAverage = getAverage(firstFive);

    // Take the last five heap from the array and calculate the average
    const lastFive: Array<number> = samples.slice(-5).map((e) => e.heap.usedJSHeapSize);
    const lastAverage = getAverage(lastFive)

    const growth = (lastAverage - firstAverage) / firstAverage
    const isLeaking = growth >= HEAP_GROWTH_THRESHOLD;
    return { growthPercentage: growth, heapthresholdExceeded: isLeaking }
}

// Calculate prevAliveAvg dynamically from the previous window to avoid relying on state across restarts.
// We use the 5 elements before the current last 5 elements to measure the trend reliably.
function analyzeDOMTrend(samples: MessageType[]) {
    const firstFive: Array<number> = samples.slice(0, 5).map((e) => e.lifecycle.alive);
    const oldestAliveAvg = getAverage(firstFive);

    const lastFive: Array<number> = samples.slice(-5).map((e) => e.lifecycle.alive);
    const currentAliveAvg = getAverage(lastFive)

    // Dynamically calculate the previous window's average 
    const prevSamples: Array<number> = samples.slice(-10, -5).map((e) => e.lifecycle.alive);
    const prevAliveAvg = prevSamples.length > 0 ? getAverage(prevSamples) : 0;

    const latestAlive: number = samples[samples.length - 1]?.lifecycle.alive ?? 0;

    // first Check to check if current alive avg is rising
    if (currentAliveAvg > oldestAliveAvg) {
        // second check to see if latest alive nodes are greater than threshHold value
        if (latestAlive >= ALIVE_GROWTH_THRESHOLD) {
            // final check to see if the value is still rising using relative 5% growth
            // also a absolute 0 check to avoid edge cases where prevAliveAvg would be 0
            if (currentAliveAvg > prevAliveAvg * 1.05 && currentAliveAvg - prevAliveAvg > 1) {
                return { currentAlive: latestAlive, domthresholdExceeded: true }
            }
        }
    }

    return { currentAlive: latestAlive, domthresholdExceeded: false }
}