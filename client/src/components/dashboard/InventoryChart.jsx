import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { useGetInventoryQuery } from "../../services/inventoryApi";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const InventoryChart = () => {
  const { data } = useGetInventoryQuery();

  const latest =
    data?.reduce((acc, curr) => {
      if (
        !acc[curr.item] ||
        new Date(curr.date) > new Date(acc[curr.item].date)
      ) {
        acc[curr.item] = curr;
      }
      return acc;
    }, {}) || {};

  const chartData = Object.keys(latest).map((item) => ({
    name: item,
    value: Number(latest[item].closingStock || 0),
  }));

  return (
    <ResponsiveContainer width="100%" height={240}>
      <PieChart>
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="name"
          outerRadius={80}
          label
        >
          {chartData.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default InventoryChart;
