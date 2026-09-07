import { useMemo, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Sector } from "recharts";
import { BookOpen } from "lucide-react";

interface Transaction {
  date: string;
  type: string;
  amount: number;
  categories?: { name: string } | null;
}

interface ExpensePieChartProps {
  transactions: Transaction[];
  totalBalance?: number;
  onCategorySelect?: (category: string | null) => void;
  selectedCategory?: string | null;
}

const COLORS = [
  "hsl(252, 56%, 57%)",
  "hsl(340, 65%, 50%)",
  "hsl(152, 55%, 38%)",
  "hsl(30, 80%, 55%)",
  "hsl(200, 70%, 50%)",
  "hsl(280, 50%, 55%)",
  "hsl(45, 85%, 50%)",
  "hsl(170, 60%, 42%)",
];

interface ActiveShapeProps {
  cx: number;
  cy: number;
  innerRadius: number;
  outerRadius: number;
  startAngle: number;
  endAngle: number;
  fill: string;
}

const renderActiveShape = (props: unknown) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props as ActiveShapeProps;
  return (
    <Sector
      cx={cx}
      cy={cy}
      innerRadius={innerRadius - 2}
      outerRadius={outerRadius + 6}
      startAngle={startAngle}
      endAngle={endAngle}
      fill={fill}
      style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))' }}
    />
  );
};

