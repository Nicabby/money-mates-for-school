'use client';

import React, { useState } from 'react';
import { Expense, Category } from '@/types/expense';

interface CloudExportHubProps {
  isOpen: boolean;
  onClose: () => void;
  expenses: Expense[];
}

interface ExportTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'business' | 'personal' | 'tax' | 'analytics';
  fields: string[];
  filters?: {
    dateRange?: { months: number };
    categories?: Category[];
  };
}

interface ExportHistory {
  id: string;
  template: string;
  destination: string;
  timestamp: string;
  status: 'completed' | 'processing' | 'failed';
  recordCount: number;
  fileSize: string;
  shareLink?: string;
}

interface Integration {
  id: string;
  name: string;
  icon: string;
  connected: boolean;
  status: 'active' | 'syncing' | 'error' | 'disconnected';
  lastSync?: string;
  autoSync?: boolean;
  description: string;
}

const CloudExportHub: React.FC<CloudExportHubProps> = ({ isOpen, onClose, expenses }) => {
  const [activeTab, setActiveTab] = useState<'export' | 'share' | 'integrations' | 'history' | 'templates'>('export');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [selectedIntegration, setSelectedIntegration] = useState<string>('');
  const [shareSettings, setShareSettings] = useState({
    publicAccess: false,
    password: '',
    expiresIn: '7d',
    allowDownload: true
  });
  const [emailSettings, setEmailSettings] = useState({
    recipients: '',
    subject: '',
    message: '',
    schedule: 'once'
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState('');

  // Calculate real statistics from expenses
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const totalRecords = expenses.length;
  const latestExpenseDate = expenses.length > 0 ? 
    new Date(Math.max(...expenses.map(e => new Date(e.date).getTime()))).toLocaleDateString() : 
    'No expenses';

  const exportTemplates: ExportTemplate[] = [
    {
      id: 'tax-report',
      name: 'Tax Report',
      description: 'IRS-ready expense report with category totals',
      icon: '📊',
      category: 'tax',
      fields: ['Date', 'Category', 'Amount', 'Description', 'Tax Category'],
      filters: { dateRange: { months: 12 } }
    },
    {
      id: 'monthly-summary',
      name: 'Monthly Summary',
      description: 'Monthly expense breakdown with trends',
      icon: '📈',
      category: 'analytics',
      fields: ['Month', 'Category', 'Total', 'Average', 'Trend'],
      filters: { dateRange: { months: 6 } }
    },
    {
      id: 'category-analysis',
      name: 'Category Analysis',
      description: 'Detailed spending analysis by category',
      icon: '🏷️',
      category: 'analytics',
      fields: ['Category', 'Total', 'Percentage', 'Count', 'Average']
    },
    {
      id: 'receipt-backup',
      name: 'Receipt Backup',
      description: 'Complete transaction record for backup',
      icon: '🗂️',
      category: 'business',
      fields: ['Date', 'Amount', 'Category', 'Description', 'ID', 'Created', 'Updated']
    },
    {
      id: 'budget-tracker',
      name: 'Budget Tracker',
      description: 'Budget vs actual spending comparison',
      icon: '💰',
      category: 'personal',
      fields: ['Category', 'Budget', 'Actual', 'Variance', 'Percentage']
    },
    {
      id: 'quarterly-review',
      name: 'Quarterly Review',
      description: 'Executive summary for quarterly reviews',
      icon: '📋',
      category: 'business',
      fields: ['Quarter', 'Total', 'Growth', 'Top Categories', 'Key Metrics']
    }
  ];

  const integrations: Integration[] = [
    {
      id: 'google-sheets',
      name: 'Google Sheets',
      icon: '📊',
      connected: true,
      status: 'active',
      lastSync: '2 minutes ago',
      autoSync: true,
      description: 'Sync expenses to Google Sheets in real-time'
    },
    {
      id: 'dropbox',
      name: 'Dropbox',
      icon: '📦',
      connected: true,
      status: 'syncing',
      lastSync: 'Syncing now...',
      autoSync: false,
      description: 'Backup export files to Dropbox'
    },
    {
      id: 'onedrive',
      name: 'OneDrive',
      icon: '☁️',
      connected: false,
      status: 'disconnected',
      description: 'Microsoft OneDrive integration'
    },
    {
      id: 'slack',
      name: 'Slack',
      icon: '💬',
      connected: true,
      status: 'active',
      lastSync: '1 hour ago',
      autoSync: false,
      description: 'Send export notifications to Slack'
    },
    {
      id: 'zapier',
      name: 'Zapier',
      icon: '⚡',
      connected: false,
      status: 'disconnected',
      description: 'Connect to 5000+ apps via Zapier'
    },
    {
      id: 'quickbooks',
      name: 'QuickBooks',
      icon: '💼',
      connected: true,
      status: 'error',
      lastSync: '3 days ago',
      description: 'Sync to QuickBooks accounting'
    }
  ];

  const exportHistory: ExportHistory[] = [
    {
      id: '1',
      template: 'Monthly Summary',
      destination: 'Email → john@company.com',
      timestamp: '2025-01-17 14:30',
      status: 'completed',
      recordCount: 45,
      fileSize: '12.3 KB',
      shareLink: 'https://expensetracker.app/share/abc123'
    },
    {
      id: '2',
      template: 'Tax Report',
      destination: 'Google Sheets',
      timestamp: '2025-01-17 12:15',
      status: 'completed',
      recordCount: 156,
      fileSize: '28.7 KB'
    },
    {
      id: '3',
      template: 'Category Analysis',
      destination: 'Dropbox',
      timestamp: '2025-01-17 09:45',
      status: 'processing',
      recordCount: 89,
      fileSize: '15.2 KB'
    },
    {
      id: '4',
      template: 'Receipt Backup',
      destination: 'Email → team@company.com',
      timestamp: '2025-01-16 16:20',
      status: 'failed',
      recordCount: 203,
      fileSize: '45.1 KB'
    }
  ];

  const handleExportToIntegration = async (templateId: string, integrationId: string) => {
    setIsProcessing(true);
    setProcessingStatus('Connecting to service...');
    
    // Simulate API call
    setTimeout(() => {
      setProcessingStatus('Generating export...');
      setTimeout(() => {
        setProcessingStatus('Uploading to cloud...');
        setTimeout(() => {
          setProcessingStatus('Complete!');
          setIsProcessing(false);
          // Add to history
          alert(`Successfully exported to ${integrations.find(i => i.id === integrationId)?.name}!`);
        }, 1000);
      }, 1500);
    }, 1000);
  };

  const handleEmailExport = async () => {
    if (!emailSettings.recipients || !selectedTemplate) return;
    
    setIsProcessing(true);
    setProcessingStatus('Preparing email...');
    
    setTimeout(() => {
      setProcessingStatus('Sending email...');
      setTimeout(() => {
        setProcessingStatus('Email sent!');
        setIsProcessing(false);
        alert(`Email sent to ${emailSettings.recipients}!`);
      }, 1500);
    }, 1000);
  };

  const generateShareLink = () => {
    const shareId = Math.random().toString(36).substring(2, 8);
    const link = `https://expensetracker.app/share/${shareId}`;
    navigator.clipboard.writeText(link);
    alert('Share link copied to clipboard!');
  };

  const generateQRCode = () => {
    // In a real app, you'd generate an actual QR code
    alert('QR code generated! (This would open a QR code modal in a real app)');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-2xl">☁️</div>
              <div>
                <h2 className="text-2xl font-bold">Cloud Export Hub</h2>
                <p className="text-blue-100">Connect, Share, and Sync Your Data</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 bg-gray-50">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'export', label: 'Export', icon: '📤' },
              { id: 'share', label: 'Share', icon: '🔗' },
              { id: 'integrations', label: 'Integrations', icon: '🔌' },
              { id: 'history', label: 'History', icon: '📋' },
              { id: 'templates', label: 'Templates', icon: '📄' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'export' | 'share' | 'integrations' | 'history' | 'templates')}
                className={`py-3 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {activeTab === 'export' && (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">🚀 Quick Export</h3>
                <p className="text-blue-700 text-sm">Select a template and destination to export your data instantly</p>
                <div className="mt-3 text-sm text-blue-600">
                  📊 {totalRecords} records • 💰 ${totalExpenses.toLocaleString()} total • 📅 Latest: {latestExpenseDate}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Template Selection */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Choose Template</h4>
                  <div className="space-y-2">
                    {exportTemplates.map(template => (
                      <button
                        key={template.id}
                        onClick={() => setSelectedTemplate(template.id)}
                        className={`w-full text-left p-3 rounded-lg border transition-colors ${
                          selectedTemplate === template.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{template.icon}</span>
                          <div>
                            <div className="font-medium">{template.name}</div>
                            <div className="text-sm text-gray-600">{template.description}</div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Destination Selection */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Choose Destination</h4>
                  <div className="space-y-2">
                    {integrations.filter(i => i.connected).map(integration => (
                      <button
                        key={integration.id}
                        onClick={() => setSelectedIntegration(integration.id)}
                        className={`w-full text-left p-3 rounded-lg border transition-colors ${
                          selectedIntegration === integration.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{integration.icon}</span>
                            <div>
                              <div className="font-medium">{integration.name}</div>
                              <div className="text-sm text-gray-600">{integration.description}</div>
                            </div>
                          </div>
                          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                            integration.status === 'active' ? 'bg-green-100 text-green-800' :
                            integration.status === 'syncing' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {integration.status}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Export Button */}
              <div className="flex justify-center">
                <button
                  onClick={() => handleExportToIntegration(selectedTemplate, selectedIntegration)}
                  disabled={!selectedTemplate || !selectedIntegration || isProcessing}
                  className="btn btn-primary px-8 py-3 text-lg"
                >
                  {isProcessing ? (
                    <>
                      <span className="animate-spin mr-2">⏳</span>
                      {processingStatus}
                    </>
                  ) : (
                    '🚀 Export Now'
                  )}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'share' && (
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-900 mb-2">🔗 Share Your Data</h3>
                <p className="text-green-700 text-sm">Create secure, shareable links or send data via email</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Email Export */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">📧 Email Export</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="form-label">Template</label>
                      <select
                        value={selectedTemplate}
                        onChange={(e) => setSelectedTemplate(e.target.value)}
                        className="form-input"
                      >
                        <option value="">Select template...</option>
                        {exportTemplates.map(template => (
                          <option key={template.id} value={template.id}>
                            {template.icon} {template.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="form-label">Recipients</label>
                      <input
                        type="email"
                        value={emailSettings.recipients}
                        onChange={(e) => setEmailSettings(prev => ({ ...prev, recipients: e.target.value }))}
                        className="form-input"
                        placeholder="user@example.com, team@company.com"
                      />
                    </div>
                    <div>
                      <label className="form-label">Subject</label>
                      <input
                        type="text"
                        value={emailSettings.subject}
                        onChange={(e) => setEmailSettings(prev => ({ ...prev, subject: e.target.value }))}
                        className="form-input"
                        placeholder="Monthly Expense Report"
                      />
                    </div>
                    <div>
                      <label className="form-label">Message</label>
                      <textarea
                        value={emailSettings.message}
                        onChange={(e) => setEmailSettings(prev => ({ ...prev, message: e.target.value }))}
                        className="form-input h-20"
                        placeholder="Please find attached the expense report..."
                      />
                    </div>
                    <div>
                      <label className="form-label">Schedule</label>
                      <select
                        value={emailSettings.schedule}
                        onChange={(e) => setEmailSettings(prev => ({ ...prev, schedule: e.target.value }))}
                        className="form-input"
                      >
                        <option value="once">Send once</option>
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                    </div>
                    <button
                      onClick={handleEmailExport}
                      disabled={!emailSettings.recipients || !selectedTemplate || isProcessing}
                      className="btn btn-primary w-full"
                    >
                      {isProcessing ? 'Sending...' : '📧 Send Email'}
                    </button>
                  </div>
                </div>

                {/* Share Links */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">🔗 Share Links</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="form-label">Access Settings</label>
                      <div className="space-y-2">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={shareSettings.publicAccess}
                            onChange={(e) => setShareSettings(prev => ({ ...prev, publicAccess: e.target.checked }))}
                          />
                          <span className="text-sm">Public access (no login required)</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={shareSettings.allowDownload}
                            onChange={(e) => setShareSettings(prev => ({ ...prev, allowDownload: e.target.checked }))}
                          />
                          <span className="text-sm">Allow downloads</span>
                        </label>
                      </div>
                    </div>
                    <div>
                      <label className="form-label">Password Protection</label>
                      <input
                        type="password"
                        value={shareSettings.password}
                        onChange={(e) => setShareSettings(prev => ({ ...prev, password: e.target.value }))}
                        className="form-input"
                        placeholder="Optional password"
                      />
                    </div>
                    <div>
                      <label className="form-label">Expires In</label>
                      <select
                        value={shareSettings.expiresIn}
                        onChange={(e) => setShareSettings(prev => ({ ...prev, expiresIn: e.target.value }))}
                        className="form-input"
                      >
                        <option value="1d">1 day</option>
                        <option value="7d">7 days</option>
                        <option value="30d">30 days</option>
                        <option value="never">Never</option>
                      </select>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={generateShareLink}
                        className="btn btn-secondary flex-1"
                      >
                        🔗 Generate Link
                      </button>
                      <button
                        onClick={generateQRCode}
                        className="btn btn-secondary flex-1"
                      >
                        📱 QR Code
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'integrations' && (
            <div className="space-y-6">
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h3 className="font-semibold text-purple-900 mb-2">🔌 Connected Services</h3>
                <p className="text-purple-700 text-sm">Manage your integrations and sync settings</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {integrations.map(integration => (
                  <div key={integration.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{integration.icon}</span>
                        <div>
                          <div className="font-medium">{integration.name}</div>
                          <div className="text-sm text-gray-600">{integration.description}</div>
                        </div>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        integration.status === 'active' ? 'bg-green-100 text-green-800' :
                        integration.status === 'syncing' ? 'bg-yellow-100 text-yellow-800' :
                        integration.status === 'error' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {integration.status}
                      </div>
                    </div>
                    
                    {integration.connected && (
                      <div className="text-sm text-gray-600 mb-3">
                        Last sync: {integration.lastSync}
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {integration.connected && (
                          <label className="flex items-center gap-1 text-sm">
                            <input
                              type="checkbox"
                              checked={integration.autoSync}
                              onChange={() => {}}
                            />
                            Auto-sync
                          </label>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {integration.connected ? (
                          <>
                            <button className="btn btn-secondary text-sm">⚙️ Settings</button>
                            <button className="btn btn-danger text-sm">Disconnect</button>
                          </>
                        ) : (
                          <button className="btn btn-primary text-sm">Connect</button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-6">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-semibold text-yellow-900 mb-2">📋 Export History</h3>
                <p className="text-yellow-700 text-sm">View and manage your previous exports</p>
              </div>

              <div className="space-y-3">
                {exportHistory.map(item => (
                  <div key={item.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">
                          {exportTemplates.find(t => t.name === item.template)?.icon || '📄'}
                        </div>
                        <div>
                          <div className="font-medium">{item.template}</div>
                          <div className="text-sm text-gray-600">{item.destination}</div>
                        </div>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.status === 'completed' ? 'bg-green-100 text-green-800' :
                        item.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {item.status}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center gap-4">
                        <span>🕐 {item.timestamp}</span>
                        <span>📊 {item.recordCount} records</span>
                        <span>📁 {item.fileSize}</span>
                      </div>
                      <div className="flex gap-2">
                        {item.shareLink && (
                          <button className="text-blue-600 hover:text-blue-800">🔗 Share</button>
                        )}
                        {item.status === 'completed' && (
                          <button className="text-green-600 hover:text-green-800">📥 Download</button>
                        )}
                        {item.status === 'failed' && (
                          <button className="text-red-600 hover:text-red-800">🔄 Retry</button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'templates' && (
            <div className="space-y-6">
              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                <h3 className="font-semibold text-indigo-900 mb-2">📄 Export Templates</h3>
                <p className="text-indigo-700 text-sm">Pre-configured templates for different use cases</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {exportTemplates.map(template => (
                  <div key={template.id} className="border rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl">{template.icon}</span>
                      <div>
                        <div className="font-medium">{template.name}</div>
                        <div className="text-sm text-gray-600">{template.description}</div>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <div className="text-sm font-medium text-gray-700 mb-1">Included Fields:</div>
                      <div className="flex flex-wrap gap-1">
                        {template.fields.map(field => (
                          <span key={field} className="px-2 py-1 bg-gray-100 text-xs rounded">
                            {field}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        template.category === 'business' ? 'bg-blue-100 text-blue-800' :
                        template.category === 'personal' ? 'bg-green-100 text-green-800' :
                        template.category === 'tax' ? 'bg-red-100 text-red-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {template.category}
                      </div>
                      <div className="flex gap-2">
                        <button className="btn btn-secondary text-sm">✏️ Edit</button>
                        <button className="btn btn-primary text-sm">📤 Use</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CloudExportHub;