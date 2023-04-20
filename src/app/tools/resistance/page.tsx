"use client";
import { redirect } from "next/dist/server/api-utils";
import { Inter } from "next/font/google";
import { useState } from "react";

interface ColorCodes {
  color: string;
  value: number | null;
  tolerance: number | null;
}

const colorCodes: ColorCodes[] = [
  { color: "black", value: 0, tolerance: null },
  { color: "brown", value: 1, tolerance: 1 },
  { color: "red", value: 2, tolerance: 2 },
  { color: "orange", value: 3, tolerance: null },
  { color: "yellow", value: 4, tolerance: null },
  { color: "green", value: 5, tolerance: 0.5 },
  { color: "blue", value: 6, tolerance: 0.25 },
  { color: "violet", value: 7, tolerance: 0.1 },
  { color: "gray", value: 8, tolerance: 0.05 },
  { color: "white", value: 9, tolerance: null },
  { color: "gold", value: -1, tolerance: 5 },
  { color: "silver", value: -2, tolerance: 10 },
  { color: "none", value: null, tolerance: 20 },
];

interface ColorCodeProps extends ColorCodes {
  bands: number;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}
// bg-violet-500 hover:bg-violet-600 active:bg-violet-700 focus:outline-none focus:ring focus:ring-violet-300
function bgColor(color: string) {
  const backgroundColors: { [key: string]: string } = {
    black:
      "bg-gray-900 hover:bg-gray-700 active:bg-gray-700 focus:outline-none focus:ring focus:ring-gray-500 text-white p-1",
    brown:
      "bg-orange-900 hover:bg-orange-800 active:bg-orange-800 focus:outline-none focus:ring focus:ring-orange-300 text-white p-1",
    red: "bg-red-600 hover:bg-red-500 active:bg-red-500 focus:outline-none focus:ring focus:ring-red-300 text-white p-1",
    orange:
      "bg-orange-500 hover:bg-orange-600 active:bg-orange-600 focus:outline-none focus:ring focus:ring-orange-300 text-white p-1",
    yellow:
      "bg-amber-300 hover:bg-amber-500 active:bg-amber-500 focus:outline-none focus:ring focus:ring-amber-500 text-gray-500 p-1",
    green:
      "bg-green-500 hover:bg-green-700 active:bg-green-700 focus:outline-none focus:ring focus:ring-green-300 text-white p-1",
    blue: "bg-blue-500 hover:bg-blue-700 active:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300 text-white p-1",
    violet:
      "bg-violet-500 hover:bg-violet-700 active:bg-violet-700 focus:outline-none focus:ring focus:ring-violet-300 text-white p-1",
    gray: "bg-gray-300 hover:bg-gray-500 active:bg-gray-500 focus:outline-none focus:ring focus:ring-gray-500 text-gray-700 hover:text-white p-1",
    white:
      "bg-white hover:bg-gray-200 active:bg-gray-200 focus:outline-none focus:ring focus:ring-gray-300 text-gray-700 p-1",
    silver:
      "bg-slate-400 hover:bg-slate-500 active:bg-slate-500 focus:outline-none focus:ring focus:ring-slate-300 text-gray-700 p-1",
    gold: "bg-yellow-600 hover:bg-amber-600 active:bg-amber-600 focus:outline-none focus:ring focus:ring-amber-300 text-white p-1",
    none: "hover:bg-gray-200 active:bg-gray-200 focus:outline-none focus:ring focus:ring-gray-300 p-1",
  };
  return backgroundColors[color];
}

const bandsGrid: { [key: number]: string } = {
  2: "grid-cols-5",
  3: "grid-cols-6",
};

