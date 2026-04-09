export default interface Message {
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