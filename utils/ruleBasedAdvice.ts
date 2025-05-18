// utils/ruleBasedAdvice.ts

interface ProfileData {
  height: number;
  weight: number;
  age: number;
  bench1RM: number;
  squat1RM: number;
  deadlift1RM: number;
  injuryHistory?: string;
  concerns?: string[];
}

export function getTrainingAdvice(profile: ProfileData): {
  warnings: string[];
  suggestions: string[];
} {
  const warnings: string[] = [];
  const suggestions: string[] = [];

  const bmi = profile.weight / ((profile.height / 100) ** 2);

  // 1. 怪我歴に基づく警告
  if (profile.injuryHistory?.includes("肩")) {
    warnings.push("肩を強く使うトレーニング（ベンチプレスなど）には注意が必要です。");
    suggestions.push("肩周りの可動域改善と補助筋の強化を優先しましょう。")
  }
  if (profile.injuryHistory?.includes("膝")) {
    warnings.push("膝の負担が大きいスクワットなどは慎重に行ってください。");
    suggestions.push("膝周りの安定化トレーニング（レッグエクステンションなど）を推奨します。")
  }

  // 2. 体脂肪率/BMI に基づくアドバイス
  if (bmi > 27) {
    warnings.push("体重負荷が大きいため、ジャンプ系や高重量のスクワットは注意が必要です。");
    suggestions.push("体幹強化やマシントレーニングから始めましょう。");
  } else if (bmi < 18.5) {
    suggestions.push("筋肥大のために食事改善と漸進的な重量トレーニングを推奨します。");
  }

  // 懸念点（修正＋追加済）
  if (profile.concerns?.includes("柔軟性不足")) {
    suggestions.push("トレーニング前のストレッチ・ダイナミックウォームアップを取り入れましょう。");
  }

  if (profile.concerns?.includes("関節の不安")) {
    warnings.push("関節に負担がかかる高重量トレーニングは注意が必要です。");
    suggestions.push("フォーム重視・低重量高回数のトレーニングから始めましょう。");
  }

  if (profile.concerns?.includes("過去の怪我の再発")) {
    warnings.push("過去の怪我箇所に無理な負荷をかけると再発の可能性があります。");
    suggestions.push("事前に十分なウォームアップと軽い負荷で様子を見ることが重要です。");
  }

  if (profile.concerns?.includes("フォームに自信がない")) {
    suggestions.push("ミラーの前でのフォーム確認やトレーナーによるチェックを検討しましょう。");
  }

  if (profile.concerns?.includes("重さを扱うのが怖い")) {
    suggestions.push("スミスマシンやマシントレを活用して安全に始めましょう。");
  }
  return { warnings, suggestions };
}
