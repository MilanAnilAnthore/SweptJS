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

    let chart: Chart | undefined;

    Chart.register(
        LineController,
        LineElement,
        PointElement,
        CategoryScale,
        LinearScale,
    );

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
</script>

<div style="width: 800px;">
    <canvas id="acquisitions"></canvas>
</div>
