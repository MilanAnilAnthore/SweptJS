document.addEventListener('DOMContentLoaded', function () {
    chrome.runtime.sendMessage(({
        type: "GET_ANALYSIS"
    }))
});
