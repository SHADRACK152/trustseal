import React from 'react';
import { FileText, CheckCircle, AlertTriangle, XCircle, TrendingUp, Clock, Shield } from 'lucide-react';
import { Document } from '../types';
import DocumentCard from './DocumentCard';

interface DashboardProps {
  documents: Document[];
}

const Dashboard: React.FC<DashboardProps> = ({ documents }) => {
  const stats = {
    total: documents.length,
    authentic: documents.filter(doc => doc.status === 'authentic').length,
    suspicious: documents.filter(doc => doc.status === 'suspicious').length,
    fraudulent: documents.filter(doc => doc.status === 'fraudulent').length,
  };

  const recentDocuments = documents.slice(0, 5);

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
      case 'authentic': return <CheckCircle className="w-5 h-5" />;
      case 'suspicious': return <AlertTriangle className="w-5 h-5" />;
      case 'fraudulent': return <XCircle className="w-5 h-5" />;
      default: return <FileText className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to TrustSeal</h2>
            <p className="text-gray-600">AI-powered document fraud detection at your fingertips</p>
          </div>
          <div className="hidden sm:block">
            <Shield className="w-16 h-16 text-blue-600 opacity-20" />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Documents</p>
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Authentic</p>
              <p className="text-3xl font-bold text-green-600">{stats.authentic}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Suspicious</p>
              <p className="text-3xl font-bold text-yellow-600">{stats.suspicious}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Fraudulent</p>
              <p className="text-3xl font-bold text-red-600">{stats.fraudulent}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Documents */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Recent Documents</h3>
            <Clock className="w-5 h-5 text-gray-400" />
          </div>
        </div>
        
        {documents.length === 0 ? (
          <div className="p-8 text-center">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">No documents uploaded yet</h4>
            <p className="text-gray-600 mb-6">Upload your first document to start fraud detection analysis</p>
            <div className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <TrendingUp className="w-4 h-4 mr-2" />
              Get Started
            </div>
          </div>
        ) : (
          <div className="p-6 space-y-4">
            {recentDocuments.map((document) => (
              <DocumentCard key={document.id} document={document} />
            ))}
            
            {documents.length > 5 && (
              <div className="text-center pt-4 border-t border-gray-200">
                <button className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
                  View All Documents ({documents.length - 5} more)
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Trust Score Trend */}
      {documents.length > 0 && (
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Document Verification Overview</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {((stats.authentic / stats.total) * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-green-700">Authentic Rate</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {((stats.suspicious / stats.total) * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-yellow-700">Suspicious Rate</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {((stats.fraudulent / stats.total) * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-red-700">Fraudulent Rate</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;