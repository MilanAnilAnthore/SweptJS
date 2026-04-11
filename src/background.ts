import type messageType from './types'
import { detectLeak } from './leakdetector';

const storage = "dataSample";

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "MEMORY_UPDATE") {
        console.log("Logging")
        handleMemoryUpdate(message).catch((err) => {
            console.log("MEMORY UPDATE ERROR:", err)
        });
        return true;
    } else if (message.type === "GET_ANALYSIS") {
        console.log("Getting analysis")
        handleAnalysis().then((result) => {
            sendResponse(result)
        }).catch((err) => {
            sendResponse({ statusCode: 500, message: "Internal error", err });
        })
        return true
    }
})



async function handleMemoryUpdate(message: messageType) {
    try {
        const result: { [key: string]: messageType[] } = await chrome.storage.local.get(storage);
        const currentSample: messageType[] = result[storage] ?? [];
        currentSample.push(message);
        if (currentSample.length > 50) currentSample.shift();
        await chrome.storage.local.set({ [storage]: currentSample });
    } catch (err) {
        console.log("Storage Error", err)
    }
}

async function handleAnalysis() {
    const result: { [key: string]: messageType[] } = await chrome.storage.local.get(storage);
    const storageData = result[storage]

    if (storageData) {
        if (storageData.length < 15) {
            return {
                statusCode: 202,
                message: "Collecting Data"
            }
        }
        return detectLeak(storageData)
    }
    return {
        statusCode: 404,
        message: "No data found in the storage"
    }
}