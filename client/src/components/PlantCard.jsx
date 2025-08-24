export default function PlantCard({ plant }) {
	return (
		<div className="card">
			{plant.imageUrl ? (
				<img className="card-img" src={plant.imageUrl} alt={plant.name} loading="lazy" />
			) : (
				<div className="card-img placeholder" />
			)}
			<div className="card-body">
				<div className="card-title-row">
					<h3 className="card-title">{plant.name}</h3>
					<span className="price">₹{plant.price}</span>
				</div>
				<div className="tags">
					{(plant.categories || []).map((c) => (
						<span key={c} className="tag">{c}</span>
					))}
				</div>
				<div className={`stock ${plant.inStock ? 'in' : 'out'}`}>{plant.inStock ? 'In stock' : 'Out of stock'}</div>
			</div>
		</div>
	);
}