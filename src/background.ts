interface Message {
    type: string,
    heap: {
        usedJSHeapSize: number;
        totalJSHeapSize?: number;
        jsHeapSizeLimit?: number;
    },
    lifecycle: {
        detached: number,
        collected: number,
        alive: number
    }
}

const storage = "dataSample";

chrome.runtime.onMessage.addListener(async (message: Message) => {
    try {
        const result: { [key: string]: Message[] } = await chrome.storage.local.get(storage);
        const currentSample: Message[] = result[storage] ?? [];
        currentSample.push(message);
        if (currentSample.length > 50) currentSample.shift();
        await chrome.storage.local.set({ [storage]: currentSample });
    } catch (err) {
        console.log("Storage Error", err)
    }

})