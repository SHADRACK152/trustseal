import React, { useState } from 'react';
import { Users, FileText, TrendingUp, Calendar, Search, Filter, Download } from 'lucide-react';
import { Document } from '../types';
import DocumentCard from './DocumentCard';

interface AdminPanelProps {
  documents: Document[];
}

const AdminPanel: React.FC<AdminPanelProps> = ({ documents }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  // Get unique users
  const uniqueUsers = [...new Set(documents.map(doc => doc.userId))];
  
  // Filter and sort documents
  const filteredDocuments = documents
    .filter(doc => {
      const matchesSearch = doc.filename.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || doc.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
        case 'confidence':
          return b.confidenceScore - a.confidenceScore;
        case 'filename':
          return a.filename.localeCompare(b.filename);
        default:
          return 0;
      }
    });

  const stats = {
    totalDocuments: documents.length,
    totalUsers: uniqueUsers.length,
    authentic: documents.filter(doc => doc.status === 'authentic').length,
    suspicious: documents.filter(doc => doc.status === 'suspicious').length,
    fraudulent: documents.filter(doc => doc.status === 'fraudulent').length,
  };

  const exportData = () => {
    const csvContent = [
      ['Filename', 'Upload Date', 'Status', 'Confidence Score', 'User ID', 'Anomalies'].join(','),
      ...filteredDocuments.map(doc => [
        doc.filename,
        new Date(doc.uploadDate).toLocaleDateString(),
        doc.status,
        (doc.confidenceScore * 100).toFixed(1) + '%',
        doc.userId,
        doc.analysis.anomalies.join('; ')
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `trustseal-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      {/* Admin Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Panel</h1>
        <p className="text-gray-600">Monitor and manage document verification across all users</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Documents</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalDocuments}</p>
            </div>
            <FileText className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Users</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
            </div>
            <Users className="w-8 h-8 text-indigo-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Authentic</p>
              <p className="text-2xl font-bold text-green-600">{stats.authentic}</p>
            </div>
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-green-600 rounded-full"></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Suspicious</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.suspicious}</p>
            </div>
            <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-yellow-600 rounded-full"></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Fraudulent</p>
              <p className="text-2xl font-bold text-red-600">{stats.fraudulent}</p>
            </div>
            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-red-600 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <Filter className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
              >
                <option value="all">All Status</option>
                <option value="authentic">Authentic</option>
                <option value="suspicious">Suspicious</option>
                <option value="fraudulent">Fraudulent</option>
              </select>
            </div>

            {/* Sort By */}
            <div className="relative">
              <Calendar className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
              >
                <option value="date">Sort by Date</option>
                <option value="confidence">Sort by Confidence</option>
                <option value="filename">Sort by Filename</option>
              </select>
            </div>
          </div>

          {/* Export Button */}
          <button
            onClick={exportData}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Results Summary */}
      <div className="bg-gray-50 rounded-lg p-4">
        <p className="text-sm text-gray-600">
          Showing {filteredDocuments.length} of {documents.length} documents
          {searchTerm && ` matching "${searchTerm}"`}
          {statusFilter !== 'all' && ` with status "${statusFilter}"`}
        </p>
      </div>

      {/* Documents List */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">All Documents</h3>
        </div>
        
        {filteredDocuments.length === 0 ? (
          <div className="p-8 text-center">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">No documents found</h4>
            <p className="text-gray-600">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filters' 
                : 'No documents have been uploaded yet'
              }
            </p>
          </div>
        ) : (
          <div className="p-4 space-y-4">
            {filteredDocuments.map((document) => (
              <div key={document.id} className="border border-gray-200 rounded-lg p-4">
                <DocumentCard document={document} showUserId={true} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Summary Cards */}
      {documents.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-4">Detection Accuracy</h4>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {((stats.authentic / stats.totalDocuments) * 100).toFixed(1)}%
              </div>
              <p className="text-sm text-gray-600">Documents verified as authentic</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-4">Risk Assessment</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Low Risk</span>
                <span className="text-sm font-medium text-green-600">{stats.authentic}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Medium Risk</span>
                <span className="text-sm font-medium text-yellow-600">{stats.suspicious}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">High Risk</span>
                <span className="text-sm font-medium text-red-600">{stats.fraudulent}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-4">System Performance</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Scanned</span>
                <span className="text-sm font-medium">{stats.totalDocuments}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Active Users</span>
                <span className="text-sm font-medium">{stats.totalUsers}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Fraud Detection</span>
                <span className="text-sm font-medium text-green-600">Active</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;