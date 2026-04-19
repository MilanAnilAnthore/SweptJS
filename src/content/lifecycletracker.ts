let detached = 0;
let collected = 0;
let alive = 0;

// When GC runs the finalization registry tracks the collection of held value
const registry = new FinalizationRegistry((heldValue) => {
    // console.log(`GC COLLECTED: ${heldValue}`);
    collected++
    alive--
});

// function to loop through deleted nodes and track using finalization registry
const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
        mutation.removedNodes.forEach((node) => {
            if (node instanceof Element) {
                const detail = `${node.tagName}${node.id ? '#' + node.id : ''}`;
                registry.register(node, detail);
                detached++
                alive++
                // console.log(`${detail} is being tracked, TotalDetached = ${detached}`);
            }
        })
    }
});
const config = { childList: true, subtree: true };

export function getStats() {
    return { detached, collected, alive }
}
export function startTracking() {
    observer.observe(document.body, config)
}