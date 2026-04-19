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

    let {
        heapSamples,
        timeSamples,
    }: { heapSamples: number[]; timeSamples: string[] } = $props();

    let chart: Chart;

    try {
        onMount(() => {
            chart = new Chart(
                document.getElementById("acquisitions") as HTMLCanvasElement,
                {
                    type: "line",
                    data: {
                        labels: [],
                        datasets: [
                            {
                                label: "Used JS Heap (MB)",
                                data: [],
                                borderColor: "rgb(75, 192, 192)",
                                tension: 0.1,
                            },
                        ],
                    },
                },
            );
        });
    } catch (err) {
        console.log(err);
    }

    $effect(() => {
        if (chart) {
            chart.data.labels = $state.snapshot(timeSamples);
            if (chart.data.datasets?.[0]) {
                chart.data.datasets[0].data = $state.snapshot(heapSamples);
            }
            chart.update();
        }
    });
</script>

<div style="width: 600px;">
    <canvas id="acquisitions"></canvas>
</div>
