import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useGetWholesaleCreditsQuery } from "../../services/wholesaleCreditApi";

const CreditChart = () => {
  const { data } = useGetWholesaleCreditsQuery();

  const chartData =
    data?.map((item) => ({
      name: item.buyerName,
      Balance: Number(item.currentBalance || 0),
      Paid: Number(item.totalAmountPaid || 0),
    })) || [];

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={chartData}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="Balance" fill="#f44336" />
        <Bar dataKey="Paid" fill="#4caf50" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default CreditChart;
