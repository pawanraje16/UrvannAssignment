const API_BASE = import.meta.env.VITE_API_BASE || '/api';

async function apiFetch(path, options = {}) {
	const response = await fetch(`${API_BASE}${path}`, {
		headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
		...options
	});
	if (!response.ok) {
		let message = `Request failed with ${response.status}`;
		try {
			const err = await response.json();
			message = err.message || message;
		} catch {}
		throw new Error(message);
	}
	return response.json();
}

export function getPlants(params = {}) {
	const search = new URLSearchParams();
	if (params.q) search.set('q', params.q);
	if (params.category && params.category !== 'all') search.set('category', params.category);
	if (typeof params.inStock !== 'undefined') search.set('inStock', String(params.inStock));
	if (params.page) search.set('page', String(params.page));
	if (params.limit) search.set('limit', String(params.limit));
	const qs = search.toString();
	return apiFetch(`/plants${qs ? `?${qs}` : ''}`);
}

export function getCategories() {
	return apiFetch('/plants/categories');
}

export function createPlant(data) {
	return apiFetch('/plants', {
		method: 'POST',
		body: JSON.stringify(data)
	});
}