<script lang="ts">
	import { onMount } from 'svelte';
	import { analyzeText, API_URL } from '$lib/api';

	let inputText = '';
	let isLoading = false;
	let result: { label?: string; score?: number } | null = null;
	let errorMessage: string | null = null;

	// warmup
	let ready = false;
	let percent = 0;
	let warmupError: string | null = null;

	async function pollStatus() {
		try {
			const r = await fetch(`${API_URL}/status`);
			if (r.ok) {
				const s = await r.json();
				ready = !!s.ready;
				percent = typeof s.percent === 'number' ? s.percent : 0;
				warmupError = typeof s.error === 'string' && s.error.length ? s.error : null;
			}
		} catch {
			console.warn('status poll failed');
		}
	}

	onMount(() => {
		pollStatus();
		const id = setInterval(pollStatus, 1000);
		return () => clearInterval(id);
	});

	async function handleSubmit() {
		if (!ready || !inputText.trim()) return;
		isLoading = true;
		errorMessage = null;
		result = null;

		try {
			const sentiment = await analyzeText(inputText);
			result = sentiment;
		} catch (err) {
			errorMessage = 'Failed to analyze text. Please try again.';
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

		{#if !ready}
			<div class="mt-2">
				<p class="text-sm text-gray-600 mb-2">
					First-time setup: downloading AI model… ({percent}%)
				</p>
				<div class="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
					<div class="bg-blue-600 h-2 transition-all" style="width: {percent}%"></div>
				</div>
				{#if warmupError}
					<p class="text-sm text-red-600 mt-2">Setup error: {warmupError}</p>
				{/if}
			</div>
		{/if}

		<button
			on:click={handleSubmit}
			class="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
			disabled={!ready || isLoading}
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
				{#if !ready} Preparing model… {:else} Analyze sentiment {/if}
			{/if}
		</button>

		{#if errorMessage}
			<p class="text-red-600 mt-4">{errorMessage}</p>
		{/if}

		{#if result}
			<div class="mt-6 p-4 bg-gray-50 border rounded-lg">
				<h2 class="font-bold text-lg">Analysis Result:</h2>
				<p><strong>Sentiment:</strong> {result.label} ({((result.score ?? 0) * 100).toFixed(2)}%)</p>
			</div>
		{/if}
	</div>
</div>