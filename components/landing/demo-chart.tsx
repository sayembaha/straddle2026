// Illustrative chart used on the landing page. The shapes follow the real CPI and
// Fed funds path but the values are approximate, and the chart says so.
const CPI = [2.3, 1.0, 1.4, 5.4, 7.5, 9.1, 6.4, 3.0, 3.1, 3.0, 2.9, 2.7, 2.6];
const FED = [1.6, 0.1, 0.1, 0.1, 0.1, 1.6, 4.3, 5.0, 5.2, 5.2, 4.2, 4.0, 3.6];

const X0 = 36;
const DX = 654 / 12;
const Y0 = 118;
const UNIT = 10.5;
const px = (i: number) => X0 + i * DX;
const py = (v: number) => Y0 - v * UNIT;
const path = (a: number[]) =>
  a.map((v, i) => `${i ? "L" : "M"}${px(i).toFixed(1)} ${py(v).toFixed(1)}`).join(" ");

export default function DemoChart() {
  return (
    <svg
      viewBox="0 0 700 150"
      className="block h-auto w-full"
      role="img"
      aria-label="Line chart comparing US CPI year on year with the Fed funds rate from 2020 to 2026. CPI peaks near 9 percent in 2022 then settles near 3 percent. The funds rate rises from near zero to above 5 percent and eases only slightly."
    >
      {[0, 2, 4, 6, 8, 10].map((v) => (
        <g key={v}>
          <line x1={X0} x2={690} y1={py(v)} y2={py(v)} stroke="#E4EAF2" strokeWidth={1} />
          <text x={28} y={py(v) + 4} textAnchor="end" fontSize={10.5} fill="#52637A" fontFamily="IBM Plex Mono, monospace">
            {v}
          </text>
        </g>
      ))}
      {[
        [0, "2020", "start"],
        [4, "2022", "middle"],
        [8, "2024", "middle"],
        [12, "2026", "end"],
      ].map(([i, label, anchor]) => (
        <text
          key={label as string}
          x={px(i as number)}
          y={140}
          textAnchor={anchor as "start" | "middle" | "end"}
          fontSize={10.5}
          fill="#52637A"
          fontFamily="IBM Plex Mono, monospace"
        >
          {label}
        </text>
      ))}
      <path d={path(FED)} fill="none" stroke="#7FA3D1" strokeWidth={2.6} strokeLinejoin="round" strokeLinecap="round" />
      <path d={path(CPI)} fill="none" stroke="#0B1F3A" strokeWidth={2.6} strokeLinejoin="round" strokeLinecap="round" />
      <text x={322} y={22} fontSize={12} fontWeight={500} fill="#0B1F3A" fontFamily="Inter, sans-serif">
        CPI, year on year
      </text>
      <text x={470} y={52} fontSize={12} fontWeight={500} fill="#3F6DA6" fontFamily="Inter, sans-serif">
        Fed funds rate
      </text>
    </svg>
  );
}
