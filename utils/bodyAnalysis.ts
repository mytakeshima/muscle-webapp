// utils/bodyAnalysis.ts

export function calcBMI(weightKg: number, heightCm: number): number {
    const heightM = heightCm / 100;
    return +(weightKg / (heightM * heightM)).toFixed(1);
  }
  
  export function estimateSMM(
    bench1RM: number,
    squat1RM: number,
    deadlift1RM: number
  ): number {
    const average1RM = (bench1RM + squat1RM + deadlift1RM) / 3;
    const estimatedSMM = 18 + (average1RM - 50) * 0.15; // 仮の係数
    return +estimatedSMM.toFixed(1);
  }
  
  export function estimateBodyFat(
    weightKg: number,
    smmKg: number
  ): number {
    const leanMass = smmKg + 15; // 骨格筋以外の除脂肪組織
    const fatMass = weightKg - leanMass;
    const fatPercentage = (fatMass / weightKg) * 100;
    return +Math.max(5, Math.min(fatPercentage, 40)).toFixed(1);
  }
  
  export function classifyBodyType(bmi: number, fatPercent: number): string {
    if (bmi < 18.5) {
      if (fatPercent < 14) return "痩せ";
      if (fatPercent < 20) return "やや痩せ";
      return "-";
    } else if (bmi < 25) {
      if (fatPercent < 14) return "筋肉型スリム";
      if (fatPercent < 20) return "適正";
      return "隠れ肥満";
    } else {
      if (fatPercent < 14) return "アスリート";
      if (fatPercent < 20) return "過体重";
      return "肥満";
    }
  }
  