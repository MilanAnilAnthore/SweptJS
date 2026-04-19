import type { MessageType } from './types'
import { detectLeak } from './leakdetector';
import { type ChromeError, ErrorType } from './types';
import type { AnalyzedMessage } from './types';

const storage = "dataSample";
chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "MEMORY_UPDATE") {
        console.log("Logging")
        // Just a type guard the content script always come from a tab
        if (!sender.tab?.id) return;
        const tabId = sender.tab.id;
        handleMemoryUpdate(message, tabId).catch((err) => {
            console.log("MEMORY UPDATE ERROR:", err)
        });
    } else if (message.type === "GET_ANALYSIS") {
        console.log("Getting analysis")
        const tabId = message.tabId
        handleAnalysis(tabId).then((result) => {
            sendResponse(result)
        }).catch((err) => {
            sendResponse({ statusCode: 500, message: "Internal error", err });
        })
        return true
    }
})


async function handleMemoryUpdate(message: MessageType, tabId: number) {
    try {
        const result: { [key: string]: MessageType[] } = await chrome.storage.local.get(`${storage}_${tabId}`);
        const currentSample: MessageType[] = result[`${storage}_${tabId}`] ?? [];
        currentSample.push(message);
        if (currentSample.length > 50) currentSample.shift();
        await chrome.storage.local.set({ [`${storage}_${tabId}`]: currentSample });
    } catch (err) {
        console.log("Storage Error", err)
    }
}

async function handleAnalysis(tabId: number): Promise<AnalyzedMessage | ChromeError> {
    const result: { [key: string]: MessageType[] } = await chrome.storage.local.get(`${storage}_${tabId}`);
    const storageData = result[`${storage}_${tabId}`]

    if (storageData) {
        if (storageData.length < 15) {
            return {
                statusCode: 202,
                message: "Collecting Data"
            }
        }
        return {
            ...detectLeak(storageData),
            samples: {
                arrayHeap: storageData.map(s => s.heap.usedJSHeapSize),
                arrayTime: storageData.map(s => s.heap.currentTime)
            }
        }
    }
    return {
        statusCode: 404,
        message: "No data found in the storage"
    }
}