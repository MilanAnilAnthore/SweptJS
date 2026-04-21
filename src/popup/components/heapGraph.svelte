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

    onMount(() => {
        try {
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
                                borderColor: "#00ff88",
                                borderWidth: 2,
                                tension: 0,
                                pointBackgroundColor: "#0a0a0f",
                                pointBorderColor: "#00ff88",
                                pointRadius: 3,
                                pointHoverRadius: 5,
                            },
                        ],
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        color: "#6b7280",
                        scales: {
                            x: {
                                grid: {
                                    color: "rgba(42, 42, 58, 0.5)",
                                },
                                ticks: {
                                    color: "#6b7280",
                                    font: {
                                        family: "'JetBrains Mono', monospace",
                                    },
                                },
                            },
                            y: {
                                grid: {
                                    color: "rgba(42, 42, 58, 0.5)",
                                },
                                ticks: {
                                    color: "#6b7280",
                                    font: {
                                        family: "'JetBrains Mono', monospace",
                                    },
                                },
                            },
                        },
                        plugins: {
                            legend: {
                                labels: {
                                    color: "#e0e0e0",
                                    font: {
                                        family: "'JetBrains Mono', monospace",
                                    },
                                },
                            },
                        },
                    },
                },
            );
        } catch (err) {
            console.log(err);
        }
    });

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

<div class="cyber-card terminal" style="width: 100%; height: 300px;">
    <div class="terminal-header">
        <div class="dot g"></div>
        <div class="dot"></div>
        <div class="dot"></div>
        <span
            style="margin-left: 8px; font-size: 0.75rem; letter-spacing: 0.1em; opacity: 0.6;"
            >HEAP_TIMELINE</span
        >
    </div>
    <div style="padding: 0 10px 10px 10px; height: calc(100% - 49px);">
        <canvas id="acquisitions"></canvas>
    </div>
</div>
