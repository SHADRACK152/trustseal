import React from 'react';
import { TrendingUp, TrendingDown, Minus, BarChart3 } from 'lucide-react';
import { Document } from '../types';

interface ConfidenceTrendsProps {
  documents: Document[];
}

const ConfidenceTrends: React.FC<ConfidenceTrendsProps> = ({ documents }) => {
  if (documents.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <BarChart3 className="w-5 h-5 mr-2" />
          Confidence Trends
        </h3>
        <div className="text-center py-8">
          <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600">No data available for trend analysis</p>
        </div>
      </div>
    );
  }

  // Sort documents by date
  const sortedDocs = [...documents].sort((a, b) => 
    new Date(a.uploadDate).getTime() - new Date(b.uploadDate).getTime()
  );

  // Group by date and calculate average confidence
  const dailyData = sortedDocs.reduce((acc, doc) => {
    const date = new Date(doc.uploadDate).toDateString();
    if (!acc[date]) {
      acc[date] = { total: 0, count: 0, authentic: 0, suspicious: 0, fraudulent: 0 };
    }
    acc[date].total += doc.confidenceScore;
    acc[date].count += 1;
    acc[date][doc.status] += 1;
    return acc;
  }, {} as Record<string, { total: number; count: number; authentic: number; suspicious: number; fraudulent: number }>);

  const trendData = Object.entries(dailyData).map(([date, data]) => ({
    date,
    avgConfidence: data.total / data.count,
    count: data.count,
    authentic: data.authentic,
    suspicious: data.suspicious,
    fraudulent: data.fraudulent
  }));

  // Calculate trend direction
  const getTrendDirection = () => {
    if (trendData.length < 2) return 'stable';
    const recent = trendData.slice(-3).reduce((sum, d) => sum + d.avgConfidence, 0) / Math.min(3, trendData.length);
    const earlier = trendData.slice(0, -3).reduce((sum, d) => sum + d.avgConfidence, 0) / Math.max(1, trendData.length - 3);
    
    if (recent > earlier + 0.05) return 'up';
    if (recent < earlier - 0.05) return 'down';
    return 'stable';
  };

  const trendDirection = getTrendDirection();
  const overallAvg = documents.reduce((sum, doc) => sum + doc.confidenceScore, 0) / documents.length;

  const getTrendIcon = () => {
    switch (trendDirection) {
      case 'up': return <TrendingUp className="w-5 h-5 text-green-600" />;
      case 'down': return <TrendingDown className="w-5 h-5 text-red-600" />;
      default: return <Minus className="w-5 h-5 text-gray-600" />;
    }
  };

  const getTrendColor = () => {
    switch (trendDirection) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <BarChart3 className="w-5 h-5 mr-2" />
          Confidence Trends
        </h3>
        <div className={`flex items-center ${getTrendColor()}`}>
          {getTrendIcon()}
          <span className="ml-1 text-sm font-medium">
            {trendDirection === 'up' ? 'Improving' : 
             trendDirection === 'down' ? 'Declining' : 'Stable'}
          </span>
        </div>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">
            {(overallAvg * 100).toFixed(1)}%
          </div>
          <div className="text-sm text-gray-600">Average Confidence</div>
        </div>
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">
            {documents.filter(d => d.status === 'authentic').length}
          </div>
          <div className="text-sm text-gray-600">Authentic Documents</div>
        </div>
        <div className="text-center p-4 bg-red-50 rounded-lg">
          <div className="text-2xl font-bold text-red-600">
            {documents.filter(d => d.status === 'fraudulent').length}
          </div>
          <div className="text-sm text-gray-600">Fraudulent Documents</div>
        </div>
      </div>

      {/* Trend Chart */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-900">Daily Analysis Summary</h4>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {trendData.map((day, index) => (
            <div key={day.date} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <div className="font-medium text-gray-900">
                  {new Date(day.date).toLocaleDateString()}
                </div>
                <div className="text-sm text-gray-600">
                  {day.count} document{day.count !== 1 ? 's' : ''} analyzed
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className={`text-lg font-bold ${
                    day.avgConfidence > 0.8 ? 'text-green-600' :
                    day.avgConfidence > 0.5 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {(day.avgConfidence * 100).toFixed(1)}%
                  </div>
                  <div className="text-xs text-gray-500">avg confidence</div>
                </div>
                <div className="flex space-x-1">
                  {day.authentic > 0 && (
                    <div className="w-3 h-3 bg-green-500 rounded-full" title={`${day.authentic} authentic`} />
                  )}
                  {day.suspicious > 0 && (
                    <div className="w-3 h-3 bg-yellow-500 rounded-full" title={`${day.suspicious} suspicious`} />
                  )}
                  {day.fraudulent > 0 && (
                    <div className="w-3 h-3 bg-red-500 rounded-full" title={`${day.fraudulent} fraudulent`} />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Insights */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">Insights</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• {((documents.filter(d => d.status === 'authentic').length / documents.length) * 100).toFixed(1)}% of documents are verified as authentic</li>
          <li>• Average processing confidence score is {(overallAvg * 100).toFixed(1)}%</li>
          {trendDirection === 'up' && <li>• Document quality trend is improving over time</li>}
          {trendDirection === 'down' && <li>• Consider reviewing document sources - quality trend declining</li>}
          {documents.filter(d => d.blockchainVerified).length > 0 && (
            <li>• {documents.filter(d => d.blockchainVerified).length} documents verified on blockchain</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default ConfidenceTrends;