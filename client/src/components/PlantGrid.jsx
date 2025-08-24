import PlantCard from './PlantCard.jsx';

export default function PlantGrid({ items }) {
	if (!items || items.length === 0) {
		return <div className="status">No plants found.</div>;
	}
	return (
		<div className="grid">
			{items.map((p) => (
				<PlantCard key={p._id || p.name} plant={p} />
			))}
		</div>
	);
}