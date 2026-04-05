export { };
declare global {
    interface memoryStr {
        bytes: number;
    }
    interface Performance {
        memory?: {
            jsHeapSizeLimit: number;
            totalJSHeapSize: number;
            usedJSHeapSize: number;
        };
        measureUserAgentSpecificMemory?(): Promise<memoryStr>
    }
}