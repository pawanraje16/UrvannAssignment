import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
// Tailwind conversion: removing external CSS file

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="max-w-[1280px] mx-auto p-8 text-center">
      <div className="flex items-center justify-center gap-8">
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="h-24 p-6 transition-[filter] duration-300 hover:drop-shadow-[0_0_2em_#646cffaa]" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="h-24 p-6 transition-[filter] duration-300 hover:drop-shadow-[0_0_2em_#61dafbaa]" alt="React logo" />
        </a>
      </div>
      <h1 className="text-5xl leading-tight">Vite + React</h1>
      <div className="p-8">
        <button
          className="rounded-lg border border-transparent px-5 py-2 text-base font-medium bg-neutral-900 hover:border-[#646cff] focus:outline focus:outline-4 focus:outline-blue-600"
          onClick={() => setCount((count) => count + 1)}
        >
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="text-gray-500">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  )
}

export default App