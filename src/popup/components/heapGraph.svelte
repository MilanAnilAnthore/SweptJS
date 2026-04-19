<script lang="ts">
    import { onMount } from "svelte";
    import {
        Chart,
        LineController,
        LineElement,
        PointElement,
        CategoryScale,
        LinearScale,
    } from "chart.js";

    Chart.register(
        LineController,
        LineElement,
        PointElement,
        CategoryScale,
        LinearScale,
    );

    let { heapSamples, timeSamples } = $props();

    onMount(() => {
        let chart = new Chart(
            document.getElementById("acquisitions") as HTMLCanvasElement,
            {
                type: "line",
                data: {
                    labels: timeSamples,
                    datasets: [
                        {
                            label: "Used JS Heap (MB)",
                            data: heapSamples,
                            borderColor: "rgb(75, 192, 192)",
                            tension: 0.1,
                        },
                    ],
                },
            },
        );
    });
</script>

<div style="width: 800px;">
    <canvas id="acquisitions"></canvas>
</div>
