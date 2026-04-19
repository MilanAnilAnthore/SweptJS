<script lang="ts">
    let {
        heapthresholdExceeded,
        domthresholdExceeded,
    }: { heapthresholdExceeded: boolean; domthresholdExceeded: boolean } =
        $props();
</script>

<div class="mainThresh">
    {#if heapthresholdExceeded && domthresholdExceeded}
        🔴 High confidence Leak
    {:else if heapthresholdExceeded}
        🟡 Probable HEAP LEAK
    {:else if domthresholdExceeded}
        🟡 Probable DOM LEAK
    {:else}
        🟢 ALL GOOD
    {/if}
</div>
