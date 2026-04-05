let detached = 0;
let collected = 0;
let alive = 0;

const registry = new FinalizationRegistry((heldValue) => {
    console.log(`GC COLLECTED: ${heldValue}`);
    collected++
    alive--
});

const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
        mutation.removedNodes.forEach((node) => {
            if (node instanceof Element) {
                const detail = `${node.tagName}${node.id ? '#' + node.id : ''}`;
                registry.register(node, detail);
                detached++
                alive++
                console.log(`${detail} is being tracked, TotalDetached = ${detached}`);
            }
        })
    }
});
const config = { childList: true, subtree: true };
observer.observe(document.body, config)