<script lang="ts">
    let {
        heapthresholdExceeded,
        domthresholdExceeded,
    }: { heapthresholdExceeded: boolean; domthresholdExceeded: boolean } =
        $props();

    let statusType = $derived(
        heapthresholdExceeded && domthresholdExceeded ? 'critical' :
        heapthresholdExceeded ? 'warning-heap' :
        domthresholdExceeded ? 'warning-dom' : 'ok'
    );
</script>

<div class="cyber-card terminal" style="margin-bottom: 24px;">
    <div class="terminal-header">
        <div class="dot {statusType === 'ok' ? 'g' : statusType.includes('warning') ? 'y' : 'r'}"></div>
        <div class="dot"></div>
        <div class="dot"></div>
        <span style="margin-left: 8px; font-size: 0.75rem; letter-spacing: 0.1em; opacity: 0.6;">SYS_STATUS</span>
    </div>
    
    <div class="status-indicator {statusType}">
        {#if statusType === 'critical'}
            [CRITICAL] HIGH CONFIDENCE LEAK
        {:else if statusType === 'warning-heap'}
            [WARNING] PROBABLE HEAP LEAK
        {:else if statusType === 'warning-dom'}
            [WARNING] PROBABLE DOM LEAK
        {:else}
            [OK] SYSTEM STABLE. ALL GOOD.
        {/if}
    </div>
</div>

<style>
    .status-indicator {
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.9rem;
        font-weight: bold;
        padding: 8px;
        border-left: 3px solid transparent;
        animation: pulse 2s infinite;
    }
    .status-indicator.ok {
        color: var(--accent);
        border-color: var(--accent);
        text-shadow: 0 0 5px rgba(0, 255, 136, 0.4);
    }
    .status-indicator.warning-heap,
    .status-indicator.warning-dom {
        color: #ffcc00;
        border-color: #ffcc00;
        text-shadow: 0 0 5px rgba(255, 204, 0, 0.4);
    }
    .status-indicator.critical {
        color: var(--destructive);
        border-color: var(--destructive);
        text-shadow: 0 0 5px rgba(255, 51, 102, 0.5);
        animation: critical-pulse 1s infinite alternate;
    }
    
    @keyframes pulse {
        0%, 100% { opacity: 0.9; }
        50% { opacity: 1; }
    }
    @keyframes critical-pulse {
        0% { opacity: 0.7; transform: translateX(0); }
        100% { opacity: 1; transform: translateX(2px); }
    }
</style>
