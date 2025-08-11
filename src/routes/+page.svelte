<script lang="ts">
	import { analyzeText, summarizeText } from '$lib/api';

	let inputText = '';
	let isLoading = false;
	let result: { label?: string; score?: number; summary?: string } | null = null;
	let errorMessage: string | null = null;

	async function handleSubmit() {
		if (!inputText.trim()) return;

		isLoading = true;
		errorMessage = null;
		result = null;

		try {
			// Call the API (example: sentiment analysis)
			const sentiment = await analyzeText(inputText);
			const summary = await summarizeText(inputText);
			result = { ...sentiment, summary: summary.summary };
		} catch (err) {
			errorMessage = 'Failed to process text. Please try again.';
			console.error(err);
		} finally {
			isLoading = false;
		}
	}
</script>

<div class="mt-20 bg-gray-100 flex flex-col items-center justify-center p-6">
	<h1 class="text-3xl font-bold text-gray-800 mb-6">SvelteKit AI TextLab</h1>
	
	<div class="w-full max-w-xl bg-white shadow-md rounded-lg p-6 space-y-4">
		<label for="textInput" class="block text-sm font-medium text-gray-700">
			Write your text to send to the AI:
		</label>
		
		<textarea
			id="textInput"
			bind:value={inputText}
			class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
			rows="6"
			placeholder="Type here..."
		></textarea>
		
        <button
        on:click={handleSubmit}
        class="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={isLoading}
    >
        {#if isLoading}
            <span class="flex items-center justify-center">
                <svg class="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16 8 8 0 01-8-8z"></path>
                </svg>
                Processing...
            </span>
        {:else}
            Send to AI
        {/if}
    </button>

    <!-- Error message -->
	{#if errorMessage}
        <p class="text-red-600 mt-4">{errorMessage}</p>
    {/if}

    <!-- AI result -->
	{#if result}
        <div class="mt-6 p-4 bg-gray-50 border rounded-lg">
            <h2 class="font-bold text-lg">Analysis Result:</h2>
            <p><strong>Sentiment:</strong> {result.label} ({((result.score ?? 0) * 100).toFixed(2)}%)</p>
            <p class="mt-2"><strong>Summary:</strong> {result.summary}</p>
        </div>
    {/if}
	</div>
</div>