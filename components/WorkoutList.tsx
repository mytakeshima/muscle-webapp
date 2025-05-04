"use client";

import { useState, useEffect } from "react";

export type Workout = {
  id: string;
  date: string | Date;  // ← 柔軟に対応
  exercise: string;
  weight: number;
  reps: number;
};

type Props = {
  workouts: Workout[];
  loading: boolean;
  itemsPerPage?: number;
};

export function WorkoutList({ workouts, loading, itemsPerPage = 5 }: Props) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(workouts.length / itemsPerPage);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [totalPages]);

  const handlePrev = () => setCurrentPage((p) => Math.max(p - 1, 1));
  const handleNext = () => setCurrentPage((p) => Math.min(p + 1, totalPages));

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = workouts.slice(startIndex, startIndex + itemsPerPage);

  if (loading) return <p>読み込み中...</p>;

  return (
    <div className="my-6">
      <h2 className="text-lg font-bold mb-2">記録一覧</h2>

      {currentItems.length === 0 ? (
        <p>表示する記録がありません。</p>
      ) : (
        <ul className="space-y-2">
          {currentItems.map((w) => {
            const dateObj = typeof w.date === "string" ? new Date(w.date) : w.date;
            const dateStr = dateObj.toLocaleDateString("ja-JP", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            });

            return (
              <li
                key={w.id}
                className="border rounded p-3 shadow-sm bg-white text-sm"
              >
                <div className="font-semibold text-gray-800">{dateStr}</div>
                <div className="text-gray-700">
                  {w.exercise}：{w.weight}kg × {w.reps}回
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {totalPages > 1 && (
        <div className="mt-4 flex justify-center items-center space-x-4 text-sm">
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
          >
            ◀ 前
          </button>
          <span>
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
          >
            次 ▶
          </button>
        </div>
      )}
    </div>
  );
}
