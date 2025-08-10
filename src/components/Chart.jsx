import React from 'react';

const Chart = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'];
  
  // Sample data for the chart lines
  const chartData = {
    marriage: [1200, 1400, 1100, 1600, 1800, 2000, 2200, 2400, 2100, 1900, 1700, 1500],
    divorce: [800, 900, 700, 1000, 1200, 1100, 1300, 1400, 1200, 1000, 900, 800],
    death: [600, 700, 500, 800, 900, 1000, 1100, 1200, 1000, 900, 800, 700],
    birth: [1500, 1700, 1400, 1900, 2100, 2300, 2500, 2700, 2400, 2200, 2000, 1800]
  };

  const maxValue = Math.max(...chartData.marriage, ...chartData.divorce, ...chartData.death, ...chartData.birth);
  const chartHeight = 200;

  const getY = (value) => chartHeight - (value / maxValue) * chartHeight;

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-6">Statistics: Rekap Kependudukan Tahun Ini</h3>
      
      <div className="relative">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-gray-500">
          <span>4k</span>
          <span>3k</span>
          <span>2k</span>
          <span>1k</span>
          <span>0</span>
        </div>

        {/* Chart container */}
        <div className="ml-8 relative" style={{ height: chartHeight }}>
          <svg width="100%" height={chartHeight} className="w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Grid lines */}
            {[0, 1, 2, 3, 4].map((i) => (
              <line
                key={i}
                x1="0"
                y1={i * 20}
                x2="100"
                y2={i * 20}
                stroke="#e5e7eb"
                strokeWidth="0.5"
              />
            ))}

            {/* Marriage line (Yellow) */}
            <polyline
              points={chartData.marriage.map((value, index) => 
                `${(index / (months.length - 1)) * 100},${100 - (value / maxValue) * 100}`
              ).join(' ')}
              fill="none"
              stroke="#fbbf24"
              strokeWidth="1"
            />

            {/* Divorce line (Red) */}
            <polyline
              points={chartData.divorce.map((value, index) => 
                `${(index / (months.length - 1)) * 100},${100 - (value / maxValue) * 100}`
              ).join(' ')}
              fill="none"
              stroke="#ef4444"
              strokeWidth="1"
            />

            {/* Death line (Green) */}
            <polyline
              points={chartData.death.map((value, index) => 
                `${(index / (months.length - 1)) * 100},${100 - (value / maxValue) * 100}`
              ).join(' ')}
              fill="none"
              stroke="#10b981"
              strokeWidth="1"
            />

            {/* Birth line (Blue) */}
            <polyline
              points={chartData.birth.map((value, index) => 
                `${(index / (months.length - 1)) * 100},${100 - (value / maxValue) * 100}`
              ).join(' ')}
              fill="none"
              stroke="#3b82f6"
              strokeWidth="1"
            />
          </svg>

          {/* X-axis labels */}
          <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-500">
            {months.map((month) => (
              <span key={month}>{month}</span>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-6 mt-6">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
            <span className="text-sm text-gray-600">Akte Pernikahan</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Akte Perceraian</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Akte Kematian</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Akte Kelahiran</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chart;
