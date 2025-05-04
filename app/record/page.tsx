"use client";

import { useEffect, useState } from "react";
import { WorkoutForm } from "@/components/WorkoutForm";
import { WorkoutList } from "@/components/WorkoutList";
import { WorkoutChart } from "@/components/WorkoutChart";
import { db, auth } from "@/lib/firebase";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export default function RecordPage() {
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [appliedStartDate, setAppliedStartDate] = useState("");
  const [appliedEndDate, setAppliedEndDate] = useState("");

  const fetchWorkouts = async () => {
    const user = auth.currentUser;
    if (!user) return;

    setLoading(true);

    const q = query(
      collection(db, "workouts"),
      where("uid", "==", user.uid),
      orderBy("date", "asc")
    );

    const snapshot = await getDocs(q);
    const data = snapshot.docs.map((doc) => {
      const d = doc.data();
      const dateObj = d.date.toDate();
      return {
        id: doc.id,
        date: dateObj,
        isoDate: dateObj.toISOString().slice(0, 10),
        exercise: d.exercise,
        weight: d.weight,
        reps: d.reps,
        uid: d.uid,
      };
    });

    setWorkouts(data);
    setLoading(false);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchWorkouts();
      } else {
        setWorkouts([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const filteredWorkouts = workouts.filter((w) => {
    if (appliedStartDate && w.isoDate < appliedStartDate) return false;
    if (appliedEndDate && w.isoDate > appliedEndDate) return false;
    return true;
  });

  // ✅ React 向けに文字列化した date をもつ配列を作成
  const listData = filteredWorkouts.map((w) => ({
    ...w,
    date:
      w.date instanceof Date
        ? w.date.toLocaleDateString("ja-JP", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          })
        : w.date,
  }));

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">筋トレ記録</h1>

      <WorkoutForm onSave={fetchWorkouts} />

      <div className="my-4 flex items-center gap-2">
        <label>開始日:</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border p-1"
        />
        <label>終了日:</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border p-1"
        />
        <button
          onClick={() => {
            setAppliedStartDate(startDate);
            setAppliedEndDate(endDate);
          }}
          className="bg-blue-500 text-white px-3 py-1 rounded"
        >
          適用
        </button>
        <button
          onClick={() => {
            setStartDate("");
            setEndDate("");
            setAppliedStartDate("");
            setAppliedEndDate("");
          }}
          className="bg-gray-500 text-white px-3 py-1 rounded"
        >
          全期間
        </button>
      </div>

      <WorkoutList workouts={listData} loading={loading} onDelete={fetchWorkouts} />
      <WorkoutChart workouts={listData} />
    </div>
  );
}