function ColorRow({ bands, color, value, tolerance, onClick }: ColorCodeProps) {
  return (
    <div className={`my-3 grid gap-4 ${bandsGrid[bands]}`}>
      <span className="capitalize">{color}</span>
      {[...Array(bands)].map((_, i) => {
        if (value === null)
          return (
            <button key={i} disabled>
              {""}
            </button>
          );
        else if (value < 0)
          return (
            <button key={i} disabled>
              {""}
            </button>
          );
        return (
          <button
            key={i}
            onClick={onClick}
            value={value}
            name={["firstDigit", "secondDigit", "thirdDigit"][i]}
            className={`${bgColor(color)} rounded`}
          >
            {value}
          </button>
        );
      })}
      {value === null ? (
        <span></span>
      ) : (
        <button
          onClick={onClick}
          value={value}
          name="multiplier"
          className={`${bgColor(color)} rounded p-1`}
        >
          10<sup>{value}</sup>
        </button>
      )}
      {tolerance && (
        <button
          onClick={onClick}
          value={tolerance}
          name="tolerance"
          className={`${bgColor(color)} rounded p-1 text-sm`}
        >
          &plusmn;{tolerance}%
        </button>
      )}
    </div>
  );
}

interface ColorCodesMapProps {
  bands: number;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}

function ColorCodesMap({ bands, onClick }: ColorCodesMapProps) {
  const colorCodesMap = colorCodes.map((color) => {
    return (
      <ColorRow bands={bands} key={color.color} {...color} onClick={onClick} />
    );
  });
  return <>{colorCodesMap}</>;
}

interface Resistance {
  firstDigit: string;
  secondDigit: string;
  thirdDigit: string;
  multiplier: string;
  tolerance: string;
  bands?: number;
  units?: string;
  onChange?: React.ChangeEventHandler<HTMLSelectElement>;
}

// helper function to calculate the resistance range and give the correct units
function calculateResistance({
  firstDigit,
  secondDigit,
  thirdDigit,
  multiplier,
  tolerance,
  units,
}: Resistance) {
  const digits = firstDigit + secondDigit + thirdDigit;
  const totalResistance = Number(digits) * 10 ** Number(multiplier);

  // tolerance implies the actual resistance is higher or lower than the calculated value by that percentage
  let range = (totalResistance * Number(tolerance)) / 100;
  let min = totalResistance - range;
  let max = totalResistance + range;

  // convert total resistance to required units
  if (units == "milli") {
    min = min * 1000;
    max = max * 1000;
  } else if (units == "kilo") {
    min = min / 1000;
    max = max / 1000;
  } else if (units == "mega") {
    min = min / 1000000;
    max = max / 1000000;
  }

  // show appropriate units
  const unit = units
    ? {
        default: "",
        milli: "m",
        kilo: "k",
        mega: "M",
      }[units]
    : "";

  return [totalResistance, min, max, unit];
}

function getColor(value = '', tolerance = '') {
  for (const item of colorCodes) {
    const color = Object.values(item)
    if (value && color.includes(Number(value))) return bgColor(item.color);
    // temporary fix for issue #1
    if (tolerance == '5') return bgColor('gold')
    else if (tolerance && color.includes(Number(tolerance))) return bgColor(item.color);
  }
}

function OutputRow({
  firstDigit,
  secondDigit,
  thirdDigit,
  multiplier,
  tolerance,
  bands,
  units,
  onChange,
}: Resistance) {
  // get resistance, range and SI unit
  const [totalR, min, max, unit] = calculateResistance({
    firstDigit,
    secondDigit,
    thirdDigit,
    multiplier,
    tolerance,
    units,
  });

  return (
    <div>
      <div
        className={`my-3 grid gap-4 border-t border-t-gray-300 p-3 ${
          bands && bandsGrid[bands]
        }`}
      >
        <span>{""}</span>
        {firstDigit ? (
          <span className={`${getColor(firstDigit, '')} text-center`}>
            {firstDigit}
          </span>
        ) : (
          <span>{""}</span>
        )}
        {secondDigit ? (
          <span className={`${getColor(secondDigit, '')} text-center`}>
            {secondDigit}
          </span>
        ) : (
          <span>{""}</span>
        )}
        {bands == 3 && thirdDigit ? (
          <span className={`${getColor(thirdDigit,'')} text-center`}>
            {thirdDigit}
          </span>
        ) : (
          ""
        )}
        {multiplier ? (
          <span className={`${getColor(multiplier, '')} text-center`}>
            &times;10<sup>{multiplier}</sup>
          </span>
        ) : (
          <span>{""}</span>
        )}
        {tolerance ? (
          <span className={`${getColor('', tolerance)} text-center`}>
            &plusmn;{tolerance}%
          </span>
        ) : (
          <span>{""}</span>
        )}
      </div>
      <div className="flex w-full items-center">
        <span className="w-1/5">Total </span>
        <div className="flex w-4/5 items-center justify-end rounded border border-gray-300">
          <span className="">
            {totalR} {tolerance && <>&plusmn; {tolerance}%</>}
          </span>
          <select
            name="resistance"
            defaultValue="default"
            onChange={onChange}
            className="ml-5 py-2"
          >
            <option value="milli">m&#8486;</option>
            <option value="default">&#8486;</option>
            <option value="kilo">k&#8486;</option>
            <option value="mega">M&#8486;</option>
          </select>
        </div>
      </div>
      <div className="align-center mt-5 flex w-full">
        <span className="mr-4 w-1/5 p-1">Range </span>
        <div className="flex w-4/5 justify-between">
          <span>{min}</span>
          <span>to</span>
          <span>
            {max} {unit}&#8486;
          </span>
        </div>
      </div>
    </div>
  );
}

