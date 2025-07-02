import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  unit: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'amber' | 'red';
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  unit,
  change,
  trend,
  icon,
  color
}) => {
  const getColorClasses = () => {
    switch (color) {
      case 'blue':
        return 'bg-blue-50 text-blue-600';
      case 'green':
        return 'bg-green-50 text-green-600';
      case 'amber':
        return 'bg-amber-50 text-amber-600';
      case 'red':
        return 'bg-red-50 text-red-600';
      default:
        return 'bg-blue-50 text-blue-600';
    }
  };

  const getTrendColor = () => {
    if (trend === 'up') {
      return 'text-green-600';
    } else if (trend === 'down') {
      return 'text-red-600';
    }
    return 'text-gray-600';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-5 transition-all duration-300 hover:shadow-md">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <div className="flex items-baseline mt-1">
            <p className="text-2xl font-semibold text-gray-900">{value}</p>
            <p className="ml-1 text-sm text-gray-500">{unit}</p>
          </div>
        </div>
        <div className={`p-2 rounded-full ${getColorClasses()}`}>
          {icon}
        </div>
      </div>
      <div className="flex items-center mt-4">
        {trend === 'up' ? (
          <TrendingUp size={16} className="text-green-600 mr-1" />
        ) : (
          <TrendingDown size={16} className="text-red-600 mr-1" />
        )}
        <span className={`text-sm font-medium ${getTrendColor()}`}>{change}</span>
        <span className="text-sm text-gray-500 ml-1">vs last period</span>
      </div>
    </div>
  );
};

export default MetricCard;