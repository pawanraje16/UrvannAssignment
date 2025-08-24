import { useState } from 'react';
import { createPlant } from '../api/client.js';

export default function Admin() {
	const [form, setForm] = useState({ name: '', price: '', categories: '', inStock: true, imageUrl: '', description: '' });
	const [submitting, setSubmitting] = useState(false);
	const [message, setMessage] = useState('');
	const [error, setError] = useState('');

	function updateField(field, value) {
		setForm((f) => ({ ...f, [field]: value }));
	}

	async function onSubmit(e) {
		e.preventDefault();
		setError('');
		setMessage('');
		if (!form.name.trim()) {
			setError('Name is required');
			return;
		}
		const priceNum = Number(form.price);
		if (Number.isNaN(priceNum) || priceNum < 0) {
			setError('Price must be a non-negative number');
			return;
		}
		const categories = form.categories
			.split(',')
			.map((c) => c.trim())
			.filter(Boolean);
		setSubmitting(true);
		try {
			await createPlant({
				name: form.name.trim(),
				price: priceNum,
				categories,
				inStock: !!form.inStock,
				imageUrl: form.imageUrl,
				description: form.description
			});
			setMessage('Plant added successfully');
			setForm({ name: '', price: '', categories: '', inStock: true, imageUrl: '', description: '' });
		} catch (err) {
			setError(err.message || 'Failed to add plant');
		} finally {
			setSubmitting(false);
		}
	}

	return (
		<section>
			<h2>Add Plant</h2>
			<form className="form" onSubmit={onSubmit}>
				<label>
					<span>Name</span>
					<input type="text" value={form.name} onChange={(e) => updateField('name', e.target.value)} required />
				</label>
				<label>
					<span>Price (₹)</span>
					<input type="number" min="0" step="1" value={form.price} onChange={(e) => updateField('price', e.target.value)} required />
				</label>
				<label>
					<span>Categories (comma-separated)</span>
					<input type="text" value={form.categories} onChange={(e) => updateField('categories', e.target.value)} placeholder="Indoor, Home Decor" />
				</label>
				<label className="checkbox">
					<input type="checkbox" checked={form.inStock} onChange={(e) => updateField('inStock', e.target.checked)} />
					<span>In Stock</span>
				</label>
				<label>
					<span>Image URL (optional)</span>
					<input type="url" value={form.imageUrl} onChange={(e) => updateField('imageUrl', e.target.value)} placeholder="https://..." />
				</label>
				<label>
					<span>Description (optional)</span>
					<textarea rows="4" value={form.description} onChange={(e) => updateField('description', e.target.value)} />
				</label>
				<div className="form-actions">
					<button type="submit" disabled={submitting}>{submitting ? 'Saving…' : 'Add Plant'}</button>
				</div>
			</form>
			{message && <div className="status success">{message}</div>}
			{error && <div className="status error">{error}</div>}
		</section>
	);
}