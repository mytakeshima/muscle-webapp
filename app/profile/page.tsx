// app/profile/page.tsx
"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { loginWithGoogle, logout } from "@/lib/auth";
import Link from "next/link";
import {
  calcBMI,
  estimateSMM,
  estimateBodyFat,
  classifyBodyType,
} from "@/utils/bodyAnalysis";
import { BodyTypeChart } from "@/components/BodyTypeChart";
import { getTrainingAdvice } from "@/utils/ruleBasedAdvice"; // 追加

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [age, setAge] = useState("");
  const [bench1RM, setBench1RM] = useState("");
  const [squat1RM, setSquat1RM] = useState("");
  const [deadlift1RM, setDeadlift1RM] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [injuryHistory, setInjuryHistory] = useState("");
  const [concerns, setConcerns] = useState<string[]>([]);
  const [advice, setAdvice] = useState<string[]>([]); // 追加

  const concernOptions = [
    "関節の不安",
    "過去の怪我の再発",
    "柔軟性不足",
    "フォームに自信がない",
    "重さを扱うのが怖い",
  ];

  const toggleConcern = (item: string) => {
    setConcerns((prev) =>
      prev.includes(item) ? prev.filter((c) => c !== item) : [...prev, item]
    );
  };

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
          setBench1RM(data.bench1RM || "");
          setSquat1RM(data.squat1RM || "");
          setDeadlift1RM(data.deadlift1RM || "");
          setInjuryHistory(data.injuryHistory || "");
          setConcerns(data.concerns || []);
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
      bench1RM,
      squat1RM,
      deadlift1RM,
      injuryHistory,
      concerns,
    });
   const newAdvice = getTrainingAdvice({
    height: parseFloat(height),
    weight: parseFloat(weight),
    age: parseInt(age),
    bench1RM: parseFloat(bench1RM),
    squat1RM: parseFloat(squat1RM),
    deadlift1RM: parseFloat(deadlift1RM),
    injuryHistory,
    concerns,
  });

  setAdvice([...newAdvice.warnings, ...newAdvice.suggestions]);
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

  const numericHeight = parseFloat(height);
  const numericWeight = parseFloat(weight);
  const numericBench = parseFloat(bench1RM);
  const numericSquat = parseFloat(squat1RM);
  const numericDeadlift = parseFloat(deadlift1RM);

  const smm = estimateSMM(numericBench, numericSquat, numericDeadlift);
  const fat = estimateBodyFat(numericWeight, smm);
  const bmi = calcBMI(numericWeight, numericHeight);
  const bodyType = classifyBodyType(bmi, fat);

  

  return (
    <div className="p-6 max-w-md mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">プロフィール情報</h1>
        <div className="space-x-4">
          <Link href="/record" className="text-blue-600 underline text-sm">
            記録ページへ戻る
          </Link>
          <button onClick={() => logout()} className="text-red-500 text-sm underline">
            ログアウト
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <input type="number" placeholder="身長 (cm)" value={height} onChange={(e) => setHeight(e.target.value)} className="w-full border p-2" />
        <input type="number" placeholder="体重 (kg)" value={weight} onChange={(e) => setWeight(e.target.value)} className="w-full border p-2" />
        <input type="number" placeholder="年齢" value={age} onChange={(e) => setAge(e.target.value)} className="w-full border p-2" />
        <input type="number" placeholder="ベンチプレス1RM (kg)" value={bench1RM} onChange={(e) => setBench1RM(e.target.value)} className="w-full border p-2" />
        <input type="number" placeholder="スクワット1RM (kg)" value={squat1RM} onChange={(e) => setSquat1RM(e.target.value)} className="w-full border p-2" />
        <input type="number" placeholder="デッドリフト1RM (kg)" value={deadlift1RM} onChange={(e) => setDeadlift1RM(e.target.value)} className="w-full border p-2" />

        <textarea placeholder="怪我歴（例: 左膝靭帯損傷 2022年）" value={injuryHistory} onChange={(e) => setInjuryHistory(e.target.value)} className="w-full border p-2" />

        <div>
          <p className="font-semibold mb-2">トレーニングに関する懸念点:</p>
          <div className="flex flex-col gap-1">
            {concernOptions.map((option) => (
              <label key={option} className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={concerns.includes(option)}
                  onChange={() => toggleConcern(option)}
                  className="mr-2"
                />
                {option}
              </label>
            ))}
          </div>
        </div>

        <button onClick={handleSave} className="bg-green-500 text-white px-4 py-2 rounded">
          {isSaved ? "変更を保存" : "保存"}
        </button>
      </div>

      {height && weight && bench1RM && squat1RM && deadlift1RM && (
        <div className="mt-8 p-4 border rounded">
          <h2 className="text-lg font-semibold mb-2">推定データ</h2>
          <p>骨格筋量: {smm} kg</p>
          <p>体脂肪率: {fat} %</p>
          <p>BMI: {bmi.toFixed(1)}</p>
          <p>体型分類: {bodyType}</p>
          <div className="mt-6">
            <BodyTypeChart bmi={bmi} bodyFat={fat} />
          </div>
        </div>
      )}

      {advice.length > 0 && (
        <div className="mt-6 p-4 border rounded bg-yellow-50">
          <h2 className="text-md font-semibold mb-2">⚠️ アドバイス</h2>
          <ul className="list-disc ml-6 text-sm">
            {advice.map((a, i) => (
              <li key={i}>{a}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
