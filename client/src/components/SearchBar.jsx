import { useEffect, useState } from 'react';

export default function SearchBar({ value, onChange, placeholder = 'Search…', delay = 300 }) {
	const [text, setText] = useState(value || '');
	useEffect(() => setText(value || ''), [value]);
	useEffect(() => {
		const id = setTimeout(() => {
			onChange && onChange(text);
		}, delay);
		return () => clearTimeout(id);
	}, [text, delay, onChange]);
	return (
		<input
			className="search"
			type="search"
			value={text}
			onChange={(e) => setText(e.target.value)}
			placeholder={placeholder}
		/>
	);
}