import React, { useState } from 'react';
import KTPOCRScanner from '../components/KTPOCRScanner';

const TambahArsip = () => {
  const [loading, setLoading] = useState(false);
  const [showOCRScanner, setShowOCRScanner] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedArsipType, setSelectedArsipType] = useState('');
  const [formData, setFormData] = useState({
    namaLengkap: '',
    nomorIndukKependudukan: '',
    tempatLahir: '',
    tanggalLahir: '',
    jenisKelamin: '',
    alamat: ''
  });

  // Icons
  const icons = {
    upload: (
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
        <path fill="currentColor" d="M5 20h14v-2H5v2Zm7-18L5.33 9h3.92v4h5.5V9h3.92L12 2Z"/>
      </svg>
    ),
    birth: (
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 16 16">
        <path fill="currentColor" d="M15 3v10H1V3zm1-1H0v12h16z"/>
        <path fill="currentColor" d="M8 5h6v1H8zm0 2h6v1H8zm0 2h3v1H8zM5.4 7H5v-.1c.6-.2 1-.8 1-1.4C6 4.7 5.3 4 4.5 4S3 4.7 3 5.5c0 .7.4 1.2 1 1.4V7h-.4C2.7 7 2 7.7 2 8.6V11h5V8.6C7 7.7 6.3 7 5.4 7"/>
      </svg>
    ),
    marriage: (
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24">
        <path fill="currentColor" d="M12 22q-1.65 0-3.075-.637t-2.525-1.713Q5.325 18.575 4.688 17.15T4.05 14.075q0-1.425.488-2.713T6 9.05q.4-.4.9-.663t1.1-.337q.6-.075 1.2.025t1.15.375q.55.35.95.95q.4-.6.95-.95t1.15-.375q.6-.1 1.2-.025t1.1.337q.5.263.9.663q1 1 1.488 2.288t.487 2.712q0 1.475-.637 2.9t-1.763 2.5q-1.075 1.075-2.5 1.713T12 22"/>
      </svg>
    ),
    divorce: (
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 2048 2048">
        <path fill="currentColor" d="M1040 946q119 46 217 128t164 191l-93 93q-42-77-102-138t-132-105t-155-67t-171-24q-88 0-170 23t-153 64t-129 100t-100 130t-65 153t-23 170H0q0-120 35-231t101-205t156-167t204-115q-113-74-176-186t-64-248q0-106 40-199t109-163T568 40T768 0t199 40t163 109t110 163t40 200q0 66-16 129t-48 119t-75 103t-101 83M384 512q0 80 30 149t82 122t122 83t150 30q79 0 149-30t122-82t83-122t30-150q0-79-30-149t-82-122t-123-83t-149-30q-80 0-149 30t-122 82t-83 123t-30 149m1661 990l-226 226l226 227l-90 90l-227-226l-227 227l-90-91l227-227l-227-227l90-90l227 227l227-227z"/>
      </svg>
    ),
    death: (
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 16 16">
        <path fill="currentColor" d="M15 3v10H1V3zm1-1H0v12h16z"/>
        <path fill="currentColor" d="M8 5h6v1H8zm0 2h6v1H8zm0 2h3v1H8zM5.4 7H5v-.1c.6-.2 1-.8 1-1.4C6 4.7 5.3 4 4.5 4S3 4.7 3 5.5c0 .7.4 1.2 1 1.4V7h-.4C2.7 7 2 7.7 2 8.6V11h5V8.6C7 7.7 6.3 7 5.4 7"/>
      </svg>
    )
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleArsipTypeSelect = (type) => {
    setSelectedArsipType(type);
  };

  const handleOCRScan = () => {
    setShowOCRScanner(true);
  };

  const handleOCRDataExtracted = (extractedData) => {
    setFormData(prev => ({
      ...prev,
      ...extractedData
    }));
    setShowOCRScanner(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedArsipType) {
      alert('Pilih jenis arsip terlebih dahulu!');
      return;
    }

    if (!selectedFile) {
      alert('Upload file terlebih dahulu!');
      return;
    }

    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('jenis_arsip', selectedArsipType);
      formDataToSend.append('nomor_akta', formData.nomorIndukKependudukan);
      formDataToSend.append('nama_lengkap', formData.namaLengkap);
      formDataToSend.append('tempat_lahir', formData.tempatLahir);
      formDataToSend.append('tanggal_lahir', formData.tanggalLahir);
      formDataToSend.append('jenis_kelamin', formData.jenisKelamin);
      formDataToSend.append('alamat', formData.alamat);
      formDataToSend.append('status', 'pending');
      formDataToSend.append('file', selectedFile);

      const response = await fetch('/api/arsip', {
        method: 'POST',
        body: formDataToSend,
        credentials: 'include'
      });

      const result = await response.json();

      if (result.success) {
        alert('Arsip berhasil ditambahkan!');
        // Reset form
        setFormData({
          namaLengkap: '',
          nomorIndukKependudukan: '',
          tempatLahir: '',
          tanggalLahir: '',
          jenisKelamin: '',
          alamat: ''
        });
        setSelectedFile(null);
        setSelectedArsipType('');
      } else {
        alert('Gagal menambahkan arsip: ' + result.error);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Terjadi kesalahan saat mengirim data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div style={{ marginLeft: '65px' }}>
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Arsip Kependudukan | Tambah Arsip</h1>
          <p className="text-blue-100 mt-2">Unggah dokumen untuk disimpan ke dalam arsip</p>
        </div>

        {/* Upload Section */}
        <div className="bg-white rounded-2xl shadow p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">File Upload</h2>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-gray-500">
            {icons.upload}
            <p className="mt-2">Click or drag file to this area to upload</p>
            <input
              type="file"
              onChange={handleFileChange}
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              className="mt-4"
            />
            {selectedFile && (
              <p className="mt-2 text-sm text-green-600">
                File dipilih: {selectedFile.name}
              </p>
            )}
          </div>

          <button
            onClick={handleOCRScan}
            className="mt-4 w-full py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
          >
            Scan Dengan OCR
          </button>

          {loading && (
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full w-2/3"></div>
              </div>
              <p className="mt-2 text-sm text-gray-600">
                Sedang Memindai Dokumen dengan OCR, Mohon tunggu........
              </p>
            </div>
          )}
        </div>

        {/* Form Data Kependudukan */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Data Kependudukan</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input 
                type="text" 
                name="namaLengkap"
                value={formData.namaLengkap}
                onChange={handleInputChange}
                placeholder="Nama Lengkap" 
                className="border rounded-lg p-2" 
                required
              />
              <input 
                type="text" 
                name="nomorIndukKependudukan"
                value={formData.nomorIndukKependudukan}
                onChange={handleInputChange}
                placeholder="Nomor Induk Kependudukan" 
                className="border rounded-lg p-2" 
                required
              />
              <input 
                type="text" 
                name="tempatLahir"
                value={formData.tempatLahir}
                onChange={handleInputChange}
                placeholder="Tempat Lahir" 
                className="border rounded-lg p-2" 
                required
              />
              <input 
                type="date" 
                name="tanggalLahir"
                value={formData.tanggalLahir}
                onChange={handleInputChange}
                placeholder="Tanggal Lahir" 
                className="border rounded-lg p-2" 
                required
              />
              <select 
                name="jenisKelamin"
                value={formData.jenisKelamin}
                onChange={handleInputChange}
                className="border rounded-lg p-2" 
                required
              >
                <option value="">Pilih Jenis Kelamin</option>
                <option value="laki-laki">Laki-laki</option>
                <option value="perempuan">Perempuan</option>
              </select>
              <input 
                type="text" 
                name="alamat"
                value={formData.alamat}
                onChange={handleInputChange}
                placeholder="Alamat" 
                className="border rounded-lg p-2" 
                required
              />
            </div>

            {/* Jenis Arsip */}
            <div className="flex flex-wrap gap-4 mt-6">
              <button 
                type="button"
                onClick={() => handleArsipTypeSelect('kelahiran')}
                className={`flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-100 transition ${
                  selectedArsipType === 'kelahiran' ? 'bg-blue-100 border-blue-500' : ''
                }`}
              >
                {icons.birth} Akta Kelahiran
              </button>
              <button 
                type="button"
                onClick={() => handleArsipTypeSelect('pernikahan')}
                className={`flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-100 transition ${
                  selectedArsipType === 'pernikahan' ? 'bg-blue-100 border-blue-500' : ''
                }`}
              >
                {icons.marriage} Akta Pernikahan
              </button>
              <button 
                type="button"
                onClick={() => handleArsipTypeSelect('perceraian')}
                className={`flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-100 transition ${
                  selectedArsipType === 'perceraian' ? 'bg-blue-100 border-blue-500' : ''
                }`}
              >
                {icons.divorce} Akta Perceraian
              </button>
              <button 
                type="button"
                onClick={() => handleArsipTypeSelect('kematian')}
                className={`flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-100 transition ${
                  selectedArsipType === 'kematian' ? 'bg-blue-100 border-blue-500' : ''
                }`}
              >
                {icons.death} Akta Kematian
              </button>
            </div>

            {/* Submit */}
            <button 
              type="submit"
              className="mt-6 px-6 py-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition"
              disabled={loading}
            >
              {loading ? 'Menyimpan...' : 'Submit'}
            </button>
          </form>
        </div>
      </div>

      {/* OCR Scanner Modal */}
      {showOCRScanner && (
        <KTPOCRScanner
          onDataExtracted={handleOCRDataExtracted}
          onClose={() => setShowOCRScanner(false)}
        />
      )}
    </div>
  );
};

export default TambahArsip;