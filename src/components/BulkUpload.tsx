import React, { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle, AlertTriangle, XCircle, Trash2, Download } from 'lucide-react';
import { Document } from '../types';

interface BulkUploadProps {
  onBulkUpload: (files: File[]) => Promise<Document[]>;
}

interface UploadProgress {
  file: File;
  status: 'pending' | 'analyzing' | 'complete' | 'error';
  result?: Document;
  error?: string;
}

const BulkUpload: React.FC<BulkUploadProps> = ({ onBulkUpload }) => {
  const [uploadQueue, setUploadQueue] = useState<UploadProgress[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const newQueue = files.map(file => ({
      file,
      status: 'pending' as const
    }));

    setUploadQueue(prev => [...prev, ...newQueue]);
  };

  const removeFromQueue = (index: number) => {
    setUploadQueue(prev => prev.filter((_, i) => i !== index));
  };

  const processBulkUpload = async () => {
    if (uploadQueue.length === 0) return;

    setIsProcessing(true);
    const pendingFiles = uploadQueue.filter(item => item.status === 'pending');

    for (let i = 0; i < pendingFiles.length; i++) {
      const fileIndex = uploadQueue.findIndex(item => item.file === pendingFiles[i].file);
      
      // Update status to analyzing
      setUploadQueue(prev => prev.map((item, idx) => 
        idx === fileIndex ? { ...item, status: 'analyzing' } : item
      ));

      try {
        const results = await onBulkUpload([pendingFiles[i].file]);
        const result = results[0];

        // Update with result
        setUploadQueue(prev => prev.map((item, idx) => 
          idx === fileIndex ? { ...item, status: 'complete', result } : item
        ));
      } catch (error) {
        // Update with error
        setUploadQueue(prev => prev.map((item, idx) => 
          idx === fileIndex ? { 
            ...item, 
            status: 'error', 
            error: 'Analysis failed' 
          } : item
        ));
      }
    }

    setIsProcessing(false);
  };

  const exportResults = () => {
    const completedResults = uploadQueue
      .filter(item => item.status === 'complete' && item.result)
      .map(item => item.result!);

    if (completedResults.length === 0) return;

    const csvContent = [
      ['Filename', 'Status', 'Confidence Score', 'Blockchain Verified', 'Anomalies Count', 'AI Suggestions'].join(','),
      ...completedResults.map(doc => [
        doc.filename,
        doc.status,
        (doc.confidenceScore * 100).toFixed(1) + '%',
        doc.blockchainVerified ? 'Yes' : 'No',
        doc.analysis.anomalies.length.toString(),
        doc.analysis.aiSuggestions.length.toString()
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bulk-analysis-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <FileText className="w-4 h-4 text-gray-400" />;
      case 'analyzing': return <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />;
      case 'complete': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'error': return <XCircle className="w-4 h-4 text-red-600" />;
      default: return <FileText className="w-4 h-4 text-gray-400" />;
    }
  };

  const getResultIcon = (status?: string) => {
    switch (status) {
      case 'authentic': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'suspicious': return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'fraudulent': return <XCircle className="w-4 h-4 text-red-600" />;
      default: return null;
    }
  };

  const completedCount = uploadQueue.filter(item => item.status === 'complete').length;
  const errorCount = uploadQueue.filter(item => item.status === 'error').length;
  const pendingCount = uploadQueue.filter(item => item.status === 'pending').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Bulk Document Analysis</h2>
        <p className="text-gray-600">Upload multiple documents for batch fraud detection</p>
      </div>

      {/* Upload Area */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <div className="text-center">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            accept=".pdf,.jpg,.jpeg,.png,.gif,.doc,.docx"
            onChange={handleFileSelect}
          />
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Upload className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Select Multiple Documents</h3>
          <p className="text-gray-600 mb-4">Choose multiple files to analyze in batch</p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Choose Files
          </button>
        </div>
      </div>

      {/* Queue Summary */}
      {uploadQueue.length > 0 && (
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Upload Queue</h3>
            <div className="flex items-center space-x-4">
              {completedCount > 0 && (
                <button
                  onClick={exportResults}
                  className="flex items-center px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors"
                >
                  <Download className="w-4 h-4 mr-1" />
                  Export Results
                </button>
              )}
              <button
                onClick={processBulkUpload}
                disabled={isProcessing || pendingCount === 0}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {isProcessing ? 'Processing...' : `Analyze ${pendingCount} Files`}
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">{uploadQueue.length}</div>
              <div className="text-sm text-gray-600">Total</div>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{pendingCount}</div>
              <div className="text-sm text-gray-600">Pending</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{completedCount}</div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
            <div className="text-center p-3 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{errorCount}</div>
              <div className="text-sm text-gray-600">Errors</div>
            </div>
          </div>

          {/* File List */}
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {uploadQueue.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3 flex-1">
                  {getStatusIcon(item.status)}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 truncate">{item.file.name}</div>
                    <div className="text-sm text-gray-600">
                      {(item.file.size / 1024 / 1024).toFixed(2)} MB
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  {item.status === 'complete' && item.result && (
                    <div className="flex items-center space-x-2">
                      {getResultIcon(item.result.status)}
                      <span className={`text-sm font-medium capitalize ${
                        item.result.status === 'authentic' ? 'text-green-600' :
                        item.result.status === 'suspicious' ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {item.result.status}
                      </span>
                      <span className="text-sm text-gray-600">
                        ({(item.result.confidenceScore * 100).toFixed(1)}%)
                      </span>
                    </div>
                  )}

                  {item.status === 'error' && (
                    <span className="text-sm text-red-600">{item.error}</span>
                  )}

                  {item.status === 'pending' && (
                    <button
                      onClick={() => removeFromQueue(index)}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BulkUpload;