// This is the structure of data we get from modernMemory API
interface modernMemoryInfo {
    usedJSHeapSize: number;
}

/* This is the structure of data we get from legacyMemory API
    Since this extends modern structure it also includes usedJSHeapSize
 */
interface legacyMemoryInfo extends modernMemoryInfo {
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
}

// This is where data is being stored from api
const dataArr: (modernMemoryInfo | legacyMemoryInfo)[] = [];

// defining the type for parameter of pollDataEveryTwoSeconds();
type MemoryCollector = () => legacyMemoryInfo | modernMemoryInfo | undefined;

// This function takes a api as parameter and runs it every 2 seconds
const pollDataEveryTwoSeconds = (collector: MemoryCollector) => {

    setInterval(() => {
        const data = collector();
        if (data) {
            if (dataArr.length >= 100) {
                dataArr.shift();
            }
            dataArr.push(data)
        }
    }, 2000);
}

// This function runs the legacy api and return the data
function legacyCollect(): legacyMemoryInfo | undefined {

    if (!performance.memory) {
        console.log("Performance memory is not available in this browser")
        return undefined
    }
    let data = {
        usedJSHeapSize: performance.memory.usedJSHeapSize,
        totalJSHeapSize: performance.memory.totalJSHeapSize,
        jsHeapSizeLimit: performance.memory.jsHeapSizeLimit,
    }
    return data
}


if (!window.crossOriginIsolated) {

}


