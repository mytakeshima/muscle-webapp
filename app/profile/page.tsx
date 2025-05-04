// app/profile/page.tsx

"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { loginWithGoogle } from "@/lib/auth";
import Link from "next/link";
import { UserStatusBar } from "@/components/UserStatusBar";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [age, setAge] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setHeight(data.height || "");
          setWeight(data.weight || "");
          setAge(data.age || "");
          setIsSaved(true);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSave = async () => {
    if (!user) return;

    await setDoc(doc(db, "users", user.uid), {
      height,
      weight,
      age,
    });

    setIsSaved(true);
    alert("プロフィール情報を保存しました！");
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-2xl font-bold mb-4">ログインしてください</h2>
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
    <div className="p-6 max-w-md mx-auto">
      <UserStatusBar /> {/* ← ユーザーステータスバーを追加 */}

      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">プロフィール情報</h1>
        <Link href="/record" className="text-blue-600 underline text-sm">
          記録ページへ戻る
        </Link>
      </div>

      <div className="space-y-4">
        <input
          type="number"
          placeholder="身長 (cm)"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
          className="w-full border p-2"
        />
        <input
          type="number"
          placeholder="体重 (kg)"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          className="w-full border p-2"
        />
        <input
          type="number"
          placeholder="年齢"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          className="w-full border p-2"
        />
        <button
          onClick={handleSave}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          {isSaved ? "変更を保存" : "保存"}
        </button>
      </div>
    </div>
  );
}
