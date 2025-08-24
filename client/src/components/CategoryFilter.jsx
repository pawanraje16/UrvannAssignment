export default function CategoryFilter({ value, onChange, options = [] }) {
	return (
		<select className="select" value={value} onChange={(e) => onChange(e.target.value)}>
			{options.length === 0 && <option value="all">All</option>}
			{options.map((opt) => (
				<option key={opt} value={opt}>{opt === 'all' ? 'All' : opt}</option>
			))}
		</select>
	);
}