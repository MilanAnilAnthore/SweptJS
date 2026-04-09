import type messageType from './types'

const storage = "dataSample";

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type == "MEMORY_UPDATE") {
        handleMemoryUpdate(message);
        console.log("Logging")
    } else if (message.type == "GET_ANALYSIS") {
        console.log("Enna myr")
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