export default function Resistance() {
  const initialResistance = {
    firstDigit: "",
    secondDigit: "",
    thirdDigit: "",
    multiplier: "",
    tolerance: "",
  };

  const [resistance, setResistance] = useState({ ...initialResistance });
  const [units, setUnits] = useState("default");
  const [bands, setBands] = useState(4);

  function handleColorButtonClick(e: React.MouseEvent<HTMLButtonElement>) {
    // clears the error: Property 'name' does not exist on type 'EventTarget'.
    const target = e.target as HTMLButtonElement;
    setResistance({ ...resistance, [target.name]: target.value });
  }

  function handleUnitsChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const target = e.target as HTMLSelectElement;
    setUnits(target.value);
  }

  function handleBandsChange(e: React.ChangeEvent<HTMLInputElement>) {
    // reset resistance if number of bands changes
    setResistance({ ...initialResistance });
    setBands(e.target.checked ? 5 : 4);
  }

  return (
    <div className="m-auto min-h-screen max-w-md">
      <h2 className="flex flex-row justify-center border-b border-b-gray-300 text-3xl/loose font-medium">
        Resistance calculator
      </h2>
      <div className="mb-10 flex gap-1">
        <hr className="w-1/3 border-8 border-red-600 hover:w-3/4" />
        <hr className="w-1/3 border-8 border-green-500 hover:w-3/4" />
        <hr className="w-1/3 border-8 border-blue-500 hover:w-3/4" />
      </div>
      <div className="mb-10 flex flex-row justify-around">
        <div className="flex flex-row justify-between">
          <span className="mx-5">Bands</span>
          <button className="h-8 w-8 rounded-full bg-red-500" disabled>
            4
          </button>
          <div className="relative mx-3 flex h-8 w-24 flex-row content-center shadow-inner">
            <input
              id="toggle"
              type="checkbox"
              name="bands"
              onChange={handleBandsChange}
              className="peer hidden"
            />
            <label
              htmlFor="toggle"
              className="absolute h-full w-full cursor-pointer rounded-full bg-red-500 shadow transition duration-500 before:absolute before:h-8 before:w-8 before:rounded-full before:bg-white before:transition before:duration-500 peer-checked:bg-blue-400 peer-checked:before:translate-x-16"
            ></label>
          </div>
          <button className="h-8 w-8 rounded-full bg-blue-400" disabled>
            5
          </button>
        </div>
        <button
          onClick={() => setResistance({ ...initialResistance })}
          className="rounded bg-red-600 px-2 hover:bg-red-500 focus:outline-none focus:ring focus:ring-red-300 active:bg-red-500"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="white"
            className=""
            viewBox="0 0 16 16"
          >
            <path
              fillRule="evenodd"
              d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2v1z"
            />
            <path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466z" />
          </svg>
        </button>
      </div>
      <div>
        <ColorCodesMap bands={bands - 2} onClick={handleColorButtonClick} />
        <OutputRow
          bands={bands - 2}
          units={units}
          {...resistance}
          onChange={handleUnitsChange}
        />
      </div>
    </div>
  );
}
