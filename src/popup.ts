import type { AnalyzedMessage } from "./types";
import type { ChromeError } from "./types";

document.addEventListener('DOMContentLoaded', async function () {

    const analyzedData = await analysis();

    if ('statusCode' in analyzedData) {
        console.log("This is an error", analyzedData.message)
    } else {
        console.log("Initial poll finished")
        async function continuousPoll() {
            let response = await pollingAnalysis();
            console.log("This is continuous poll", response)
            setTimeout(continuousPoll, 4000)
        }
        continuousPoll();
    }
});

const MAX_ATTEMPT = 20;
const INTERVAL = 4000;

async function analysis(): Promise<AnalyzedMessage | ChromeError> {
    for (let attempt = 0; attempt < MAX_ATTEMPT; attempt++) {
        let response = await pollingAnalysis()

        if ('statusCode' in response) {
            if (response.statusCode === 404 || response.statusCode === 500) return response;
            if (response.statusCode === 202) console.log(response.message);
        } else {
            return response;
        }
        await new Promise((resolve) => setTimeout(resolve, INTERVAL));
    }
    return { statusCode: 404, message: "EXCEEDED MAXIMUM FETCH TIME, REFRESH AGAIN" };
}

async function pollingAnalysis(): Promise<AnalyzedMessage | ChromeError> {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) return { statusCode: 404, message: "Tab ID error" }

    let response = await chrome.runtime.sendMessage({ type: "GET_ANALYSIS", tabId: tab.id });

    return response;
}