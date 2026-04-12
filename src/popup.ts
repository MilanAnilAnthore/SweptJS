document.addEventListener('DOMContentLoaded', async function () {

    const analyzedData = await analysis();
    console.log(analyzedData)
});

const MAX_ATTEMPT = 20;
const INTERVAL = 4000;

async function analysis(): Promise<unknown> {
    for (let attempt = 0; attempt < MAX_ATTEMPT; attempt++) {
        const response = await chrome.runtime.sendMessage({ type: "GET_ANALYSIS" });

        if (response.statusCode === 404 || response.statusCode === 500) return response.message;
        if (response.statusCode !== 202) return response.message;

        console.log(response.message);
        await new Promise((resolve) => setTimeout(resolve, INTERVAL));
    }
    return "EXCEEDED MAXIMUM FETCH TIME, REFRESH AGAIN";
}