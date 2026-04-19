<script lang="ts">
    let {
        growthPercentage,
        currentAlive,
        heapthresholdExceeded,
    }: {
        growthPercentage: number;
        currentAlive: number;
        heapthresholdExceeded: boolean;
    } = $props();

    // Formats decimal to percentage
    const formatPercent = new Intl.NumberFormat(undefined, {
        style: "percent",
        minimumFractionDigits: 4,
        maximumFractionDigits: 4,
    });
</script>

<div class="cyber-card">
    <div class="metric-row">
        <span class="prefix">&gt;</span>
        <span class="label">NODE_GROWTH</span>
        <span class="value {heapthresholdExceeded ? 'warning' : 'normal'}"
            >{formatPercent.format(growthPercentage)}</span
        >
    </div>
    <div class="metric-row">
        <span class="prefix">&gt;</span>
        <span class="label">ALIVE_NODES</span>
        <span class="value normal">{currentAlive}</span>
    </div>
</div>

<style>
    .metric-row {
        display: flex;
        font-family: "JetBrains Mono", monospace;
        padding: 6px 0;
        align-items: center;
    }
    .prefix {
        color: var(--accent);
        margin-right: 12px;
        font-weight: bold;
        text-shadow: 0 0 5px rgba(0, 255, 136, 0.4);
    }
    .label {
        color: var(--muted-fg);
        flex: 1;
        letter-spacing: 0.05em;
    }
    .value {
        font-weight: bold;
        text-align: right;
    }
    .value.normal {
        color: var(--fg);
    }
    .value.warning {
        color: #ffcc00;
        text-shadow: 0 0 5px rgba(255, 204, 0, 0.4);
    }
</style>
