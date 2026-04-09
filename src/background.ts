import type messageType from './types'

const storage = "dataSample";

chrome.runtime.onMessage.addListener(async (message: messageType) => {
    try {
        const result: { [key: string]: messageType[] } = await chrome.storage.local.get(storage);
        const currentSample: messageType[] = result[storage] ?? [];
        currentSample.push(message);
        if (currentSample.length > 50) currentSample.shift();
        await chrome.storage.local.set({ [storage]: currentSample });
    } catch (err) {
        console.log("Storage Error", err)
    }

})

async function handleMemoryUpdate() {

}