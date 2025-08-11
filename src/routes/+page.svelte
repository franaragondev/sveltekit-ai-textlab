<script lang="ts">
	let inputText = '';
	
	function handleSubmit() {
		console.log("Submitted text:", inputText);
		// Here we will later connect to the Flask API or similar
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
			class="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
		>
			Send to AI
		</button>
	</div>
</div>