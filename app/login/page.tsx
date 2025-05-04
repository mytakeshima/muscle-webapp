"use client";

import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      alert(`ようこそ、${user.displayName}さん！`);
      router.push("/record"); // ← ログイン後に /record に遷移！
    } catch (error) {
      console.error("ログインに失敗しました", error);
      alert("ログインできませんでした");
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
