"use client";

import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function LoginPage() {
  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      alert(`ようこそ、${user.displayName}さん！`);
    } catch (error) {
      console.error("ログインに失敗しました", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">ログインして記録を始めましょう</h1>
      <button onClick={handleLogin} className="bg-blue-500 text-white px-4 py-2 rounded">
        Googleでログイン
      </button>
    </div>
  );
}
