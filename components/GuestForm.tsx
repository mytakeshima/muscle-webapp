"use client";

import { useState } from "react";

export default function GuestForm({ onCalculate }: { onCalculate: (r: { bench: number; squat: number; deadlift: number }) => void }) {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("M");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const w = parseFloat(weight);
    const base = gender === "M" ? 1.0 : 0.75;
    onCalculate({
      bench: Math.round(base * w * 0.8),
      squat: Math.round(base * w * 1.2),
      deadlift: Math.round(base * w * 1.5),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input type="number" placeholder="身長（cm）" value={height} onChange={e => setHeight(e.target.value)} className="w-full p-2 border rounded" />
      <input type="number" placeholder="体重（kg）" value={weight} onChange={e => setWeight(e.target.value)} className="w-full p-2 border rounded" />
      <input type="number" placeholder="年齢（歳）" value={age} onChange={e => setAge(e.target.value)} className="w-full p-2 border rounded" />

      <div>
        <label className="mr-4"><input type="radio" value="M" checked={gender === "M"} onChange={() => setGender("M")} /> 男性</label>
        <label><input type="radio" value="F" checked={gender === "F"} onChange={() => setGender("F")} /> 女性</label>
      </div>

      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">平均BIG3を見る</button>
    </form>
  );
}
