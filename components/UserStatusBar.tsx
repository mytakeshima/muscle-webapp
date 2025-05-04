"use client";

import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useEffect, useState } from "react";

export function UserStatusBar() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

  if (!user) return <div className="text-right p-2 text-sm text-gray-600">未ログイン</div>;

  return (
    <div className="flex justify-between items-center p-2 border-b">
      <span>こんにちは、{user.displayName} さん！</span>
      <button
        onClick={() => signOut(auth)}
        className="text-sm bg-red-500 text-white px-2 py-1 rounded"
      >
        ログアウト
      </button>
    </div>
  );
}
