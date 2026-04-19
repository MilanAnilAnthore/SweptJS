<script lang="ts">
    import type { ChromeError } from "../../types";

    let { currentError = null }: { currentError: ChromeError | null } =
        $props();

    let positiveError = $derived(
        currentError
            ? currentError.statusCode === 202 || currentError.statusCode === 200
            : false,
    );
</script>

{#if currentError}
    <div class="error-container" class:positive={positiveError}>
        <strong class="error-title"
            >[{currentError.errorType}] {positiveError ? "Status" : "Error"}
            {currentError.statusCode}</strong
        >
        <p class="error-message">
            {currentError.message}
        </p>
    </div>
{/if}

<style>
    .error-container {
        border: 1px solid var(--destructive, red);
        background-color: rgba(255, 51, 102, 0.1);
        padding: 10px;
        margin-bottom: 20px;
        color: var(--destructive, #ff4d4d);
        border-radius: 4px;
        box-shadow: 0 0 10px rgba(255, 51, 102, 0.2);
    }

    .error-container.positive {
        border-color: var(--accent);
        background-color: rgba(0, 255, 136, 0.1);
        color: var(--accent);
        box-shadow: 0 0 10px rgba(0, 255, 136, 0.2);
    }

    .error-title {
        text-transform: uppercase;
    }

    .error-message {
        margin: 4px 0 0 0;
        font-size: 0.9em;
    }
</style>
