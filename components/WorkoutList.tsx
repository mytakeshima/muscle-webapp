"use client";

import { useState } from "react";
import { db } from "@/lib/firebase";
import { doc, deleteDoc } from "firebase/firestore";

export type Workout = {
  id: string;
  date: string;
  exercise: string;
  weight: number;
  reps: number;
};

type Props = {
  workouts: Workout[];
  loading: boolean;
  itemsPerPage?: number;
  onDelete?: () => void; // ← 親から更新トリガー用に渡せるように
};

export function WorkoutList({ workouts, loading, itemsPerPage = 5, onDelete }: Props) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(workouts.length / itemsPerPage);

  const handlePrev = () => setCurrentPage((p) => Math.max(p - 1, 1));
  const handleNext = () => setCurrentPage((p) => Math.min(p + 1, totalPages));

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = workouts.slice(startIndex, startIndex + itemsPerPage);

  const handleDelete = async (id: string) => {
    const confirmed = confirm("この記録を削除しますか？");
    if (!confirmed) return;

    try {
      await deleteDoc(doc(db, "workouts", id));
      alert("削除しました");
      if (onDelete) onDelete(); // ← 親コンポーネントで fetchWorkouts を再実行
    } catch (error) {
      alert("削除に失敗しました");
      console.error("削除エラー:", error);
    }
  };

  if (loading) return <p>読み込み中...</p>;

  return (
    <div className="my-6">
      <h2 className="text-lg font-bold mb-2">記録一覧</h2>
      {currentItems.length === 0 ? (
        <p>表示する記録がありません。</p>
      ) : (
        <ul className="space-y-2">
          {currentItems.map((w) => (
            <li
              key={w.id}
              className="border rounded p-2 shadow-sm bg-white text-sm flex justify-between items-center"
            >
              <div>
                <span className="font-semibold">{w.date}</span> - {w.exercise}
                <br />
                {w.weight}kg × {w.reps}回
              </div>
              <button
                onClick={() => handleDelete(w.id)}
                className="text-red-600 hover:underline text-xs"
              >
                削除
              </button>
            </li>
          ))}
        </ul>
      )}

      {totalPages > 1 && (
        <div className="mt-4 flex justify-center items-center space-x-4">
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
