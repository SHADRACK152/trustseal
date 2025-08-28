import React from 'react';
import { FileText, Image, File, CheckCircle, AlertTriangle, XCircle, Calendar, User } from 'lucide-react';
import { Document } from '../types';

interface DocumentCardProps {
  document: Document;
  showUserId?: boolean;
}

const DocumentCard: React.FC<DocumentCardProps> = ({ document, showUserId = false }) => {
  const getFileIcon = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif'].includes(ext || '')) {
      return <Image className="w-5 h-5" />;
    } else if (ext === 'pdf') {
      return <FileText className="w-5 h-5" />;
    }
    return <File className="w-5 h-5" />;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'authentic': return <CheckCircle className="w-5 h-5" />;
      case 'suspicious': return <AlertTriangle className="w-5 h-5" />;
      case 'fraudulent': return <XCircle className="w-5 h-5" />;
      default: return <FileText className="w-5 h-5" />;
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

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'authentic': return 'bg-green-50';
      case 'suspicious': return 'bg-yellow-50';
      case 'fraudulent': return 'bg-red-50';
      default: return 'bg-gray-50';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
      <div className="flex items-center space-x-4 flex-1">
        {/* File Icon */}
        <div className="text-gray-600 flex-shrink-0">
          {getFileIcon(document.filename)}
        </div>

        {/* File Info */}
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-gray-900 truncate">{document.filename}</h4>
          <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              {new Date(document.uploadDate).toLocaleDateString()}
            </div>
            <span>{formatFileSize(document.fileSize)}</span>
            {showUserId && (
              <div className="flex items-center">
                <User className="w-4 h-4 mr-1" />
                User #{document.userId.slice(-4)}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Status */}
      <div className="flex items-center space-x-4">
        <div className={`flex items-center px-3 py-1 rounded-full ${getStatusBg(document.status)}`}>
          <div className={`${getStatusColor(document.status)} mr-2`}>
            {getStatusIcon(document.status)}
          </div>
          <span className={`text-sm font-medium capitalize ${getStatusColor(document.status)}`}>
            {document.status}
          </span>
        </div>
        
        {/* Confidence Score */}
        <div className="text-right">
          <div className={`text-lg font-bold ${getStatusColor(document.status)}`}>
            {(document.confidenceScore * 100).toFixed(1)}%
          </div>
          <div className="text-xs text-gray-500">confidence</div>
        </div>
      </div>
    </div>
  );
};

export default DocumentCard;