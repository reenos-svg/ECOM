import { FC } from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import RenderHeader from "../ReusableComp/RenderHeading";

interface RevenueOrdersChartProps {
  data: {
    name: string;
    labels: string[];
    revenue: number[];
  };
}

const RevenueOrdersChart: FC<RevenueOrdersChartProps> = ({ data }) => {
  // Define the options with the correct types
  const options: ApexOptions = {
    chart: {
      height: 350,
      type: "area", // Ensure 'area' is a valid type
      toolbar: {
        show: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      type: "category", // Ensure 'category' is a valid type
      categories: data.labels,
    },
    stroke: {
      curve: "smooth", // Ensure 'smooth' is a valid curve type
    },
    colors: ["#ff9f66"],
    legend: {
      position: "top",
      horizontalAlign: "right",
      markers: {
        fillColors: ["#059688"],
        width: 12,
        height: 12,
        radius: 12,
      },
      labels: {
        useSeriesColors: true,
      },
    },
  };

  const chartSeries = [
    {
      name: "Order Value",
      data: data.revenue,
    },
  ];

  return (
    <div className="bg-white w-[22rem] md:w-[60%] rounded shadow p-4">
      <RenderHeader subHeading="Order Value Chart" />
      <Chart
        options={options}
        series={chartSeries}
        type="area"
        height={350} // Use number type for height
      />
    </div>
  );
};

export default RevenueOrdersChart;
