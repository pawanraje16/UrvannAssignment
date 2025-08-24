import { BrowserRouter, Routes, Route, Link, NavLink } from 'react-router-dom';
import Catalog from './pages/Catalog.jsx';
import Admin from './pages/Admin.jsx';
import './index.css';

function App() {
	return (
		<BrowserRouter>
			<header className="site-header">
				<div className="container header-inner">
					<Link to="/" className="logo">Urvann Mini Plant Store</Link>
					<nav className="nav">
						<NavLink to="/" end>Catalog</NavLink>
						<NavLink to="/admin">Add Plant</NavLink>
					</nav>
				</div>
			</header>
			<main className="container">
				<Routes>
					<Route path="/" element={<Catalog />} />
					<Route path="/admin" element={<Admin />} />
				</Routes>
			</main>
			<footer className="site-footer">
				<div className="container">© {new Date().getFullYear()} Urvann</div>
			</footer>
		</BrowserRouter>
	);
}

export default App;
