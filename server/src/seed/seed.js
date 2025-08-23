import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectToDatabase } from '../config/database.js';
import Plant from '../models/Plant.js';

dotenv.config();

const categoriesPool = [
	'Indoor',
	'Outdoor',
	'Succulent',
	'Air Purifying',
	'Home Decor',
	'Flowering',
	'Low Maintenance',
	'Hanging',
	'Office',
	'Foliage'
];

const samplePlants = [
	{ name: 'Money Plant (Pothos)', price: 199, categories: ['Indoor', 'Home Decor', 'Low Maintenance'], inStock: true },
	{ name: 'Snake Plant (Sansevieria)', price: 299, categories: ['Indoor', 'Air Purifying', 'Low Maintenance'], inStock: true },
	{ name: 'Areca Palm', price: 499, categories: ['Indoor', 'Air Purifying'], inStock: true },
	{ name: 'Peace Lily', price: 349, categories: ['Indoor', 'Flowering', 'Air Purifying'], inStock: true },
	{ name: 'Aloe Vera', price: 149, categories: ['Indoor', 'Succulent', 'Low Maintenance'], inStock: true },
	{ name: 'Jade Plant', price: 249, categories: ['Indoor', 'Succulent', 'Home Decor'], inStock: true },
	{ name: 'ZZ Plant', price: 399, categories: ['Indoor', 'Low Maintenance'], inStock: true },
	{ name: 'Rubber Plant', price: 399, categories: ['Indoor', 'Home Decor'], inStock: true },
	{ name: 'Spider Plant', price: 199, categories: ['Indoor', 'Air Purifying', 'Hanging'], inStock: true },
	{ name: 'Boston Fern', price: 249, categories: ['Indoor', 'Hanging', 'Foliage'], inStock: true },
	{ name: 'Bamboo Palm', price: 399, categories: ['Indoor', 'Air Purifying'], inStock: true },
	{ name: 'Croton', price: 299, categories: ['Indoor', 'Foliage', 'Home Decor'], inStock: true },
	{ name: 'Ficus Benjamina', price: 499, categories: ['Indoor', 'Home Decor'], inStock: true },
	{ name: 'Fiddle Leaf Fig', price: 799, categories: ['Indoor', 'Home Decor'], inStock: true },
	{ name: 'Aglaonema', price: 349, categories: ['Indoor', 'Low Maintenance'], inStock: true },
	{ name: 'Philodendron', price: 299, categories: ['Indoor', 'Low Maintenance'], inStock: true },
	{ name: 'Monstera Deliciosa', price: 699, categories: ['Indoor', 'Home Decor'], inStock: true },
	{ name: 'Dracaena', price: 279, categories: ['Indoor', 'Air Purifying'], inStock: true },
	{ name: 'Calathea', price: 349, categories: ['Indoor', 'Foliage'], inStock: true },
	{ name: 'Dieffenbachia', price: 279, categories: ['Indoor', 'Foliage'], inStock: true },
	{ name: 'Peperomia', price: 199, categories: ['Indoor', 'Low Maintenance'], inStock: true },
	{ name: 'Schefflera', price: 299, categories: ['Indoor', 'Home Decor'], inStock: true },
	{ name: 'Anthurium', price: 399, categories: ['Indoor', 'Flowering', 'Home Decor'], inStock: true },
	{ name: 'Begonia', price: 249, categories: ['Indoor', 'Flowering'], inStock: true },
	{ name: 'Ponytail Palm', price: 449, categories: ['Indoor', 'Low Maintenance'], inStock: true },
	{ name: 'Pothos Marble Queen', price: 229, categories: ['Indoor', 'Hanging', 'Low Maintenance'], inStock: true },
	{ name: 'Syngonium', price: 189, categories: ['Indoor', 'Foliage'], inStock: true },
	{ name: 'Areca Palm Dwarf', price: 379, categories: ['Indoor', 'Air Purifying'], inStock: true },
	{ name: 'Cactus Mix', price: 159, categories: ['Indoor', 'Succulent'], inStock: true },
	{ name: 'Haworthia', price: 179, categories: ['Indoor', 'Succulent', 'Low Maintenance'], inStock: true },
	{ name: 'Kalanchoe', price: 199, categories: ['Indoor', 'Succulent', 'Flowering'], inStock: true },
	{ name: 'Rhoeo', price: 169, categories: ['Outdoor', 'Foliage'], inStock: true },
	{ name: 'Bougainvillea', price: 199, categories: ['Outdoor', 'Flowering'], inStock: true },
	{ name: 'Hibiscus', price: 249, categories: ['Outdoor', 'Flowering'], inStock: true },
	{ name: 'Jasmine', price: 299, categories: ['Outdoor', 'Flowering', 'Fragrant'], inStock: true },
	{ name: 'Rose (Desi)', price: 199, categories: ['Outdoor', 'Flowering'], inStock: true },
	{ name: 'Lavender', price: 349, categories: ['Outdoor', 'Fragrant'], inStock: true },
	{ name: 'Mint', price: 99, categories: ['Outdoor', 'Herb'], inStock: true },
	{ name: 'Basil (Tulsi)', price: 99, categories: ['Outdoor', 'Herb'], inStock: true },
	{ name: 'Curry Leaf Plant', price: 149, categories: ['Outdoor', 'Herb'], inStock: true },
	{ name: 'Adenium (Desert Rose)', price: 499, categories: ['Outdoor', 'Succulent', 'Flowering'], inStock: true },
	{ name: 'Portulaca', price: 99, categories: ['Outdoor', 'Flowering', 'Succulent'], inStock: true },
	{ name: 'Ixora', price: 219, categories: ['Outdoor', 'Flowering'], inStock: true },
	{ name: 'Chrysanthemum', price: 189, categories: ['Outdoor', 'Flowering'], inStock: true },
	{ name: 'Coleus', price: 149, categories: ['Outdoor', 'Foliage'], inStock: true },
	{ name: 'Cordyline', price: 249, categories: ['Outdoor', 'Foliage'], inStock: true },
	{ name: 'Areca Palm Outdoor', price: 499, categories: ['Outdoor', 'Air Purifying'], inStock: true },
	{ name: 'Bamboo (Lucky Bamboo)', price: 249, categories: ['Indoor', 'Home Decor'], inStock: true },
	{ name: 'Succulent Mix', price: 199, categories: ['Indoor', 'Succulent'], inStock: true }
];

async function seed() {
	try {
		await connectToDatabase();
		await Plant.deleteMany({});

		const withImages = samplePlants.map((p, idx) => ({
			...p,
			imageUrl: `https://picsum.photos/seed/plant_${idx}/400/300`,
			description: `${p.name} is a beautiful plant suitable for ${p.categories.join(', ').toLowerCase()} environments.`
		}));

		await Plant.insertMany(withImages);
		console.log(`Inserted ${withImages.length} plants.`);
	} catch (error) {
		console.error('Seed failed', error);
	} finally {
		await mongoose.disconnect();
		process.exit(0);
	}
}

seed();