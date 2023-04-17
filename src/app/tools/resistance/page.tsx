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

interface ColorCodesMapProps {
  bands: number,
  onClick: React.MouseEventHandler<HTMLButtonElement>,
  onChange: React.ChangeEventHandler<HTMLInputElement>
}

function ColorCodesMap({ bands, onClick, onChange }: ColorCodesMapProps) {
  const colorCodesMap = colorCodes.map(color => {
    return <ColorRow bands={bands} key={color.color} {...color} onClick={onClick} />
  })
  return (
    <>
      <p>Select the number of Bands</p>
      <span>4</span><input type="checkbox" name="bands" onChange={onChange}/><span>5</span>
      {colorCodesMap}
    </>
  )
}

interface Resistance {
  firstDigit: string,
  secondDigit: string,
  thirdDigit: string,
  multiplier: string,
  tolerance: string,
  bands?: number,
  units: string,
  onChange?: React.ChangeEventHandler<HTMLSelectElement>
}

// helper function to calculate the resistance range and give the correct units
function calculateResistance({ firstDigit, secondDigit, thirdDigit, multiplier, tolerance, units }: Resistance) {
  const digits = firstDigit + secondDigit + thirdDigit
  const totalResistance = Number(digits) * 10**Number(multiplier)

  // tolerance implies the actual resistance is higher or lower than the calculated value by that percentage
  let range = totalResistance * Number(tolerance) / 100
  let min = totalResistance - range
  let max = totalResistance + range

  // convert total resistance to required units
  if (units == 'milli') {
    min = min * 1000
    max = max * 1000
  }
  else if (units == 'kilo') {
    min = min / 1000
    max = max / 1000
  }
  else if (units == 'mega') {
    min = min / 1000000
    max = max / 1000000
  }

  // show appropriate units
  const unit = {
    default: '',
    milli: 'm',
    kilo: 'k',
    mega: 'M'
  }[units]
  
  return [totalResistance, min, max, unit]
}

function OutputRow({ firstDigit, secondDigit, thirdDigit, multiplier, tolerance, bands, units, onChange }: Resistance) {
  // get resistance range and SI unit
  const [totalR, min, max, unit] = calculateResistance({ firstDigit, secondDigit, thirdDigit, multiplier, tolerance, units })

  return (
    <div>
      {[...Array(bands)].map((_, i) => {
        return <span key={i}>{[firstDigit, secondDigit, thirdDigit][i]}</span>
      })}
      {multiplier && <span> &times; 10<sup>{multiplier}</sup></span>}
      {tolerance && <span>&plusmn;{tolerance}%</span>}
      <div>
        <span>Resistance: {totalR} &plusmn;{tolerance}%</span>
        <label>Pick a unit</label>
        <select name="resistance" defaultValue="default" onChange={onChange}>
          <option value="milli">m&#8486;</option>
          <option value="default">&#8486;</option>
          <option value="kilo">k&#8486;</option>
          <option value="mega">M&#8486;</option>
        </select>
      </div>
      <span>Resistance: {min} to {max} {unit}&#8486;</span>
    </div>
  )
}

export default function Resistance() {
  const initialResistance = {
    firstDigit: '',
    secondDigit: '',
    thirdDigit: '',
    multiplier: '',
    tolerance: ''
  }

  const [resistance, setResistance] = useState({...initialResistance})
  const [units, setUnits] = useState('default')
  const [bands, setBands] = useState(4)

  function handleColorButtonClick(e: React.MouseEvent<HTMLButtonElement>) {
    // clears the error: Property 'name' does not exist on type 'EventTarget'.
    const target = e.target as HTMLButtonElement
    setResistance({ ...resistance, [target.name]: target.value })
  }

  function handleUnitsChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const target = e.target as HTMLSelectElement
    setUnits(target.value)
  }

  function handleBandsChange(e: React.ChangeEvent<HTMLInputElement>) {
    // reset resistance if number of bands changes
    setResistance({...initialResistance})
    setBands(e.target.checked ? 5 : 4)
  }

  return (
    <div>
      <p>Testing the Resistance calculator page!</p>
      <button onClick={() => setResistance({...initialResistance})}>CLEAR</button>
      <ColorCodesMap bands={bands-2} onClick={handleColorButtonClick} onChange={handleBandsChange} />
      <OutputRow bands={bands-2} units={units} {...resistance} onChange={handleUnitsChange} />
    </div>
  )
}
