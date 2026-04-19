<script lang="ts">
    import type { customError } from "../../utils/errorHandler";

    let { currentError = null }: { currentError: customError | null } =
        $props();
</script>

{#if currentError}
    <div class="error-container">
        <strong class="error-title"
            >[{currentError.type}] Error {currentError.statusCode}</strong
        >
        <p class="error-message">
            {currentError.message}
        </p>
    </div>
{/if}

<style>
    .error-container {
        border: 1px solid red;
        background-color: rgba(255, 0, 0, 0.1);
        padding: 10px;
        margin-bottom: 20px;
        color: #ff4d4d;
        border-radius: 4px;
        box-shadow: 0 0 10px rgba(255, 0, 0, 0.2);
    }

    .error-title {
        text-transform: uppercase;
    }

    .error-message {
        margin: 4px 0 0 0;
        font-size: 0.9em;
    }
</style>
