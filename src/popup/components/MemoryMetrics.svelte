<script lang="ts">
    let {
        growthPercentage,
        currentAlive,
    }: { growthPercentage: number; currentAlive: number } = $props();

    // This is the formatter we use to convert decimal to a clean percentage
    const formatPercent = new Intl.NumberFormat(undefined, {
        style: "percent",
        minimumFractionDigits: 4,
        maximumFractionDigits: 4,
    });
</script>

<div class="growth">{formatPercent.format(growthPercentage)}</div>
<div class="aliveNodes">{currentAlive}</div>
