import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';

interface DataKey {
  key: string;
  name: string;
  color: string;
}

interface ChartProps {
  data: any[];
  height?: number;
  dataKeys: DataKey[];
  type?: 'bar' | 'line';
}

const Chart: React.FC<ChartProps> = ({ 
  data, 
  height = 300, 
  dataKeys,
  type = 'bar'
}) => {
  if (type === 'line') {
    return (
      <ResponsiveContainer width="100%\" height={height}>
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            tick={{ fontSize: 12 }}
          />
          <Tooltip />
          <Legend />
          {dataKeys.map((dataKey, index) => (
            <Line
              key={index}
              type="monotone"
              dataKey={dataKey.key}
              name={dataKey.name}
              stroke={dataKey.color}
              activeDot={{ r: 8 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="name" 
          tick={{ fontSize: 12 }}
        />
        <YAxis 
          tick={{ fontSize: 12 }}
        />
        <Tooltip />
        <Legend />
        {dataKeys.map((dataKey, index) => (
          <Bar
            key={index}
            dataKey={dataKey.key}
            name={dataKey.name}
            fill={dataKey.color}
            radius={[4, 4, 0, 0]}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
};

export default Chart;