// This is the type of message we get from the content script.
export interface MessageType {
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

// This is the type of message we get returned from leakdetector
export interface analyzedMessage {
    analyzedHeap: {
        growthPercentage: number,
        heapthresholdExceeded: boolean
    },
    analyzedDom: {
        currentAlive: number,
        domthresholdExceeded: boolean
    }
}

// This is for chrome errors
export interface chromeError {
    statusCode: number,
    message: string
}


