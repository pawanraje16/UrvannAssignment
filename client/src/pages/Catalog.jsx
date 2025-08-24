import { useEffect, useMemo, useState } from 'react';
import { getPlants, getCategories } from '../api/client.js';
import PlantGrid from '../components/PlantGrid.jsx';
import SearchBar from '../components/SearchBar.jsx';
import CategoryFilter from '../components/CategoryFilter.jsx';

export default function Catalog() {
	const [plants, setPlants] = useState([]);
	const [total, setTotal] = useState(0);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [q, setQ] = useState('');
	const [category, setCategory] = useState('all');
	const [categories, setCategories] = useState([]);

	useEffect(() => {
		let mounted = true;
		getCategories()
			.then(({ categories }) => {
				if (mounted) setCategories(['all', ...categories]);
			})
			.catch(() => {});
		return () => { mounted = false };
	}, []);

	useEffect(() => {
		const controller = new AbortController();
		async function load() {
			setLoading(true);
			setError('');
			try {
				const { items, total } = await getPlants({ q, category, limit: 48 });
				setPlants(items);
				setTotal(total);
			} catch (err) {
				setError(err.message || 'Failed to load');
			} finally {
				setLoading(false);
			}
		}
		load();
		return () => controller.abort();
	}, [q, category]);

	return (
		<section>
			<div className="toolbar">
				<SearchBar value={q} onChange={setQ} placeholder="Search by name or category" />
				<CategoryFilter value={category} onChange={setCategory} options={categories} />
			</div>
			{loading && <div className="status">Loading plants…</div>}
			{error && <div className="status error">{error}</div>}
			{!loading && !error && (
				<>
					<PlantGrid items={plants} />
					<div className="count">{total} result(s)</div>
				</>
			)}
		</section>
	);
}