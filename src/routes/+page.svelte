<script lang="ts">
	// Import Svelte lifecycle hook and API helper functions
	import { onMount } from 'svelte';
	import { analyzeText, summarizeText, API_URL } from '$lib/api';

	// ---------------------------
	// Reactive state variables
	// ---------------------------

	// Stores the text entered by the user
	let inputText = '';

	// Indicates whether an AI request is in progress
	let isLoading = false;

	// Stores the result from the AI API (sentiment + summary)
	let result: { label?: string; score?: number; summary?: string } | null = null;

	// Stores any error message to display to the user (API call errors)
	let errorMessage: string | null = null;

	// ---------------------------
	// Backend warmup tracking
	// ---------------------------

	// Flag that tells if models are fully ready
	let ready = false;

	// Current warmup percentage from the backend
	let percent = 0;

	// Optional: warmup error message coming from /status (e.g., missing protobuf)
	let warmupError: string | null = null;

	/**
	 * Polls the backend `/status` endpoint to check:
	 * - Whether the AI models are loaded and ready
	 * - The current percentage progress
	 * - Any warmup error surfaced by the backend
	 */
	async function pollStatus() {
		try {
			const r = await fetch(`${API_URL}/status`);
			if (r.ok) {
				const s = await r.json();
				ready = !!s.ready;
				percent = typeof s.percent === 'number' ? s.percent : 0;
				// Read backend-surfaced error (string or null)
				warmupError = typeof s.error === 'string' && s.error.length ? s.error : null;
			}
		} catch {
			// Ignore errors (e.g., if backend is still starting)
			console.warn('status poll failed');
		}
	}

	/**
	 * Svelte lifecycle: runs once when the component is mounted.
	 * Starts polling the backend every 1 second for status updates.
	 * Cleans up the interval when component is destroyed.
	 */
	onMount(() => {
		pollStatus();
		const id = setInterval(pollStatus, 1000);
		return () => clearInterval(id);
	});

	/**
	 * Handles form submission:
	 * - Validates input and readiness
	 * - Calls backend sentiment and summarization APIs
	 * - Updates UI state with results or errors
	 */
	async function handleSubmit() {
		if (!ready || !inputText.trim()) return;

		isLoading = true;
		errorMessage = null;
		result = null;

		try {
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
		<!-- Textarea for user input -->
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

		<!-- Display real progress bar while models are downloading -->
		{#if !ready}
			<div class="mt-2">
				<p class="text-sm text-gray-600 mb-2">
					First-time setup: downloading AI models… ({percent}%)
				</p>
				<div class="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
					<!-- Progress bar fill width matches backend-reported percent -->
					<div class="bg-blue-600 h-2 transition-all" style="width: {percent}%"></div>
				</div>

				<!-- Warmup error coming from backend (e.g., missing protobuf/sentencepiece) -->
				{#if warmupError}
					<p class="text-sm text-red-600 mt-2">
						Setup error: {warmupError}
					</p>
				{/if}
			</div>
		{/if}

		<!-- Submit button -->
		<button
			on:click={handleSubmit}
			class="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
			disabled={!ready || isLoading}
		>
			{#if isLoading}
				<!-- Loading spinner during API request -->
				<span class="flex items-center justify-center">
					<svg class="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
						<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
						<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16 8 8 0 01-8-8z"></path>
					</svg>
					Processing...
				</span>
			{:else}
				<!-- Change button text depending on model readiness -->
				{#if !ready} Preparing models… {:else} Send to AI {/if}
			{/if}
		</button>

		<!-- Show error message if request failed -->
		{#if errorMessage}
			<p class="text-red-600 mt-4">{errorMessage}</p>
		{/if}

		<!-- Show AI results when available -->
		{#if result}
			<div class="mt-6 p-4 bg-gray-50 border rounded-lg">
				<h2 class="font-bold text-lg">Analysis Result:</h2>
				<p>
					<strong>Sentiment:</strong>
					{result.label} ({((result.score ?? 0) * 100).toFixed(2)}%)
				</p>
				<p class="mt-2">
					<strong>Summary:</strong> {result.summary}
				</p>
			</div>
		{/if}
	</div>
</div>