<script lang="ts">
  import { onMount } from "svelte";
  import type { AnalyzedMessage, ChromeError } from "../types";

  const MAX_ATTEMPT = 20;
  const INTERVAL = 4000;

  let heapSamples = $state<number[]>([]);
  let timeSamples = $state<string[]>([]);

  onMount(() => {
    finalAnalysisResult();
  });

  function updateSamples(data: AnalyzedMessage | ChromeError) {
    if ("samples" in data) {
      heapSamples = data.samples.arrayHeap;
      timeSamples = data.samples.arrayTime;
    }
  }

  async function finalAnalysisResult() {
    const analyzedData = await initialAnalysisPoll();

    if ("statusCode" in analyzedData) {
      console.log("This is an error", analyzedData.message);
    } else {
      console.log("Initial poll finished");
      console.log(analyzedData);
      updateSamples(analyzedData);
    }
    continuousPoll();
  }

  async function getAnalysis(): Promise<AnalyzedMessage | ChromeError> {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) return { statusCode: 404, message: "Tab ID error" };

    let response = await chrome.runtime.sendMessage({
      type: "GET_ANALYSIS",
      tabId: tab.id,
    });
    return response;
  }

  async function initialAnalysisPoll(): Promise<AnalyzedMessage | ChromeError> {
    for (let attempt = 0; attempt < MAX_ATTEMPT; attempt++) {
      let response = await getAnalysis();

      if ("statusCode" in response) {
        if (response.statusCode === 404 || response.statusCode === 500)
          return response;
        if (response.statusCode === 202) console.log(response.message);
      } else {
        return response;
      }
      await new Promise((resolve) => setTimeout(resolve, INTERVAL));
    }
    return {
      statusCode: 404,
      message: "EXCEEDED MAXIMUM FETCH TIME, REFRESH AGAIN",
    };
  }

  async function continuousPoll() {
    let response = await getAnalysis();
    console.log("This is continuous poll", response);
    updateSamples(response);
    setTimeout(continuousPoll, 4000);
  }

  import HeapGraph from "./components/heapGraph.svelte";
</script>

<HeapGraph {heapSamples} {timeSamples} />
