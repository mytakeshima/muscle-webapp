// record/page.tsx

"use client";

import { useEffect, useState } from "react";
import { WorkoutForm } from "@/components/WorkoutForm";
import { WorkoutList } from "@/components/WorkoutList";
import { WorkoutChart } from "@/components/WorkoutChart";
import { db, auth } from "@/lib/firebase";
import { loginWithGoogle, logout } from "@/lib/auth";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
// 追加インポート
import Link from "next/link";
import { UserStatusBar } from "@/components/UserStatusBar";



export default function RecordPage() {
  const [user, setUser] = useState<any>(null);
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [appliedStartDate, setAppliedStartDate] = useState("");
  const [appliedEndDate, setAppliedEndDate] = useState("");

  const fetchWorkouts = async () => {
    if (!auth.currentUser) return;

    setLoading(true);
    const q = query(
      collection(db, "workouts"),
      where("uid", "==", auth.currentUser.uid),
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
      setUser(user);
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

  const listData = filteredWorkouts.map((w) => ({
    ...w,
    date: w.date.toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }),
  }));

  // 🔽 未ログインならログインボタンを表示
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-2xl font-bold mb-6">ログインしてください</h2>
        <button
          onClick={() => loginWithGoogle()}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Googleでログイン
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
    <UserStatusBar /> {/* ✅ 正しく追加 */}

    <div className="flex justify-between items-center mb-4">
      <h1 className="text-2xl font-bold">筋トレ記録</h1>
      <div className="space-x-4">
        <Link href="/profile" className="text-blue-600 underline text-sm">
          プロフィール設定
        </Link>
        
      </div>
    </div>


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
