declare global {
    interface Performance {
        memory?: {
            jsHeapSizeLimit: number;
            totalJSHeapSize: number;
            usedJSHeapSize: number;
        };
    }
}

interface modernMemoryInfo {
    usedJSHeapSize: number;
}

interface legacyMemoryInfo extends modernMemoryInfo {
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
}



const dataArr: (modernMemoryInfo | legacyMemoryInfo)[] = [];

if (!window.crossOriginIsolated) {

    function legacyCollect(): legacyMemoryInfo | undefined {

        if (!performance.memory) {
            return undefined
        }
        let data = {
            usedJSHeapSize: performance.memory.usedJSHeapSize,
            totalJSHeapSize: performance.memory.totalJSHeapSize,
            jsHeapSizeLimit: performance.memory.jsHeapSizeLimit,
        }
        return data
    }
    const result = legacyCollect();
    if (result) dataArr.push(result);
}

console.log(dataArr)

