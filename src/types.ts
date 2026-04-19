// This is the type of message we get from the content script.
export interface MessageType {
    type: string,
    heap: {
        usedJSHeapSize: number;
        totalJSHeapSize?: number;
        jsHeapSizeLimit?: number;
        currentTime: string
    },
    lifecycle: {
        detached: number,
        collected: number,
        alive: number
    }
}

// This is the type of message we get returned from leakdetector
export interface AnalyzedMessage {
    analyzedHeap: {
        growthPercentage: number,
        heapthresholdExceeded: boolean
    },
    analyzedDom: {
        currentAlive: number,
        domthresholdExceeded: boolean
    },
    samples: {
        arrayHeap: number[],
        arrayTime: string[]
    }
}

export enum ErrorType {
    STORAGE = "STORAGE",
    MESSAGING = "MESSAGING",
    CONTENT_SCRIPT = "CONTENT_SCRIPT",
    ANALYSIS = "ANALYSIS",
    INSUFFICIENT_DATA = "INSUFFICIENT_DATA",
    TAB_ID = "TAB_ID",
    TIMEOUT = "TIMEOUT",
    UNKNOWN = "UNKNOWN"
}

export interface ChromeError {
    statusCode: number,
    message: string,
    errorType?: ErrorType
}


