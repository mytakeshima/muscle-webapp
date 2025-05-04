// BodyTypeChart.tsx

import React from "react";
import {
  ScatterChart,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  Scatter,
  Label,
  ReferenceArea,
} from "recharts";

interface Props {
  bmi: number;
  bodyFat: number;
}

const zones = [
  { x1: 0, x2: 14, y1: 25, y2: 30, label: "筋肉型", color: "#e0f7fa" },
  { x1: 14, x2: 20, y1: 25, y2: 30, label: "適正", color: "#e8f5e9" },
  { x1: 20, x2: 30, y1: 25, y2: 30, label: "やや肥満", color: "#fff8e1" },
  { x1: 0, x2: 14, y1: 18.5, y2: 25, label: "筋肉型スリム", color: "#fce4ec" },
  { x1: 14, x2: 20, y1: 18.5, y2: 25, label: "スリム", color: "#f3e5f5" },
  { x1: 20, x2: 30, y1: 18.5, y2: 25, label: "隠れ肥満", color: "#ede7f6" },
  { x1: 0, x2: 14, y1: 0, y2: 18.5, label: "痩せ", color: "#fbe9e7" },
  { x1: 14, x2: 20, y1: 0, y2: 18.5, label: "やや痩せ", color: "#e1f5fe" },
];

export const BodyTypeChart: React.FC<Props> = ({ bmi, bodyFat }) => {
  const data = [{ x: bodyFat, y: bmi }];

  return (
    <ScatterChart width={400} height={400} margin={{ top: 20, right: 20, bottom: 40, left: 40 }}>
      <CartesianGrid />
      <XAxis type="number" dataKey="x" domain={[10, 30]}>
        <Label value="体脂肪率 (%)" position="bottom" offset={0} />
      </XAxis>
      <YAxis type="number" dataKey="y" domain={[15, 30]}>
        <Label value="BMI" angle={-90} position="insideLeft" offset={-5} />
      </YAxis>
      <Tooltip cursor={{ strokeDasharray: "3 3" }} />

      {zones.map((zone, index) => (
        <ReferenceArea
          key={index}
          x1={zone.x1}
          x2={zone.x2}
          y1={zone.y1}
          y2={zone.y2}
          strokeOpacity={0}
          fill={zone.color}
        >
          <Label
            value={zone.label}
            position="center"
            fontSize={12}
            fill="#000"
          />
        </ReferenceArea>
      ))}

      <Scatter name="Your Data" data={data} fill="#000" shape="star" />
    </ScatterChart>
  );
};
