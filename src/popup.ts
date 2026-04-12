import type { AnalyzedMessage } from "./types";
import type { ChromeError } from "./types";

document.addEventListener('DOMContentLoaded', async function () {

    const analyzedData = await analysis();
    console.log(analyzedData)
});

const MAX_ATTEMPT = 20;
const INTERVAL = 4000;

async function analysis(): Promise<AnalyzedMessage | ChromeError> {
    for (let attempt = 0; attempt < MAX_ATTEMPT; attempt++) {
        let response = await chrome.runtime.sendMessage({ type: "GET_ANALYSIS" });

        if (response.statusCode === 404 || response.statusCode === 500) return response;
        if (response.statusCode !== 202) return response
        console.log(response.message);
        await new Promise((resolve) => setTimeout(resolve, INTERVAL));
    }
    return { statusCode: 404, message: "EXCEEDED MAXIMUM FETCH TIME, REFRESH AGAIN" };
}