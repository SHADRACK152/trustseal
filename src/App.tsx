import React, { useState, useEffect } from 'react';
import { Shield, Upload, FileText, Users, BarChart3, LogOut, Menu, X, Package, TrendingUp } from 'lucide-react';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import UploadPage from './components/UploadPage';
import BulkUpload from './components/BulkUpload';
import ConfidenceTrends from './components/ConfidenceTrends';
import AdminPanel from './components/AdminPanel';
import { User, Document } from './types';
import { mockAuthService, mockAIService } from './services/mockServices';

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'upload' | 'bulk' | 'trends' | 'admin'>('dashboard');
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('trustseal_user');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
    
    // Load mock documents
    const savedDocuments = localStorage.getItem('trustseal_documents');
    if (savedDocuments) {
      setDocuments(JSON.parse(savedDocuments));
    }
    
    setIsLoading(false);
  }, []);

  const handleLogin = async (email: string, password: string) => {
    try {
      const user = await mockAuthService.login(email, password);
      setCurrentUser(user);
      localStorage.setItem('trustseal_user', JSON.stringify(user));
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Invalid credentials' };
    }
  };

  const handleRegister = async (name: string, email: string, password: string) => {
    try {
      const user = await mockAuthService.register(name, email, password);
      setCurrentUser(user);
      localStorage.setItem('trustseal_user', JSON.stringify(user));
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Registration failed' };
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('trustseal_user');
    setCurrentPage('dashboard');
  };

  const handleFileUpload = async (file: File) => {
    if (!currentUser) return;

    const analysisResult = await mockAIService.analyzeDocument(file);
    
    const newDocument: Document = {
      id: Date.now().toString(),
      userId: currentUser.id,
      filename: file.name,
      fileType: file.type,
      uploadDate: new Date(),
      status: analysisResult.status,
      confidenceScore: analysisResult.confidenceScore,
      ocrText: analysisResult.ocrText,
      metadata: analysisResult.metadata,
      blockchainVerified: analysisResult.blockchainVerified,
      blockchainHash: analysisResult.blockchainHash,
      tamperingHeatmap: analysisResult.tamperingHeatmap,
      analysis: analysisResult.analysis,
      fileSize: file.size
    };

    const updatedDocuments = [newDocument, ...documents];
    setDocuments(updatedDocuments);
    localStorage.setItem('trustseal_documents', JSON.stringify(updatedDocuments));
    
    return newDocument;
  };

  const handleBulkUpload = async (files: File[]) => {
    if (!currentUser) return [];

    const results = [];
    for (const file of files) {
      const result = await handleFileUpload(file);
      if (result) results.push(result);
    }
    return results;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <Shield className="w-8 h-8 text-blue-600 animate-pulse" />
          <div className="text-xl font-semibold text-gray-700">Loading TrustSeal...</div>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} onRegister={handleRegister} />;
  }

  const userDocuments = documents.filter(doc => doc.userId === currentUser.id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Shield className="w-8 h-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">TrustSeal</h1>
                <p className="text-xs text-gray-600">AI that seals trust in every document</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-6">
              <button
                onClick={() => setCurrentPage('dashboard')}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentPage === 'dashboard' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Dashboard
              </button>
              <button
                onClick={() => setCurrentPage('upload')}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentPage === 'upload' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload
              </button>
              <button
                onClick={() => setCurrentPage('bulk')}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentPage === 'bulk' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                <Package className="w-4 h-4 mr-2" />
                Bulk Upload
              </button>
              <button
                onClick={() => setCurrentPage('trends')}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentPage === 'trends' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Trends
              </button>
              {currentUser.role === 'admin' && (
                <button
                  onClick={() => setCurrentPage('admin')}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentPage === 'admin' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-600 hover:text-blue-600'
                  }`}
                >
                  <Users className="w-4 h-4 mr-2" />
                  Admin
                </button>
              )}
            </nav>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <div className="hidden md:block text-right">
                <div className="text-sm font-medium text-gray-900">{currentUser.name}</div>
                <div className="text-xs text-gray-600">{currentUser.email}</div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-red-600 transition-colors"
              >
                <LogOut className="w-4 h-4 mr-1" />
                <span className="hidden sm:block">Logout</span>
              </button>
              
              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-md text-gray-600 hover:text-blue-600"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-4 py-2 space-y-1">
              <button
                onClick={() => {
                  setCurrentPage('dashboard');
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  currentPage === 'dashboard' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600'
                }`}
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Dashboard
              </button>
              <button
                onClick={() => {
                  setCurrentPage('upload');
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  currentPage === 'upload' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600'
                }`}
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload
              </button>
              <button
                onClick={() => {
                  setCurrentPage('bulk');
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  currentPage === 'bulk' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600'
                }`}
              >
                <Package className="w-4 h-4 mr-2" />
                Bulk Upload
              </button>
              <button
                onClick={() => {
                  setCurrentPage('trends');
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  currentPage === 'trends' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600'
                }`}
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Trends
              </button>
              {currentUser.role === 'admin' && (
                <button
                  onClick={() => {
                    setCurrentPage('admin');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                    currentPage === 'admin' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-600'
                  }`}
                >
                  <Users className="w-4 h-4 mr-2" />
                  Admin
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentPage === 'dashboard' && (
          <Dashboard documents={userDocuments} />
        )}
        {currentPage === 'upload' && (
          <UploadPage onFileUpload={handleFileUpload} />
        )}
        {currentPage === 'bulk' && (
          <BulkUpload onBulkUpload={handleBulkUpload} />
        )}
        {currentPage === 'trends' && (
          <ConfidenceTrends documents={userDocuments} />
        )}
        {currentPage === 'admin' && currentUser.role === 'admin' && (
          <AdminPanel documents={documents} />
        )}
      </main>
    </div>
  );
}

export default App;