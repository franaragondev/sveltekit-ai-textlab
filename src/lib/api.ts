export const API_URL = import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:5000';

export async function analyzeText(text: string) {
	const r = await fetch(`${API_URL}/api/sentiment`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ text })
	});
	if (!r.ok) throw new Error('Sentiment request failed');
	return r.json() as Promise<{ label: string; score: number }>;
}
