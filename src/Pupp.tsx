import { useState } from "react"

export default function App() {
	const [counter, setCounter] = useState<number>(0)

	return (
		<div>
			<h1>Counter</h1>
			<span id="counter">{counter}</span>
			<button onClick={() => setCounter(counter + 1)}>+1</button>
		</div>
	)
}