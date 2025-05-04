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
import { onAuthStateChanged } from "firebase/auth"; // ✅ これを追加

export default function RecordPage() {
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [appliedStartDate, setAppliedStartDate] = useState("");
  const [appliedEndDate, setAppliedEndDate] = useState("");

  // データ取得
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
      const dateObj = d.date.toDate(); // Firebase Timestamp → JS Date
      return {
        id: doc.id,
        date: dateObj,
        isoDate: dateObj.toISOString().slice(0, 10), // YYYY-MM-DD
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
        fetchWorkouts(); // ← ログイン確認後に呼ぶ
      } else {
        setWorkouts([]);
      }
    });
  
    return () => unsubscribe();
  }, []);

  // フィルタリング
  const filteredWorkouts = workouts.filter((w) => {
    if (appliedStartDate && w.isoDate < appliedStartDate) return false;
    if (appliedEndDate && w.isoDate > appliedEndDate) return false;
    return true;
  });

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

      <WorkoutList workouts={filteredWorkouts} loading={loading} />
      <WorkoutChart workouts={filteredWorkouts} />
    </div>
  );
}
