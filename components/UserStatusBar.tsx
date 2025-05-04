// components/UserStatusBar.tsx

"use client";

import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

export function UserStatusBar() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<{
    height?: string;
    weight?: string;
    age?: string;
  }>({});

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        const docRef = doc(db, "users", u.uid);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          const data = snap.data();
          setProfile({
            height: data.height,
            weight: data.weight,
            age: data.age,
          });
        }
      }
    });
    return () => unsubscribe();
  }, []);

  if (!user) {
    return (
      <div className="text-right p-2 text-sm text-gray-600">
        未ログイン
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center p-2 border-b gap-2 text-sm">
      <div>
        <p>
          こんにちは、<strong>{user.displayName}</strong> さん！
        </p>
        {profile.height && profile.weight && profile.age && (
          <p className="text-gray-600">
            身長: {profile.height}cm ／ 体重: {profile.weight}kg ／ 年齢: {profile.age}歳
          </p>
        )}
      </div>
      <button
        onClick={() => signOut(auth)}
        className="text-sm bg-red-500 text-white px-3 py-1 rounded"
      >
        ログアウト
      </button>
    </div>
  );
}
