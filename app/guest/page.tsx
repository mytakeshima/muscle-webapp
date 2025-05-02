import GuestForm from "@/components/GuestForm";
import ResultPanel from "@/components/ResultPanel";
import { useState } from "react";

export default function GuestPage() {
  const [result, setResult] = useState<{
    bench: number;
    squat: number;
    deadlift: number;
  } | null>(null);

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">あなたのBIG3目標を確認</h1>
      <GuestForm onCalculate={setResult} />
      {result && <ResultPanel result={result} />}
    </div>
  );
}