const ExpensePieChart = ({ transactions, totalBalance = 0, onCategorySelect, selectedCategory }: ExpensePieChartProps) => {
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);

  const chartData = useMemo(() => {
    const map = new Map<string, number>();
    transactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        const cat = (t.categories as { name?: string } | null)?.name || "অন্যান্য";
        map.set(cat, (map.get(cat) || 0) + t.amount);
      });

    const sorted = Array.from(map.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    // Group beyond 5 into "অন্যান্য"
    if (sorted.length > 5) {
      const top5 = sorted.slice(0, 5);
      const othersTotal = sorted.slice(5).reduce((s, d) => s + d.value, 0);
      if (othersTotal > 0) top5.push({ name: "অন্যান্য", value: othersTotal });
      return top5;
    }
    return sorted;
  }, [transactions]);

  const total = chartData.reduce((s, d) => s + d.value, 0);

  if (chartData.length === 0) {
    return (
      <div
        className="premium-card p-4 lg:p-5 mb-4 animate-fade-in-up flex flex-col items-center justify-center text-center relative overflow-hidden"
        style={{
          background: 'linear-gradient(145deg, rgba(124, 58, 237, 0.05) 0%, rgba(139, 92, 246, 0.02) 50%, rgba(168, 85, 247, 0.06) 100%)',
          borderColor: 'rgba(124, 58, 237, 0.18)',
        }}
      >
        <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center mb-2.5">
          <svg className="w-5 h-5 text-purple-600 dark:text-purple-400 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
          </svg>
        </div>
        <h3 className="text-sm font-bold text-foreground mb-1">কোনো খরচের তথ্য নেই</h3>
        <p className="text-xs text-muted-foreground max-w-[200px]">
          খরচের লেনদেন যোগ করলে এখানে আপনার খরচের বিশ্লেষণ দেখা যাবে।
        </p>
      </div>
    );
  }

  const handleClick = (_: unknown, index: number) => {
    const cat = chartData[index]?.name;
    if (onCategorySelect) {
      if (selectedCategory === cat) {
        onCategorySelect(null);
        setActiveIndex(undefined);
      } else {
        onCategorySelect(cat);
        setActiveIndex(index);
      }
    }
  };

  return (
    <div
      className="premium-card p-5 lg:p-6 mb-4 animate-fade-in-up relative overflow-hidden"
      style={{
        background: 'linear-gradient(145deg, rgba(124, 58, 237, 0.06) 0%, rgba(139, 92, 246, 0.025) 45%, rgba(168, 85, 247, 0.07) 100%)',
        borderColor: 'rgba(124, 58, 237, 0.2)',
      }}
    >
      {/* Ambient soft light purple atmospheric glow / background shade */}
      <div
        className="absolute -top-16 -right-14 w-52 h-52 rounded-full pointer-events-none blur-3xl opacity-40 dark:opacity-25"
        style={{ background: 'radial-gradient(circle, #8b5cf6 0%, transparent 70%)' }}
      />
      <div
        className="absolute -bottom-14 -left-12 w-48 h-48 rounded-full pointer-events-none blur-3xl opacity-30 dark:opacity-20"
        style={{ background: 'radial-gradient(circle, #a855f7 0%, transparent 70%)' }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full pointer-events-none blur-3xl opacity-20 dark:opacity-15"
        style={{ background: 'radial-gradient(circle, #c084fc 0%, transparent 65%)' }}
      />

      {/* Watermark 1: Very subtle, faint Open Book watermark at left side */}
      <div
        className="absolute -bottom-6 -left-6 sm:-left-4 sm:-bottom-4 w-48 h-48 sm:w-56 sm:h-56 pointer-events-none select-none z-0 transform -rotate-12"
        style={{ color: '#7c3aed', opacity: 0.07 }}
      >
        <svg
          viewBox="0 0 200 200"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-full h-full"
        >
          {/* Open Book spine & outer contour */}
          <path d="M 20 160 Q 60 148 100 156 Q 140 148 180 160 L 180 44 Q 140 32 100 40 Q 60 32 20 44 Z" />
          <line x1="100" y1="40" x2="100" y2="156" />
          {/* Subtle page lines on left page */}
          <path d="M 32 66 Q 64 54 90 62" strokeWidth="0.8" />
          <path d="M 32 86 Q 64 74 90 82" strokeWidth="0.8" />
          <path d="M 32 106 Q 64 94 90 102" strokeWidth="0.8" />
          <path d="M 32 126 Q 64 114 90 122" strokeWidth="0.8" />
          {/* Subtle page lines on right page */}
          <path d="M 110 62 Q 136 54 168 66" strokeWidth="0.8" />
          <path d="M 110 82 Q 136 74 168 86" strokeWidth="0.8" />
          <path d="M 110 102 Q 136 94 168 106" strokeWidth="0.8" />
          <path d="M 110 122 Q 136 114 168 126" strokeWidth="0.8" />
        </svg>
      </div>

      {/* Watermark 2: Very subtle, faint Ascending Bar Chart with Sparkles at right side */}
      <div
        className="absolute -bottom-4 -right-4 sm:-right-2 w-40 h-40 sm:w-48 sm:h-48 pointer-events-none select-none z-0"
        style={{ color: '#7c3aed', opacity: 0.07 }}
      >
        <svg
          viewBox="0 0 120 120"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-full h-full"
        >
          {/* Ascending columns */}
          <rect x="10" y="75" width="20" height="42" rx="3" strokeWidth="1.2" />
          <rect x="38" y="52" width="20" height="65" rx="3" strokeWidth="1.2" />
          <rect x="66" y="30" width="20" height="87" rx="3" strokeWidth="1.2" />
          <rect x="94" y="10" width="20" height="107" rx="3" strokeWidth="1.2" />
          {/* Delicate sparkle stars */}
          <path d="M22 45 Q22 50 25 50 Q22 50 22 55 Q22 50 19 50 Q22 50 22 45 Z" fill="currentColor" />
          <path d="M52 26 Q52 31 55 31 Q52 31 52 36 Q52 31 49 31 Q52 31 52 26 Z" fill="currentColor" />
          <path d="M86 6 Q86 11 89 11 Q86 11 86 16 Q86 11 83 11 Q86 11 86 6 Z" fill="currentColor" />
        </svg>
      </div>

      <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider mb-4 relative z-10" style={{ color: '#7c3aed' }}>খরচের বিশ্লেষণ</h3>
      <div className="flex items-center justify-center mb-4 relative z-10">
        <div className="relative w-48 h-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={52}
                outerRadius={80}
                dataKey="value"
                stroke="none"
                paddingAngle={3}
                activeIndex={activeIndex}
                activeShape={renderActiveShape}
                onClick={handleClick}
                style={{ cursor: 'pointer' }}
              >
                {chartData.map((_, i) => (
                  <Cell
                    key={i}
                    fill={COLORS[i % COLORS.length]}
                    opacity={selectedCategory && chartData[i].name !== selectedCategory ? 0.3 : 1}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: 'hsl(var(--popover))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '12px',
                  fontSize: '11px',
                  color: 'hsl(var(--popover-foreground))',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                }}
                itemStyle={{
                  color: 'hsl(var(--popover-foreground))',
                }}
                labelStyle={{
                  color: 'hsl(var(--popover-foreground))',
                }}
                formatter={(value: number) => [`৳${value.toLocaleString("bn-BD")}`, ""]}
              />
            </PieChart>
          </ResponsiveContainer>
          {/* Center Balance */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">ব্যালেন্স</p>
            <p className="text-lg font-extrabold text-foreground leading-tight">
              ৳{totalBalance.toLocaleString("bn-BD")}
            </p>
          </div>
        </div>
      </div>

      {/* Category Legend */}
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-1.5">
        {chartData.map((d, i) => (
          <button
            key={d.name}
            onClick={() => handleClick(null, i)}
            className={`flex items-center gap-1.5 transition-opacity duration-200 ${
              selectedCategory && selectedCategory !== d.name ? 'opacity-40' : 'opacity-100'
            }`}
          >
            <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
            <span className="text-[11px] text-muted-foreground">{d.name}</span>
            <span className="text-[11px] font-bold text-foreground">
              {total > 0 ? Math.round((d.value / total) * 100) : 0}%
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ExpensePieChart;
