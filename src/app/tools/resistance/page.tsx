import { redirect } from "next/dist/server/api-utils"

interface ColorCodes {
  name: string,
  value: number | undefined,
  tolerance: number | undefined
}

const colorCodes: ColorCodes[] = [
  { name: 'black', value: 0, tolerance: undefined },
  { name: 'brown', value: 1, tolerance: 1 },
  { name: 'red', value: 2, tolerance: 2 },
  { name: 'orange', value: 3, tolerance: undefined },
  { name: 'yellow', value: 4, tolerance: undefined },
  { name: 'green', value: 5, tolerance: 0.5 },
  { name: 'blue', value: 6, tolerance: 0.25 },
  { name: 'violet', value: 7, tolerance: 0.1 },
  { name: 'gray', value: 8, tolerance: 0.05 },
  { name: 'white', value: 9, tolerance: undefined },
  { name: 'gold', value: 0.1, tolerance: 5 },
  { name: 'silver', value: 0.01, tolerance: 10 },
  { name: '', value: undefined, tolerance: 20 },
]

function Button(color: string) {
  <button>{colorCodes[color].value}</button>
}

function ColorRow() {
  return (
    <div>
      <p>Brown</p>
      <button>C</button>
      <button>D</button>
      <button>E</button>
      <button>F</button>
    </div>
  )
}

export default function Resistance() {
  return (
    <div>
      <p>Testing the Resistance calculator page!</p>
      <ColorRow />
    </div>
  )
}