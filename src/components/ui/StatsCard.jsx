import React from 'react';

const StatsCard = ({ title, value, icon: Icon, color = "blue", subtitle, trend }) => {
  const colorClasses = {
    blue: {
      bg: "bg-gradient-to-br from-blue-50 to-blue-100",
      border: "border-blue-200",
      icon: "text-blue-600",
      text: "text-blue-900",
      accent: "bg-blue-500"
    },
    green: {
      bg: "bg-gradient-to-br from-green-50 to-green-100", 
      border: "border-green-200",
      icon: "text-green-600",
      text: "text-green-900",
      accent: "bg-green-500"
    },
    purple: {
      bg: "bg-gradient-to-br from-purple-50 to-purple-100",
      border: "border-purple-200", 
      icon: "text-purple-600",
      text: "text-purple-900",
      accent: "bg-purple-500"
    },
    orange: {
      bg: "bg-gradient-to-br from-orange-50 to-orange-100",
      border: "border-orange-200",
      icon: "text-orange-600", 
      text: "text-orange-900",
      accent: "bg-orange-500"
    },
    red: {
      bg: "bg-gradient-to-br from-red-50 to-red-100",
      border: "border-red-200",
      icon: "text-red-600",
      text: "text-red-900", 
      accent: "bg-red-500"
    }
  };

  const colors = colorClasses[color] || colorClasses.blue;

  return (
    <div className={`${colors.bg} ${colors.border} border rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 relative overflow-hidden`}>
      <div className={`absolute top-0 left-0 w-full h-1 ${colors.accent}`}></div>
      
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <Icon className={`h-5 w-5 ${colors.icon}`} />
            <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">
              {title}
            </p>
          </div>
          <div className="flex items-baseline space-x-2">
            <p className={`text-3xl font-bold ${colors.text}`}>
              {value}
            </p>
            {trend && (
              <span className={`text-sm px-2 py-1 rounded-full ${
                trend > 0 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {trend > 0 ? '+' : ''}{trend}%
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
        
        <div className={`${colors.icon} opacity-10`}>
          <Icon className="h-16 w-16" />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;