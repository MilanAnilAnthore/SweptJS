import { dataArr, startMonitoring } from "./heapmonitor"
import { getStats, startTracking } from "./lifecycletracker"

// starts heapMonitoring
startMonitoring();
// starts tracking of nodes
startTracking();

let lastSentHeap: typeof dataArr[0] | null = null;

setInterval(() => {
    const latestHeap = dataArr[dataArr.length - 1];
    if (!latestHeap) return;
    if (latestHeap === lastSentHeap) return;

    const lifeCycleStats = getStats();

    try {
        chrome.runtime.sendMessage({
            type: "MEMORY_UPDATE",
            heap: latestHeap,
            lifecycle: lifeCycleStats
        }, () => {
            if (chrome.runtime.lastError) {
                // console.log("runtime error:", chrome.runtime.lastError)
            }
        });
    } catch (e) {
        // Silenced: expected when side panel is closed and no listener is registered
    }


    lastSentHeap = latestHeap;

}, 2000)