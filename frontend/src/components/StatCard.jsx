import React from 'react';

const StatCard = ({ title, value, icon, color = "blue" }) => {
  const colorClasses = {
    blue: "text-white",
    green: "text-white", 
    yellow: "text-white",
    red: "text-white",
    purple: "text-white",
    custom: "text-white"
  };

  const bgColorClasses = {
    blue: "bg-[#11B0EF]",
    green: "bg-[#2DCE9A]", 
    yellow: "bg-[#FFD700]",
    red: "bg-[#F55242]",
    purple: "bg-[#9B59B6]",
    custom: "bg-[#F55242]"
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-6" style={{height: '156px'}}>
      <div className="flex items-center justify-between h-full">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-3 text-[20px] leading-tight">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mb-2 text-[40px]">{value}</p>
          <p className="text-sm text-green-600 font-medium text-[16px]">Tersimpan</p>
        </div>
        <div className={`w-14 h-14 rounded-full flex items-center justify-center ${bgColorClasses[color]} ${colorClasses[color]} flex-shrink-0`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
