import { User, AnalysisResult } from '../types';

export const mockAuthService = {
  async login(email: string, password: string): Promise<User> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock admin user
    if (email === 'admin@trustseal.com' && password === 'admin') {
      return {
        id: 'admin-1',
        name: 'Admin User',
        email: 'admin@trustseal.com',
        role: 'admin',
        createdAt: new Date()
      };
    }
    
    // Mock regular user
    if (email === 'user@example.com' && password === 'password') {
      return {
        id: 'user-1',
        name: 'John Doe',
        email: 'user@example.com',
        role: 'user',
        createdAt: new Date()
      };
    }
    
    // Allow any email/password for demo
    return {
      id: Date.now().toString(),
      name: email.split('@')[0],
      email,
      role: email.includes('admin') ? 'admin' : 'user',
      createdAt: new Date()
    };
  },

  async register(name: string, email: string, password: string): Promise<User> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    return {
      id: Date.now().toString(),
      name,
      email,
      role: email.includes('admin') ? 'admin' : 'user',
      createdAt: new Date()
    };
  }
};

export const mockAIService = {
  async analyzeDocument(file: File): Promise<AnalysisResult> {
    // Simulate AI analysis time
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000));
    
    const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';
    const isImage = ['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension);
    const isPdf = fileExtension === 'pdf';
    const isDoc = ['doc', 'docx'].includes(fileExtension);
    
    // Mock OCR text extraction
    const mockOcrTexts = [
      "CERTIFICATE OF COMPLETION\nThis is to certify that John Doe has successfully completed the Advanced Data Science Course on December 15, 2024.",
      "OFFICIAL TRANSCRIPT\nStudent: Jane Smith\nGPA: 3.85\nDegree: Bachelor of Science in Computer Science\nGraduation Date: May 2024",
      "EMPLOYMENT VERIFICATION\nThis letter confirms that Michael Johnson has been employed as Senior Software Engineer since January 2023.",
      "IDENTITY DOCUMENT\nName: Sarah Wilson\nDate of Birth: March 12, 1995\nDocument Number: ID123456789\nExpiry Date: March 2029"
    ];
    
    // Mock metadata
    const mockMetadata = {
      creationDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
      lastModified: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      software: isPdf ? ['Adobe Acrobat Pro', 'Microsoft Word', 'LibreOffice', 'PDFCreator'][Math.floor(Math.random() * 4)] :
                isDoc ? ['Microsoft Word 2019', 'Google Docs', 'LibreOffice Writer'][Math.floor(Math.random() * 3)] :
                ['Adobe Photoshop', 'GIMP', 'Canva', 'iPhone Camera'][Math.floor(Math.random() * 4)],
      author: ['John Doe', 'System Administrator', 'HR Department', ''][Math.floor(Math.random() * 4)],
      producer: isPdf ? 'PDF Library 1.2' : undefined
    };
    
    // Mock blockchain verification
    const blockchainVerified = Math.random() > 0.4; // 60% chance of being verified
    const blockchainHash = blockchainVerified ? 
      '0x' + Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('') : 
      undefined;
    
    // Mock tampering heatmap for images
    const tamperingHeatmap = isImage && Math.random() > 0.6 ? [
      { x: Math.random() * 300, y: Math.random() * 200, width: 50 + Math.random() * 100, height: 20 + Math.random() * 40, severity: 'high' as const },
      { x: Math.random() * 300, y: Math.random() * 200, width: 30 + Math.random() * 60, height: 15 + Math.random() * 30, severity: 'medium' as const }
    ] : [];
    
    // Generate realistic mock results based on file type
    const mockResults = [
      {
        status: 'authentic' as const,
        confidenceScore: 0.92 + Math.random() * 0.07,
        ocrText: mockOcrTexts[Math.floor(Math.random() * mockOcrTexts.length)],
        metadata: mockMetadata,
        blockchainVerified,
        blockchainHash,
        tamperingHeatmap: [],
        analysis: {
          textExtracted: true,
          metadataCheck: true,
          fontConsistency: true,
          watermarkPresent: isPdf || Math.random() > 0.3,
          suspiciousEdits: false,
          hiddenTextDetected: false,
          fontMismatches: [],
          typosDetected: [],
          anomalies: [],
          aiSuggestions: [
            "Document appears authentic with consistent formatting",
            "All security features are present and valid",
            "Metadata indicates legitimate creation process"
          ].filter(() => Math.random() > 0.5)
        }
      },
      {
        status: 'suspicious' as const,
        confidenceScore: 0.45 + Math.random() * 0.4,
        ocrText: mockOcrTexts[Math.floor(Math.random() * mockOcrTexts.length)],
        metadata: {
          ...mockMetadata,
          lastModified: new Date().toISOString(), // Recently modified
          software: 'Adobe Photoshop CC' // Suspicious for documents
        },
        blockchainVerified: Math.random() > 0.7,
        blockchainHash: Math.random() > 0.7 ? blockchainHash : undefined,
        tamperingHeatmap: tamperingHeatmap.slice(0, 1),
        analysis: {
          textExtracted: true,
          metadataCheck: Math.random() > 0.5,
          fontConsistency: Math.random() > 0.3,
          watermarkPresent: Math.random() > 0.7,
          suspiciousEdits: Math.random() > 0.4,
          hiddenTextDetected: Math.random() > 0.6,
          fontMismatches: ['Arial mixed with Times New Roman in paragraph 2', 'Inconsistent font sizes detected'].filter(() => Math.random() > 0.5),
          typosDetected: ['Misspelled "recieve" should be "receive"', 'Grammar error in line 3'].filter(() => Math.random() > 0.6),
          anomalies: [
            'Inconsistent font sizing detected',
            'Metadata timestamp anomaly',
            'Document modified after creation date',
            'Unusual software used for document type'
          ].filter(() => Math.random() > 0.5),
          aiSuggestions: [
            "Document may have been edited after initial creation",
            "Consider requesting original document from issuing authority",
            "Multiple editing sessions detected in metadata"
          ].filter(() => Math.random() > 0.4)
        }
      },
      {
        status: 'fraudulent' as const,
        confidenceScore: 0.15 + Math.random() * 0.25,
        ocrText: mockOcrTexts[Math.floor(Math.random() * mockOcrTexts.length)],
        metadata: {
          ...mockMetadata,
          creationDate: new Date().toISOString(), // Created today (suspicious for old documents)
          software: 'Adobe Photoshop CC',
          author: 'Unknown'
        },
        blockchainVerified: false,
        blockchainHash: undefined,
        tamperingHeatmap,
        analysis: {
          textExtracted: true,
          metadataCheck: false,
          fontConsistency: false,
          watermarkPresent: false,
          suspiciousEdits: true,
          hiddenTextDetected: true,
          fontMismatches: [
            'Multiple font families in single paragraph',
            'Inconsistent character spacing',
            'Font rendering quality varies across document'
          ],
          typosDetected: [
            'Multiple spelling errors suggest automated generation',
            'Grammar inconsistencies throughout document',
            'Unusual character substitutions detected'
          ],
          anomalies: [
            'Multiple font families detected in single paragraph',
            'Digital signature missing or invalid',
            'Metadata indicates recent modifications',
            'Text overlay patterns suggest tampering',
            'Hidden text layers detected',
            'Inconsistent image compression',
            'Suspicious editing software detected'
          ].filter(() => Math.random() > 0.3),
          aiSuggestions: [
            "Document shows clear signs of digital manipulation",
            "Recommend immediate verification with issuing authority",
            "Multiple red flags indicate likely forgery",
            "Consider reporting to relevant authorities"
          ]
        }
      }
    ];
    
    // Weight results based on file type for more realistic demo
    let weights;
    if (isPdf) {
      weights = [0.6, 0.25, 0.15]; // PDFs more likely to be authentic
    } else if (isImage) {
      weights = [0.4, 0.35, 0.25]; // Images more suspicious
    } else if (isDoc) {
      weights = [0.5, 0.35, 0.15]; // Word docs moderately suspicious
    } else {
      weights = [0.5, 0.3, 0.2]; // Other documents
    }
    
    const random = Math.random();
    let selectedIndex = 0;
    let cumulativeWeight = 0;
    
    for (let i = 0; i < weights.length; i++) {
      cumulativeWeight += weights[i];
      if (random <= cumulativeWeight) {
        selectedIndex = i;
        break;
      }
    }
    
    return mockResults[selectedIndex];
  }
};