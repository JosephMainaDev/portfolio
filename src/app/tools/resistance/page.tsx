'use client'
import { redirect } from "next/dist/server/api-utils"
import { useState } from "react"

interface ColorCodes {
  color: string,
  value: number | null,
  tolerance: number | null
}

const colorCodes: ColorCodes[] = [
  { color: 'black', value: 0, tolerance: null },
  { color: 'brown', value: 1, tolerance: 1 },
  { color: 'red', value: 2, tolerance: 2 },
  { color: 'orange', value: 3, tolerance: null },
  { color: 'yellow', value: 4, tolerance: null },
  { color: 'green', value: 5, tolerance: 0.5 },
  { color: 'blue', value: 6, tolerance: 0.25 },
  { color: 'violet', value: 7, tolerance: 0.1 },
  { color: 'gray', value: 8, tolerance: 0.05 },
  { color: 'white', value: 9, tolerance: null },
  { color: 'gold', value: -1, tolerance: 5 },
  { color: 'silver', value: -2, tolerance: 10 },
  { color: '', value: null, tolerance: 20 }
]

interface ColorCodeProps extends ColorCodes {
  bands: number
  onClick: React.MouseEventHandler<HTMLButtonElement>
}

function ColorRow({ bands, color, value, tolerance, onClick }: ColorCodeProps) {
  return (
    <div>
      <span>{color}</span>
      {[...Array(bands)].map((_, i) => {
        if (value === null) return <button key={i} disabled>{''}</button>
        else if (value < 0) return <button key={i} disabled>{''}</button>
        return <button key={i} onClick={onClick} value={value} name={['firstDigit', 'secondDigit', 'thirdDigit'][i]}>{value}</button>
      })}
      {value === null ? '' : <button onClick={onClick} value={value} name="multiplier">10<sup>{value}</sup></button>}
      {tolerance && <button onClick={onClick} value={tolerance} name="tolerance">&plusmn;{tolerance}%</button>}
    </div>
  )
}

function ColorCodesMap({ onClick }: {onClick: React.MouseEventHandler<HTMLButtonElement>}) {
  const colorCodesMap = colorCodes.map(color => {
    return <ColorRow bands={3} key={color.color} {...color} onClick={onClick} />
  })
  return (
    <>
      {colorCodesMap}
    </>
  )
}

interface Resistance {
  firstDigit: number | null,
  secondDigit: number | null,
  thirdDigit: number | null,
  multiplier: number | null,
  tolerance: number | null
  bands?: number
}

function OutputRow({ firstDigit, secondDigit, thirdDigit, multiplier, tolerance, bands }: Resistance) {
  return (
    <div>
      {[...Array(bands)].map((_, i) => {
        return <span key={i}>{[firstDigit, secondDigit, thirdDigit][i]}</span>
      })}
      {multiplier && <span> &times; 10<sup>{multiplier}</sup></span>}
      {tolerance && <span>&plusmn;{tolerance}%</span>}
      <span>Resistance</span>
      <label>Select the unit to display the resistance</label>
      <select name="resistance" defaultValue="default">
        <option value="milli">m&#8486;</option>
        <option value="default">&#8486;</option>
        <option value="kilo">k&#8486;</option>
        <option value="mega">M&#8486;</option>
      </select>
    </div>
  )
}

export default function Resistance() {
  const initialResistance = {
    firstDigit: null,
    secondDigit: null,
    thirdDigit: null,
    multiplier: null,
    tolerance: null
  }
  const [resistance, setResistance] = useState({...initialResistance})

  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    // clears the error: Property 'name' does not exist on type 'EventTarget'.
    const target = e.target as HTMLButtonElement
    setResistance({ ...resistance, [target.name]: target.value })
  }

  return (
    <div>
      <p>Testing the Resistance calculator page!</p>
      <ColorCodesMap onClick={handleClick} />
      <OutputRow bands={3} {...resistance} />
    </div>
  )
}