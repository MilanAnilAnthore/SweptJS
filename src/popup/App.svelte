<script lang="ts">
  import { onMount } from "svelte";
  import { ErrorType, type AnalyzedMessage, type ChromeError } from "../types";

  const MAX_ATTEMPT = 20;
  const INTERVAL = 4000;

  let heapSamples = $state<number[]>([]);
  let timeSamples = $state<string[]>([]);
  let heapthresholdExceeded = $state<boolean>(false);
  let domthresholdExceeded = $state<boolean>(false);
  let growthPercentage = $state<number>(0);
  let currentAlive = $state<number>(0);

  let currentError = $state<ChromeError | null>(null);
  onMount(() => {
    finalAnalysisResult();
  });

  function updateSamples(data: AnalyzedMessage | ChromeError) {
    if ("samples" in data) {
      heapSamples = data.samples.arrayHeap;
      timeSamples = data.samples.arrayTime;
    }

    if ("analyzedHeap" in data && "analyzedDom" in data) {
      heapthresholdExceeded = data.analyzedHeap.heapthresholdExceeded;
      domthresholdExceeded = data.analyzedDom.domthresholdExceeded;
      growthPercentage = data.analyzedHeap.growthPercentage;
      currentAlive = data.analyzedDom.currentAlive;
    }
  }

  async function finalAnalysisResult() {
    const analyzedData = await initialAnalysisPoll();

    if ("statusCode" in analyzedData) {
      currentError = analyzedData;
    } else {
      updateSamples(analyzedData);
    }
    continuousPoll();
  }

  async function getAnalysis(): Promise<AnalyzedMessage | ChromeError> {
    try {
      let [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });
      if (!tab?.id) {
        return {
          errorType: ErrorType.TAB_ID,
          statusCode: 404,
          message: "Tab ID ERROR",
        };
      }

      let response = await chrome.runtime.sendMessage({
        type: "GET_ANALYSIS",
        tabId: tab.id,
      });

      if (!response) {
        return {
          errorType: ErrorType.MESSAGING,
          statusCode: 500,
          message: "No response from background script",
        };
      }
      return response;
    } catch (e: any) {
      return {
        errorType: ErrorType.MESSAGING,
        statusCode: 500,
        message: e?.message || "Failed to communicate with extension",
      };
    }
  }

  async function initialAnalysisPoll(): Promise<AnalyzedMessage | ChromeError> {
    for (let attempt = 0; attempt < MAX_ATTEMPT; attempt++) {
      let response = await getAnalysis();

      if ("statusCode" in response) {
        if (response.statusCode === 404 || response.statusCode === 500)
          return response;
        if (response.statusCode === 202) {
          currentError = response;
        }
      } else {
        return response;
      }
      await new Promise((resolve) => setTimeout(resolve, INTERVAL));
    }
    return {
      errorType: ErrorType.TIMEOUT,
      statusCode: 404,
      message: "EXCEEDED MAXIMUM FETCH TIME, REFRESH AGAIN",
    };
  }

  async function continuousPoll() {
    let response = await getAnalysis();
    if ("statusCode" in response) {
      currentError = response;
    } else {
      currentError = null;
      updateSamples(response);
    }
    setTimeout(continuousPoll, INTERVAL);
  }

  async function clearData() {
    try {
      let [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });
      if (!tab?.id) {
        currentError = {
          errorType: ErrorType.TAB_ID,
          statusCode: 404,
          message: "Tab ID error",
        };
        return;
      }

      const key = `dataSample_${tab.id}`;
      const result = await chrome.storage.local.get(key);

      if (result[key]) {
        await chrome.storage.local.remove(key);
        heapSamples = [];
        timeSamples = [];
        growthPercentage = 0;
        currentAlive = 0;
        currentError = {
          statusCode: 200,
          message: "Data successfully cleared",
        };
      } else {
        currentError = { statusCode: 404, message: "Data not found" };
      }
    } catch (e: any) {
      currentError = {
        errorType: ErrorType.STORAGE,
        statusCode: 500,
        message: e?.message || "Failed to access local storage",
      };
    }
  }

  import HeapGraph from "./components/heapGraph.svelte";
  import MemoryMetrics from "./components/MemoryMetrics.svelte";
  import MemoryStatus from "./components/MemoryStatus.svelte";
  import ErrorDisplay from "./components/errorDisplay.svelte";
</script>

<main class="cyber-container">
  <header style="margin-bottom: 24px;">
    <h1 class="cyber-h1 cyber-glitch" data-text="SWEPT.JS">SWEPT.JS</h1>
    <div
      style="font-size: 0.8rem; color: var(--muted-fg); margin-top: -16px; margin-bottom: 16px;"
    >
      SYS_DIAGNOSTICS >_
    </div>
  </header>

  <ErrorDisplay {currentError} />
  <MemoryStatus {heapthresholdExceeded} {domthresholdExceeded} />
  <MemoryMetrics {growthPercentage} {currentAlive} {heapthresholdExceeded} />
  <HeapGraph {heapSamples} {timeSamples} />

  <button class="cyber-button destructive" onclick={clearData}
    >Clear Data</button
  >
</main>
