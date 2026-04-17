// This is the structure of data we get from modernMemory API
interface modernMemoryInfo {
    usedJSHeapSize: number;
    currentTime: string;
}

/* This is the structure of data we get from legacyMemory API
    Since this extends modern structure it also includes usedJSHeapSize
 */
interface legacyMemoryInfo extends modernMemoryInfo {
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
}

// This is where data is being stored from api
export const dataArr: (modernMemoryInfo | legacyMemoryInfo)[] = [];

// defining the type for parameter of pollDataEveryTwoSeconds();
type MemoryCollector = () => legacyMemoryInfo | undefined | Promise<modernMemoryInfo | undefined>;

// This function takes a api as parameter and runs it every 2 seconds
const pollDataEveryTwoSeconds = (collector: MemoryCollector) => {

    const poll = async () => {
        const data = await collector();
        if (data) {
            dataArr.push(data);
            if (dataArr.length > 50) {
                dataArr.shift();
            }
        }
        // Wait 2 seconds before firing the next poll
        setTimeout(poll, 2000);
    };
    poll();
}

function bytesToMB(bytes: number): number {
    return bytes / (1024 ** 2);
}

function getCurrentTime(): string {
    const timeMarker = new Date().toLocaleTimeString([], {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    return timeMarker
}


// This function runs the legacy api and return the data
function legacyCollect(): legacyMemoryInfo | undefined {

    if (!performance.memory) {
        console.log("Performance memory is not available in this browser")
        return undefined
    }
    return {
        usedJSHeapSize: bytesToMB(performance.memory.usedJSHeapSize),
        totalJSHeapSize: bytesToMB(performance.memory.totalJSHeapSize),
        jsHeapSizeLimit: bytesToMB(performance.memory.jsHeapSizeLimit),
        currentTime: getCurrentTime()
    }
}
// This function runs the modern api and return the data
async function modernCollect(): Promise<modernMemoryInfo | undefined> {
    if (!performance.measureUserAgentSpecificMemory) {
        console.log("measureUserAgentSpecificMemory is not available in this browser")
        return undefined
    }
    let data = await performance.measureUserAgentSpecificMemory();

    return {
        usedJSHeapSize: bytesToMB(data.bytes),
        currentTime: getCurrentTime()
    };
}

/*
    Check if the crossOriginIsolated is false and runs legacyCollect
    If true runs modernCollect
*/
export function startMonitoring() {
    if (!window.crossOriginIsolated) {
        pollDataEveryTwoSeconds(legacyCollect);
    } else {
        pollDataEveryTwoSeconds(modernCollect)
    }
}