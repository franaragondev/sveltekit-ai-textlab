<script lang="ts">
	// No logic needed for now
</script>

<svelte:head>
	<title>About — SvelteKit AI TextLab</title>
	<meta name="description" content="About this experimental SvelteKit project exploring AI integrations." />
</svelte:head>

<section class="max-w-3xl mx-auto px-4 py-10">
	<h1 class="text-3xl font-bold text-gray-800 mb-4">About</h1>

	<div class="prose prose-gray">
		<p>
			<strong>SvelteKit AI TextLab</strong> is a small experimental project to explore
			modern SvelteKit workflows, reactive UI patterns, and simple AI-powered features.
			The goal is to keep the codebase minimal while demonstrating clean integration with a backend API.
		</p>

		<h2>What’s inside</h2>
		<ul>
			<li>SvelteKit with TypeScript</li>
			<li>Tailwind CSS (typography & forms)</li>
			<li>Basic layout with header and footer</li>
			<li>Room to connect a Flask API for AI endpoints</li>
		</ul>

		<h2>Next steps</h2>
		<ul>
			<li>Add a simple API client and show AI responses on the home page</li>
			<li>Create loading and error states</li>
			<li>Deploy to Vercel</li>
		</ul>
	</div>
</section>