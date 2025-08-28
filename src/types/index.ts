export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: Date;
}

export interface Document {
  id: string;
  userId: string;
  filename: string;
  fileType: string;
  fileSize: number;
  uploadDate: Date;
  status: 'authentic' | 'suspicious' | 'fraudulent';
  confidenceScore: number;
  ocrText?: string;
  metadata?: {
    creationDate?: string;
    lastModified?: string;
    software?: string;
    author?: string;
    producer?: string;
  };
  blockchainVerified?: boolean;
  blockchainHash?: string;
  tamperingHeatmap?: Array<{x: number, y: number, width: number, height: number, severity: 'low' | 'medium' | 'high'}>;
  analysis: {
    textExtracted: boolean;
    metadataCheck: boolean;
    fontConsistency: boolean;
    watermarkPresent: boolean;
    suspiciousEdits: boolean;
    hiddenTextDetected: boolean;
    fontMismatches: string[];
    typosDetected: string[];
    anomalies: string[];
    aiSuggestions: string[];
  };
}

export interface AnalysisResult {
  status: 'authentic' | 'suspicious' | 'fraudulent';
  confidenceScore: number;
  ocrText?: string;
  metadata?: {
    creationDate?: string;
    lastModified?: string;
    software?: string;
    author?: string;
    producer?: string;
  };
  blockchainVerified?: boolean;
  blockchainHash?: string;
  tamperingHeatmap?: Array<{x: number, y: number, width: number, height: number, severity: 'low' | 'medium' | 'high'}>;
  analysis: {
    textExtracted: boolean;
    metadataCheck: boolean;
    fontConsistency: boolean;
    watermarkPresent: boolean;
    suspiciousEdits: boolean;
    hiddenTextDetected: boolean;
    fontMismatches: string[];
    typosDetected: string[];
    anomalies: string[];
    aiSuggestions: string[];
  };
}