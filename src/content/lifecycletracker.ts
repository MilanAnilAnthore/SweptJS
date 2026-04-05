
const config = { childList: true, subtree: true };

const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
        mutation.removedNodes.forEach((node) => {
            if (node.nodeType == 1) {
                if (node instanceof Element) {
                    console.log(node.tagName + node.id)
                }
            }
        })
    }
});

observer.observe(document.body, config)