import express from 'express';
import Plant from '../models/Plant.js';

const router = express.Router();

// GET /api/plants
// Supports: search (name/category text), category filter, pagination
router.get('/', async (req, res) => {
	try {
		const { q, category, inStock, page = 1, limit = 24 } = req.query;

		const filters = {};
		if (typeof inStock !== 'undefined') {
			filters.inStock = inStock === 'true';
		}
		if (category && category !== 'all') {
			filters.categories = { $regex: new RegExp(category, 'i') };
		}
		if (q && q.trim()) {
			filters.$or = [
				{ name: { $regex: new RegExp(q, 'i') } },
				{ categories: { $regex: new RegExp(q, 'i') } }
			];
		}

		const pageNum = Math.max(parseInt(page, 10) || 1, 1);
		const pageSize = Math.min(Math.max(parseInt(limit, 10) || 24, 1), 100);

		const [items, total] = await Promise.all([
			Plant.find(filters)
				.sort({ createdAt: -1 })
				.skip((pageNum - 1) * pageSize)
				.limit(pageSize)
				.lean(),
			Plant.countDocuments(filters)
		]);

		res.json({ items, total, page: pageNum, limit: pageSize });
	} catch (error) {
		console.error('Error fetching plants', error);
		res.status(500).json({ message: 'Failed to fetch plants' });
	}
});

// GET /api/plants/categories
router.get('/categories', async (_req, res) => {
	try {
		const categories = await Plant.distinct('categories');
		categories.sort((a, b) => a.localeCompare(b));
		res.json({ categories });
	} catch (error) {
		console.error('Error fetching categories', error);
		res.status(500).json({ message: 'Failed to fetch categories' });
	}
});

// POST /api/plants
router.post('/', async (req, res) => {
	try {
		const { name, price, categories, inStock, imageUrl, description } = req.body;

		if (!name || typeof name !== 'string' || !name.trim()) {
			return res.status(400).json({ message: 'Name is required' });
		}
		const parsedPrice = Number(price);
		if (Number.isNaN(parsedPrice) || parsedPrice < 0) {
			return res.status(400).json({ message: 'Price must be a non-negative number' });
		}
		let categoryList = [];
		if (Array.isArray(categories)) {
			categoryList = categories.map((c) => String(c));
		} else if (typeof categories === 'string' && categories.trim().length > 0) {
			categoryList = categories.split(',').map((c) => c.trim());
		}

		const plant = await Plant.create({
			name: name.trim(),
			price: parsedPrice,
			categories: categoryList,
			inStock: typeof inStock === 'boolean' ? inStock : inStock === 'true',
			imageUrl: imageUrl || '',
			description: description || ''
		});

		res.status(201).json(plant);
	} catch (error) {
		console.error('Error creating plant', error);
		res.status(500).json({ message: 'Failed to create plant' });
	}
});

export default router;