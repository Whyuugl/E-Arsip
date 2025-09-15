import React, { useState } from 'react';

const Laporan = () => {
  const [selectedReportType, setSelectedReportType] = useState('semua');
  const [dateRange, setDateRange] = useState('bulan');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Sample report data
  const reportData = [
    {
      id: 1,
      jenis: 'Akta Kelahiran',
      jumlah: 156,
      status: 'Tersimpan',
      persentase: '85%',
      trend: 'up'
    },
    {
      id: 2,
      jenis: 'Akta Pernikahan',
      jumlah: 89,
      status: 'Tersimpan',
      persentase: '92%',
      trend: 'up'
    },
    {
      id: 3,
      jenis: 'Akta Perceraian',
      jumlah: 23,
      status: 'Tersimpan',
      persentase: '78%',
      trend: 'down'
    },
    {
      id: 4,
      jenis: 'Akta Kematian',
      jumlah: 67,
      status: 'Tersimpan',
      persentase: '88%',
      trend: 'up'
    },
    {
      id: 5,
      jenis: 'Akta Pengakuan',
      jumlah: 12,
      status: 'Pending',
      persentase: '45%',
      trend: 'down'
    }
  ];

  const exportReport = (format) => {
    // Simulate export functionality
    alert(`Laporan akan di-export dalam format ${format}`);
  };

  return (
    <div className="space-y-8">
      <div style={{ marginLeft: '45px' }}>
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">E-ARSIP DUKCAPIL | Laporan Arsip</h1>
          <p className="text-blue-100 mt-2">Generate dan lihat laporan arsip kependudukan</p>
        </div>

        {/* Report Controls */}
        <div className="bg-white rounded-lg p-6 mb-8 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Jenis Laporan</label>
              <select
                value={selectedReportType}
                onChange={(e) => setSelectedReportType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="semua">Semua Jenis</option>
                <option value="kelahiran">Akta Kelahiran</option>
                <option value="pernikahan">Akta Pernikahan</option>
                <option value="perceraian">Akta Perceraian</option>
                <option value="kematian">Akta Kematian</option>
                <option value="pengakuan">Akta Pengakuan</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Rentang Waktu</label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="hari">Hari Ini</option>
                <option value="minggu">Minggu Ini</option>
                <option value="bulan">Bulan Ini</option>
                <option value="tahun">Tahun Ini</option>
                <option value="custom">Kustom</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Mulai</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Akhir</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => exportReport('PDF')}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                <path fill="currentColor" d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" points="14,2 14,8 20,8"/>
                <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="16" y1="13" x2="8" y2="13"/>
                <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="16" y1="17" x2="8" y2="17"/>
                <polyline fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" points="10,9 9,9 8,9"/>
              </svg>
              Export PDF
            </button>
            <button
              onClick={() => exportReport('Excel')}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                <path fill="currentColor" d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" points="14,2 14,8 20,8"/>
                <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="16" y1="13" x2="8" y2="13"/>
                <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="16" y1="17" x2="8" y2="17"/>
                <polyline fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" points="10,9 9,9 8,9"/>
              </svg>
              Export Excel
            </button>
            <button
              onClick={() => exportReport('Print')}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                <path fill="currentColor" d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3m-3 11H8v-5h8zm3-7c-.55 0-1-.45-1-1s.45-1 1-1s1 .45 1 1s-.45 1-1 1m-1-9H6v4h12z"/>
              </svg>
              Print
            </button>
          </div>
        </div>

        {/* Report Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Arsip</p>
                <p className="text-2xl font-bold text-gray-900">347</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="text-blue-600">
                  <path fill="currentColor" d="M10.25 11a.75.75 0 0 0 0 1.5h3.5a.75.75 0 0 0 0-1.5zM3 5.25A2.25 2.25 0 0 1 5.25 3h13.5A2.25 2.25 0 0 1 21 5.25v1.5c0 .78-.397 1.467-1 1.871v8.629A3.75 3.75 0 0 1 16.25 21h-8.5A3.75 3.75 0 0 1 4 17.25V8.621A2.25 2.25 0 0 1 3 6.75zM5.5 9v8.25a2.25 2.25 0 0 0 2.25 2.25h8.5a2.25 2.25 0 0 0 2.25-2.25V9zm-.25-4.5a.75.75 0 0 0-.75.75v1.5c0 .414.336.75.75.75h13.5a.75.75 0 0 0 .75-.75v-1.5a.75.75 0 0 0-.75-.75z"/>
                </svg>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-green-600 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" className="mr-1">
                  <path fill="currentColor" d="m7 14l5-5l5 5z"/>
                </svg>
                +12%
              </span>
              <span className="text-gray-500 ml-2">dari bulan lalu</span>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tersimpan</p>
                <p className="text-2xl font-bold text-gray-900">312</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="text-green-600">
                  <path fill="currentColor" d="m9 12l2 2l4-4m6 2a9 9 0 1 1-18 0a9 9 0 0 1 18 0"/>
                </svg>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-green-600 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" className="mr-1">
                  <path fill="currentColor" d="m7 14l5-5l5 5z"/>
                </svg>
                +8%
              </span>
              <span className="text-gray-500 ml-2">dari bulan lalu</span>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">35</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="text-yellow-600">
                  <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5l1.41-1.41L10 14.17l7.59-7.59L19 8z"/>
                </svg>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-red-600 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" className="mr-1">
                  <path fill="currentColor" d="m7 10l5 5l5-5z"/>
                </svg>
                -3%
              </span>
              <span className="text-gray-500 ml-2">dari bulan lalu</span>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rata-rata</p>
                <p className="text-2xl font-bold text-gray-900">89.9%</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="text-purple-600">
                  <path fill="currentColor" d="M9 7H7v2h2m4 0h-2v2h2m4 0h-2v2h2m2-7H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2m0 16H5V5h14z"/>
                </svg>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-green-600 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" className="mr-1">
                  <path fill="currentColor" d="m7 14l5-5l5 5z"/>
                </svg>
                +2.1%
              </span>
              <span className="text-gray-500 ml-2">dari bulan lalu</span>
            </div>
          </div>
        </div>

        {/* Detailed Report Table */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Detail Laporan Arsip</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jenis Arsip</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Persentase</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trend</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reportData.map((item, index) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.jenis}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.jumlah}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        item.status === 'Tersimpan' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.persentase}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${
                        item.trend === 'up' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {item.trend === 'up' ? (
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" className="mr-1">
                            <path fill="currentColor" d="m7 14l5-5l5 5z"/>
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" className="mr-1">
                            <path fill="currentColor" d="m7 10l5 5l5-5z"/>
                          </svg>
                        )}
                        {item.trend === 'up' ? 'Naik' : 'Turun'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Laporan;
