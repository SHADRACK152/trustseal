import React, { useState, useRef } from 'react';
import { Upload, FileText, Image, File, X, CheckCircle, AlertTriangle, XCircle, Loader, Shield } from 'lucide-react';
import { Document } from '../types';

interface UploadPageProps {
  onFileUpload: (file: File) => Promise<Document>;
}

const UploadPage: React.FC<UploadPageProps> = ({ onFileUpload }) => {
  const [dragActive, setDragActive] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<Document | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileUpload = async (file: File) => {
    // Check file type
    const allowedTypes = [
      'application/pdf', 
      'image/jpeg', 
      'image/png', 
      'image/gif', 
      'application/msword', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];
    if (!allowedTypes.includes(file.type)) {
      alert('Please upload a PDF, image (JPG/PNG/GIF), or Word document.');
      return;
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB.');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisResult(null);

    try {
      const result = await onFileUpload(file);
      setAnalysisResult(result);
    } catch (error) {
      alert('Failed to analyze document. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'authentic': return 'text-green-600';
      case 'suspicious': return 'text-yellow-600';
      case 'fraudulent': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'authentic': return <CheckCircle className="w-8 h-8" />;
      case 'suspicious': return <AlertTriangle className="w-8 h-8" />;
      case 'fraudulent': return <XCircle className="w-8 h-8" />;
      default: return <FileText className="w-8 h-8" />;
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'authentic': return 'bg-green-50 border-green-200';
      case 'suspicious': return 'bg-yellow-50 border-yellow-200';
      case 'fraudulent': return 'bg-red-50 border-red-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const getFileIcon = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif'].includes(ext || '')) {
      return <Image className="w-6 h-6" />;
    } else if (ext === 'pdf') {
      return <FileText className="w-6 h-6" />;
    }
    return <File className="w-6 h-6" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const resetUpload = () => {
    setAnalysisResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Document Upload & Analysis</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Upload your documents for AI-powered fraud detection. Our system analyzes text extraction, 
          metadata, font consistency, watermarks, and suspicious edits.
        </p>
      </div>

      {!isAnalyzing && !analysisResult && (
        <div className="max-w-2xl mx-auto">
          {/* Upload Area */}
          <div
            className={`relative border-2 border-dashed rounded-xl p-8 transition-colors ${
              dragActive 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-300 hover:border-blue-400 bg-white'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              className="absolute inset-0 opacity-0 cursor-pointer"
              accept=".pdf,.jpg,.jpeg,.png,.gif,.doc,.docx"
              onChange={handleFileSelect}
            />
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Upload Document</h3>
              <p className="text-gray-600 mb-4">
                Drag and drop your file here, or click to browse
              </p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Choose File
              </button>
            </div>
          </div>

          {/* Supported Formats */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Supported Formats:</h4>
            <div className="flex flex-wrap gap-2 text-sm text-gray-600">
              <span className="px-2 py-1 bg-white rounded border">PDF</span>
              <span className="px-2 py-1 bg-white rounded border">JPG/JPEG</span>
              <span className="px-2 py-1 bg-white rounded border">PNG</span>
              <span className="px-2 py-1 bg-white rounded border">GIF</span>
              <span className="px-2 py-1 bg-white rounded border">DOC/DOCX</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">Maximum file size: 10MB</p>
          </div>
        </div>
      )}

      {/* Analysis Progress */}
      {isAnalyzing && (
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-8 text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Loader className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Analyzing Document</h3>
            <p className="text-gray-600">Our AI is examining your document for authenticity...</p>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center text-sm text-gray-600">
              <div className="w-2 h-2 bg-blue-600 rounded-full mr-3 animate-pulse"></div>
              Extracting text content...
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <div className="w-2 h-2 bg-blue-600 rounded-full mr-3 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
              Analyzing metadata...
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <div className="w-2 h-2 bg-blue-600 rounded-full mr-3 animate-pulse" style={{ animationDelay: '1s' }}></div>
              Checking font consistency...
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <div className="w-2 h-2 bg-blue-600 rounded-full mr-3 animate-pulse" style={{ animationDelay: '1.5s' }}></div>
              Detecting suspicious edits...
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <div className="w-2 h-2 bg-blue-600 rounded-full mr-3 animate-pulse" style={{ animationDelay: '2s' }}></div>
              Verifying blockchain registry...
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <div className="w-2 h-2 bg-blue-600 rounded-full mr-3 animate-pulse" style={{ animationDelay: '2.5s' }}></div>
              Generating tampering heatmap...
            </div>
          </div>
        </div>
      )}

      {/* Analysis Result */}
      {analysisResult && (
        <div className="max-w-4xl mx-auto space-y-6">
          <div className={`bg-white rounded-xl shadow-md border-2 ${getStatusBg(analysisResult.status)}`}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className={`${getStatusColor(analysisResult.status)} mr-3`}>
                    {getStatusIcon(analysisResult.status)}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 capitalize">
                      {analysisResult.status}
                    </h3>
                    <p className="text-gray-600">Document analysis complete</p>
                  </div>
                </div>
                <button
                  onClick={resetUpload}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* File Info */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex items-center">
                  <div className="text-gray-600 mr-3">
                    {getFileIcon(analysisResult.filename)}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{analysisResult.filename}</h4>
                    <p className="text-sm text-gray-600">
                      {formatFileSize(analysisResult.fileSize)} • 
                      Uploaded {new Date(analysisResult.uploadDate).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Confidence Score */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Confidence Score</span>
                  <span className={`text-lg font-bold ${getStatusColor(analysisResult.status)}`}>
                    {(analysisResult.confidenceScore * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      analysisResult.status === 'authentic' ? 'bg-green-500' :
                      analysisResult.status === 'suspicious' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${analysisResult.confidenceScore * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Blockchain Verification */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                  <Shield className="w-4 h-4 mr-2" />
                  Blockchain Verification
                </h4>
                <div className={`p-4 rounded-lg border ${
                  analysisResult.blockchainVerified 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-red-50 border-red-200'
                }`}>
                  <div className="flex items-center mb-2">
                    {analysisResult.blockchainVerified ? (
                      <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600 mr-2" />
                    )}
                    <span className={`font-medium ${
                      analysisResult.blockchainVerified ? 'text-green-800' : 'text-red-800'
                    }`}>
                      {analysisResult.blockchainVerified 
                        ? 'Document hash verified on blockchain registry' 
                        : 'Document hash not found on blockchain registry'
                      }
                    </span>
                  </div>
                  {analysisResult.blockchainHash && (
                    <div className="text-xs text-gray-600 font-mono break-all">
                      Hash: {analysisResult.blockchainHash}
                    </div>
                  )}
                </div>
              </div>

              {/* OCR Text Preview */}
              {analysisResult.ocrText && (
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-3">Extracted Text</h4>
                  <div className="bg-gray-50 rounded-lg p-4 max-h-32 overflow-y-auto">
                    <pre className="text-sm text-gray-700 whitespace-pre-wrap">{analysisResult.ocrText}</pre>
                  </div>
                </div>
              )}

              {/* Metadata Analysis */}
              {analysisResult.metadata && (
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-3">Document Metadata</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                      {analysisResult.metadata.creationDate && (
                        <div>
                          <span className="font-medium text-gray-700">Created:</span>
                          <span className="ml-2 text-gray-600">
                            {new Date(analysisResult.metadata.creationDate).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                      {analysisResult.metadata.lastModified && (
                        <div>
                          <span className="font-medium text-gray-700">Modified:</span>
                          <span className="ml-2 text-gray-600">
                            {new Date(analysisResult.metadata.lastModified).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                      {analysisResult.metadata.software && (
                        <div>
                          <span className="font-medium text-gray-700">Software:</span>
                          <span className="ml-2 text-gray-600">{analysisResult.metadata.software}</span>
                        </div>
                      )}
                      {analysisResult.metadata.author && (
                        <div>
                          <span className="font-medium text-gray-700">Author:</span>
                          <span className="ml-2 text-gray-600">{analysisResult.metadata.author}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Analysis Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center">
                    {analysisResult.analysis.textExtracted ? (
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500 mr-2" />
                    )}
                    <span className="text-sm text-gray-700">Text Extracted</span>
                  </div>
                  <div className="flex items-center">
                    {analysisResult.analysis.metadataCheck ? (
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500 mr-2" />
                    )}
                    <span className="text-sm text-gray-700">Metadata Valid</span>
                  </div>
                  <div className="flex items-center">
                    {analysisResult.analysis.fontConsistency ? (
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500 mr-2" />
                    )}
                    <span className="text-sm text-gray-700">Font Consistency</span>
                  </div>
                  <div className="flex items-center">
                    {!analysisResult.analysis.hiddenTextDetected ? (
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500 mr-2" />
                    )}
                    <span className="text-sm text-gray-700">No Hidden Text</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center">
                    {analysisResult.analysis.watermarkPresent ? (
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500 mr-2" />
                    )}
                    <span className="text-sm text-gray-700">Watermark Present</span>
                  </div>
                  <div className="flex items-center">
                    {!analysisResult.analysis.suspiciousEdits ? (
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500 mr-2" />
                    )}
                    <span className="text-sm text-gray-700">No Suspicious Edits</span>
                  </div>
                  <div className="flex items-center">
                    {analysisResult.analysis.fontMismatches.length === 0 ? (
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500 mr-2" />
                    )}
                    <span className="text-sm text-gray-700">No Font Mismatches</span>
                  </div>
                  <div className="flex items-center">
                    {analysisResult.analysis.typosDetected.length === 0 ? (
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500 mr-2" />
                    )}
                    <span className="text-sm text-gray-700">No Typos Detected</span>
                  </div>
                </div>
              </div>

              {/* Font Mismatches */}
              {analysisResult.analysis.fontMismatches.length > 0 && (
                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h4 className="font-medium text-yellow-900 mb-2 flex items-center">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Font Inconsistencies
                  </h4>
                  <ul className="text-sm text-yellow-800 space-y-1">
                    {analysisResult.analysis.fontMismatches.map((mismatch, index) => (
                      <li key={index} className="flex items-start">
                        <span className="w-1 h-1 bg-yellow-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                        {mismatch}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Typos Detected */}
              {analysisResult.analysis.typosDetected.length > 0 && (
                <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <h4 className="font-medium text-orange-900 mb-2 flex items-center">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Text Issues Detected
                  </h4>
                  <ul className="text-sm text-orange-800 space-y-1">
                    {analysisResult.analysis.typosDetected.map((typo, index) => (
                      <li key={index} className="flex items-start">
                        <span className="w-1 h-1 bg-orange-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                        {typo}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Anomalies */}
              {analysisResult.analysis.anomalies.length > 0 && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <h4 className="font-medium text-red-900 mb-2 flex items-center">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Detected Anomalies
                  </h4>
                  <ul className="text-sm text-red-800 space-y-1">
                    {analysisResult.analysis.anomalies.map((anomaly, index) => (
                      <li key={index} className="flex items-start">
                        <span className="w-1 h-1 bg-red-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                        {anomaly}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* AI Suggestions */}
              {analysisResult.analysis.aiSuggestions.length > 0 && (
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2 flex items-center">
                    <Shield className="w-4 h-4 mr-2" />
                    AI Recommendations
                  </h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    {analysisResult.analysis.aiSuggestions.map((suggestion, index) => (
                      <li key={index} className="flex items-start">
                        <span className="w-1 h-1 bg-blue-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Tampering Heatmap */}
              {analysisResult.tamperingHeatmap && analysisResult.tamperingHeatmap.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Tampering Detection Heatmap
                  </h4>
                  <div className="bg-gray-100 rounded-lg p-4 relative" style={{ minHeight: '200px' }}>
                    <div className="text-center text-gray-500 mb-4">Document Preview with Suspicious Areas</div>
                    {analysisResult.tamperingHeatmap.map((area, index) => (
                      <div
                        key={index}
                        className={`absolute border-2 ${
                          area.severity === 'high' ? 'border-red-500 bg-red-200' :
                          area.severity === 'medium' ? 'border-yellow-500 bg-yellow-200' :
                          'border-orange-500 bg-orange-200'
                        } opacity-70 rounded`}
                        style={{
                          left: `${area.x}px`,
                          top: `${area.y + 40}px`,
                          width: `${area.width}px`,
                          height: `${area.height}px`
                        }}
                        title={`${area.severity.toUpperCase()} risk tampering detected`}
                      />
                    ))}
                    <div className="mt-4 flex items-center justify-center space-x-4 text-xs">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-red-200 border border-red-500 rounded mr-1"></div>
                        High Risk
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-yellow-200 border border-yellow-500 rounded mr-1"></div>
                        Medium Risk
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-orange-200 border border-orange-500 rounded mr-1"></div>
                        Low Risk
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Upload Another */}
          <div className="text-center">
            <button
              onClick={resetUpload}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Upload Another Document
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadPage;