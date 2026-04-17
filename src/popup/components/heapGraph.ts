import { Chart, LineController, LineElement, PointElement, CategoryScale, LinearScale } from "chart.js";

Chart.register(LineController, LineElement, PointElement, CategoryScale, LinearScale)


new Chart(
    document.getElementById("acquisitions") as HTMLCanvasElement,
    {
        type: 'line',
        data: {
            labels: [],
            datasets: [
                {
                    label: 'Used JS Heap (MB)',
                    data: [],
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1
                }
            ]
        }
    }
)