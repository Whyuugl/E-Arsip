import React, { useState } from 'react';

const OCRUpload = () => {
  const [file, setFile] = useState(null);
  const [extractedText, setExtractedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Validate file type (images and PDF)
      if (!selectedFile.type.startsWith('image/') && selectedFile.type !== 'application/pdf') {
        setError('Please select an image file or PDF');
        return;
      }
      // Validate file size (10MB max)
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB');
        return;
      }
      setFile(selectedFile);
      setError('');
    }
  };

  const handleExtractText = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setLoading(true);
    setError('');
    setExtractedText('');

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api/ocr/extract-text', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setExtractedText(result.extractedText);
      } else {
        setError(result.error || 'Failed to extract text');
      }
    } catch (err) {
      setError('Network error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setFile(null);
    setExtractedText('');
    setError('');
    // Reset file input
    const fileInput = document.getElementById('file-input');
    if (fileInput) fileInput.value = '';
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">OCR Text Extraction</h2>
      
      {/* File Upload Section */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Upload Image/PDF File
        </label>
        <input
          id="file-input"
          type="file"
          accept="image/*,.pdf"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        {file && (
          <div className="mt-2 text-sm text-gray-600">
            Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Action Buttons */}
      <div className="mb-6 flex gap-4">
        <button
          onClick={handleExtractText}
          disabled={!file || loading}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Processing...
            </>
          ) : (
            'Extract Text'
          )}
        </button>
        
        <button
          onClick={handleClear}
          className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
        >
          Clear
        </button>
      </div>

      {/* Extracted Text Display */}
      {extractedText && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Extracted Text:</h3>
          <div className="bg-gray-50 p-4 rounded-lg border">
            <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono">
              {extractedText}
            </pre>
          </div>
          
          {/* Copy Button */}
          <button
            onClick={() => navigator.clipboard.writeText(extractedText)}
            className="mt-3 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
          >
            Copy to Clipboard
          </button>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-semibold text-blue-800 mb-2">Instructions:</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Upload an image file (JPG, PNG, GIF) or PDF</li>
          <li>• Maximum file size: 10MB</li>
          <li>• Supports Indonesian and English text</li>
          <li>• Click "Extract Text" to process the file</li>
          <li>• The extracted text will appear below</li>
        </ul>
      </div>
    </div>
  );
};

export default OCRUpload;
