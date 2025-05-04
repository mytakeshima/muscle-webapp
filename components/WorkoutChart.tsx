"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

type WorkoutData = {
  date: string; // 日付文字列（"YYYY-MM-DD"推奨）
  exercise: string;
  weight: number;
  reps: number;
};

type Props = {
  workouts: WorkoutData[];
};

export function WorkoutChart({ workouts }: Props) {
  const [selectedExercise, setSelectedExercise] = useState<string>("");
  const [exerciseOptions, setExerciseOptions] = useState<string[]>([]);

  useEffect(() => {
    if (workouts.length > 0) {
      const exercises = Array.from(new Set(workouts.map((w) => w.exercise)));
      setExerciseOptions(exercises);
      if (!selectedExercise && exercises.length > 0) {
        setSelectedExercise(exercises[0]);
      }
    }
  }, [workouts]);

  const filteredData = selectedExercise
    ? workouts
        .filter((w) => w.exercise === selectedExercise)
        .map((w) => {
          // ここでは文字列をそのまま使う（toLocaleDateStringはやめる）
          const oneRepMax = Math.round(w.weight * (1 + w.reps / 30));
          return {
            ...w,
            oneRepMax,
          };
        })
    : [];

  return (
    <div className="mt-8">
      <h2 className="text-lg font-bold mb-2">推定1RMの推移グラフ</h2>

      <div className="mb-4">
        <label className="mr-2">表示する種目:</label>
        <select
          value={selectedExercise}
          onChange={(e) => setSelectedExercise(e.target.value)}
          className="border p-1"
        >
          {exerciseOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      {filteredData.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={filteredData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
  dataKey="date"
  tickFormatter={(dateStr: string) => {
    // 日付を "MM/DD" 表記にする（または"YYYY/MM/DD"にしたい場合は調整）
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  }}
  interval={0}
  angle={-30}
  textAnchor="end"
  tick={{ fontSize: 12 }}
/>
            <YAxis unit="kg" />
            <Tooltip
  content={({ active, payload, label }) => {
    if (active && payload && payload.length > 0) {
      const data = payload[0].payload;
      const labelStr = typeof label === "string" ? label : new Date(label).toLocaleDateString("ja-JP");
      return (
        <div className="bg-white border p-2 shadow text-sm">
          <p>日付: {labelStr}</p>
          <p>推定1RM: {data.oneRepMax} kg</p>
          <p>重量: {data.weight} kg</p>
          <p>回数: {data.reps} 回</p>
        </div>
      );
    }
    return null;
  }}
/>

            <Line
              type="monotone"
              dataKey="oneRepMax"
              stroke="#82ca9d"
              name="推定1RM"
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <p>この種目の記録はまだありません。</p>
      )}
    </div>
  );
}
