export default function ResultPanel({ result }: { result: { bench: number; squat: number; deadlift: number } }) {
    return (
      <div className="mt-6 p-4 border rounded shadow">
        <h2 className="text-lg font-bold mb-2">あなたの平均BIG3目標</h2>
        <p>ベンチプレス：{result.bench} kg</p>
        <p>スクワット：{result.squat} kg</p>
        <p>デッドリフト：{result.deadlift} kg</p>
  
        <div className="mt-4">
          <a href="/login" className="text-blue-600 underline">ログインして記録を始めましょう</a>
        </div>
      </div>
    );
  }
  