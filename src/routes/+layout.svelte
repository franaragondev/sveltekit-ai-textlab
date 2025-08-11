<script>
	import '../app.css'; 
	// No logic needed for now, just the visual layout
</script>

<div class="min-h-screen flex flex-col bg-gray-100 text-gray-900">
	<!-- Header -->
	<header class="bg-white shadow-md">
		<div class="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
			<h1 class="text-lg font-bold text-blue-600">SvelteKit AI TextLab</h1>
			<nav class="space-x-4">
				<a href="/" class="text-gray-700 hover:text-blue-600">Home</a>
				<a href="/about" class="text-gray-700 hover:text-blue-600">About</a>
			</nav>
		</div>
	</header>

	<!-- Main content -->
	<main class="flex-grow">
		<slot />
	</main>

	<!-- Footer -->
	<footer class="bg-white border-t border-gray-400 mt-8">
		<div class="max-w-7xl mx-auto px-4 py-4 text-sm text-gray-500">
			&copy; {new Date().getFullYear()} SvelteKit AI TextLab. All rights reserved.
		</div>
	</footer>
</div>