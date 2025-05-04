"use client";

import { useState } from "react";
import { auth, db } from "@/lib/firebase";
import { addDoc, collection, Timestamp } from "firebase/firestore";

export function WorkoutForm({ onSave }: { onSave?: () => void }) {
  const [date, setDate] = useState("");
  const [exercise, setExercise] = useState("");
  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");
  const [saving, setSaving] = useState(false);

  // 選択式にするための種目一覧
  const exerciseOptions = ["ベンチプレス", "スクワット", "デッドリフト", "ショルダープレス"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) {
      alert("ログインしてください");
      return;
    }

    const parsedDate = date ? new Date(date) : null;
    if (!parsedDate || isNaN(parsedDate.getTime())) {
      alert("正しい日付を入力してください");
      return;
    }

    try {
      setSaving(true);
      await addDoc(collection(db, "workouts"), {
        uid: user.uid,
        date: Timestamp.fromDate(parsedDate),
        exercise,
        weight: Number(weight),
        reps: Number(reps),
        createdAt: Timestamp.now(),
      });

      alert("記録を保存しました！");
      if (onSave) onSave();

      // フォーム初期化
      setDate("");
      setExercise("");
      setWeight("");
      setReps("");
    } catch (error) {
      console.error("保存エラー:", error);
      alert("保存に失敗しました");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label>日付:</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          className="border p-1 w-full"
        />
      </div>

      <div>
        <label>種目:</label>
        <select
          value={exercise}
          onChange={(e) => setExercise(e.target.value)}
          required
          className="border p-1 w-full"
        >
          <option value="">-- 選択してください --</option>
          {exerciseOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>重量 (kg):</label>
        <input
          type="number"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          required
          className="border p-1 w-full"
        />
      </div>

      <div>
        <label>回数:</label>
        <input
          type="number"
          value={reps}
          onChange={(e) => setReps(e.target.value)}
          required
          className="border p-1 w-full"
        />
      </div>

      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded"
        disabled={saving}
      >
        {saving ? "保存中..." : "保存"}
      </button>
    </form>
  );
}
