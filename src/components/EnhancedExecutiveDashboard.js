import React, { useState, useEffect, useRef } from 'react';
import Papa from 'papaparse';
import { Mic, Image, Download, Bookmark, BookmarkCheck, Share2, MessageSquare, X, Send, FileText } from 'lucide-react';

const EnhancedExecutiveDashboard = () => {
  // State management
  const [documents, setDocuments] = useState([]);
  const [filteredDocs, setFilteredDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeDocument, setActiveDocument] = useState(null);
  const [bookmarkedDocs, setBookmarkedDocs] = useState([]);
  const [readingProgress, setReadingProgress] = useState({});
  const [annotations, setAnnotations] = useState({});
  const [uniqueAudiences, setUniqueAudiences] = useState([]);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { role: 'system', content: 'Hello! I can help you find information about Neural Ennead documents. Ask me anything!' }
  ]);
  const [userInput, setUserInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [filters, setFilters] = useState({
    priority: 'all',
    audience: 'all',
    bookmarked: false,
    inProgress: false,
    searchQuery: ''
  });
  
  // State for file upload
  const [isUploading, setIsUploading] = useState(false);
  const csvFileInputRef = useRef(null);
  
  const chatEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Load demo data and provide file upload capability
  useEffect(() => {
    const loadData = () => {
      // Use demo data
      const demoData = [
        {
          "File Name": "Neural Ennead Architecture Overview",
          "Summary": "Overview of the key components and principles behind the Neural Ennead architecture, including its nine-layer structure and integration capabilities.",
          "Key Takeaway": "Neural Ennead's modular design allows for unprecedented flexibility in AI deployment across enterprise systems.",
          "Decision or Action Required": "Determine which business units should prioritize Neural Ennead integration in Q2.",
          "Priority Level": "High",
          "Audience": "Tech Leaders, Executive Board",
          "Dependencies": "None"
        },
        {
          "File Name": "Neural Ennead Implementation Roadmap",
          "Summary": "Strategic timeline for Neural Ennead deployment across all business units with milestones and resource requirements.",
          "Key Takeaway": "Full implementation requires 18 months with incremental benefits starting at month 3.",
          "Decision or Action Required": "Approve phased budget release for implementation team.",
          "Priority Level": "Critical",
          "Audience": "Finance, Executive Board, Tech Leaders",
          "Dependencies": "Budget approval, Technical foundation assessment"
        },
        {
          "File Name": "Neural Ennead Security Framework",
          "Summary": "Comprehensive overview of security protocols, compliance standards, and risk mitigation strategies for Neural Ennead deployment.",
          "Key Takeaway": "Neural Ennead exceeds industry security standards while maintaining performance advantages.",
          "Decision or Action Required": "Review and sign-off on security implementation plan.",
          "Priority Level": "High",
          "Audience": "Security Team, Compliance, Tech Leaders",
          "Dependencies": "Updated compliance requirements"
        },
        {
          "File Name": "Neural Ennead ROI Analysis",
          "Summary": "Detailed financial analysis of expected returns, cost savings, and productivity improvements from Neural Ennead implementation.",
          "Key Takeaway": "Projected 267% ROI over 5 years with break-even at month 22.",
          "Decision or Action Required": "Confirm financial projections align with quarterly targets.",
          "Priority Level": "Medium",
          "Audience": "Finance, Executive Board",
          "Dependencies": "Updated market analysis, Competitive benchmarking"
        },
        {
          "File Name": "Neural Ennead Competitive Advantage Report",
          "Summary": "Analysis of how Neural Ennead positions the company against key competitors and emerging market trends.",
          "Key Takeaway": "Neural Ennead provides 18-month competitive advantage in market response time and customer personalization.",
          "Decision or Action Required": "Determine which competitive advantages to highlight in upcoming investor briefing.",
          "Priority Level": "Medium",
          "Audience": "Executive Board, Marketing, Investor Relations",
          "Dependencies": "Competitive analysis report"
        }
      ];
      
      setDocuments(demoData);
      setFilteredDocs(demoData);
      
      // Extract unique audiences for filter dropdown
      const audiences = [...new Set(demoData.map(doc => 
        doc.Audience.split(',').map(a => a.trim())
      ).flat())];
      setUniqueAudiences(audiences);
      
      // Load saved user data from localStorage
      const savedBookmarks = JSON.parse(localStorage.getItem('bookmarkedDocs') || '[]');
      const savedProgress = JSON.parse(localStorage.getItem('readingProgress') || '{}');
      const savedAnnotations = JSON.parse(localStorage.getItem('annotations') || '{}');
      
      setBookmarkedDocs(savedBookmarks);
      setReadingProgress(savedProgress);
      setAnnotations(savedAnnotations);
      
      setLoading(false);
    };

    loadData();
  }, []);
  
  // Process uploaded CSV file
  const handleCSVUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setIsUploading(true);
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        Papa.parse(event.target.result, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            if (results.data && results.data.length > 0) {
              // Validate that the CSV has the required headers
              const requiredHeaders = ['File Name', 'Summary', 'Key Takeaway', 'Decision or Action Required', 'Priority Level', 'Audience', 'Dependencies'];
              const hasRequiredHeaders = requiredHeaders.every(header => 
                results.meta.fields.includes(header)
              );
              
              if (hasRequiredHeaders) {
                setDocuments(results.data);
                setFilteredDocs(results.data);
                
                // Extract unique audiences for filter dropdown
                const audiences = [...new Set(results.data.map(doc => 
                  doc.Audience.split(',').map(a => a.trim())
                ).flat())];
                setUniqueAudiences(audiences);
                
                alert('Documents successfully loaded from CSV file!');
              } else {
                alert('CSV file is missing required headers. Please check the format and try again.');
              }
            } else {
              alert('No data found in the CSV file or format is incorrect.');
            }
            setIsUploading(false);
          },
          error: (error) => {
            console.error("Error parsing CSV:", error);
            alert('Error parsing CSV: ' + error.message);
            setIsUploading(false);
          }
        });
      } catch (error) {
        console.error("Error processing file:", error);
        alert('Error processing file: ' + error.message);
        setIsUploading(false);
      }
    };
    
    reader.onerror = () => {
      alert('Error reading file');
      setIsUploading(false);
    };
    
    reader.readAsText(file);
  };

  // Apply filters
  useEffect(() => {
    let result = [...documents];
    
    // Filter by priority
    if (filters.priority !== 'all') {
      result = result.filter(doc => doc['Priority Level'] === filters.priority);
    }
    
    // Filter by audience
    if (filters.audience !== 'all') {
      result = result.filter(doc => 
        doc.Audience.split(',').map(a => a.trim()).includes(filters.audience)
      );
    }
    
    // Filter by bookmarked status
    if (filters.bookmarked) {
      result = result.filter(doc => bookmarkedDocs.includes(doc['File Name']));
    }
    
    // Filter by in-progress status
    if (filters.inProgress) {
      result = result.filter(doc => 
        readingProgress[doc['File Name']] && 
        readingProgress[doc['File Name']] > 0 && 
        readingProgress[doc['File Name']] < 100
      );
    }
    
    // Filter by search query
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      result = result.filter(doc => 
        doc['File Name'].toLowerCase().includes(query) || 
        doc.Summary.toLowerCase().includes(query) ||
        doc['Key Takeaway'].toLowerCase().includes(query)
      );
    }
    
    setFilteredDocs(result);
  }, [filters, documents, bookmarkedDocs, readingProgress]);

  // Scroll chat to bottom on new messages
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages]);

  // Filter handlers
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  // Toggle bookmark status
  const toggleBookmark = (docName) => {
    let updatedBookmarks;
    if (bookmarkedDocs.includes(docName)) {
      updatedBookmarks = bookmarkedDocs.filter(name => name !== docName);
    } else {
      updatedBookmarks = [...bookmarkedDocs, docName];
    }
    setBookmarkedDocs(updatedBookmarks);
    localStorage.setItem('bookmarkedDocs', JSON.stringify(updatedBookmarks));
  };

  // Update reading progress
  const updateReadingProgress = (docName, progress) => {
    const updatedProgress = {
      ...readingProgress,
      [docName]: progress
    };
    setReadingProgress(updatedProgress);
    localStorage.setItem('readingProgress', JSON.stringify(updatedProgress));
  };

  // Save annotation
  const saveAnnotation = (docName, annotation) => {
    const docAnnotations = annotations[docName] || [];
    const updatedAnnotations = {
      ...annotations,
      [docName]: [...docAnnotations, {
        id: Date.now(),
        text: annotation,
        timestamp: new Date().toISOString(),
        user: 'Current User'
      }]
    };
    setAnnotations(updatedAnnotations);
    localStorage.setItem('annotations', JSON.stringify(updatedAnnotations));
  };

  // Delete annotation
  const deleteAnnotation = (docName, annotationId) => {
    const docAnnotations = annotations[docName] || [];
    const updatedDocAnnotations = docAnnotations.filter(a => a.id !== annotationId);
    
    const updatedAnnotations = {
      ...annotations,
      [docName]: updatedDocAnnotations
    };
    
    setAnnotations(updatedAnnotations);
    localStorage.setItem('annotations', JSON.stringify(updatedAnnotations));
  };

  // Export document metadata
  const exportMetadata = (doc) => {
    const metadata = {
      title: doc['File Name'],
      summary: doc.Summary,
      audience: doc.Audience,
      keyTakeaway: doc['Key Takeaway'],
      actionRequired: doc['Decision or Action Required'],
      priorityLevel: doc['Priority Level'],
      dependencies: doc.Dependencies,
      readingProgress: readingProgress[doc['File Name']] || 0,
      annotations: annotations[doc['File Name']] || [],
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(metadata, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${doc['File Name'].replace(/\s+/g, '_')}_metadata.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Chat handlers
  const handleChatSubmit = (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;
    
    // Add user message
    setChatMessages(prev => [...prev, { role: 'user', content: userInput }]);
    
    // Simulate assistant response (in a real app, this would call an API)
    setTimeout(() => {
      let response = "I'm sorry, I don't have specific information about that. Would you like me to help you find a relevant document?";
      
      // Basic keyword matching for demo purposes
      const input = userInput.toLowerCase();
      const matchingDocs = documents.filter(doc => 
        doc['File Name'].toLowerCase().includes(input) || 
        doc.Summary.toLowerCase().includes(input)
      );
      
      if (matchingDocs.length > 0) {
        response = `I found ${matchingDocs.length} document(s) related to your query. The most relevant one is "${matchingDocs[0]['File Name']}". Would you like me to show you the details?`;
      }
      
      setChatMessages(prev => [...prev, { role: 'assistant', content: response }]);
    }, 1000);
    
    setUserInput('');
  };

  const toggleVoiceRecording = () => {
    // In a real implementation, this would use the Web Speech API
    setIsRecording(!isRecording);
    if (isRecording) {
      // Simulate voice recognition result
      setTimeout(() => {
        setUserInput("Tell me about Neural Ennead architecture");
        setIsRecording(false);
      }, 1500);
    }
  };

  const handleImageUpload = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    // In a real implementation, this would process the image
    if (e.target.files[0]) {
      setChatMessages(prev => [...prev, { 
        role: 'user', 
        content: 'Uploaded image: ' + e.target.files[0].name,
        isImage: true
      }]);
      
      // Simulate response
      setTimeout(() => {
        setChatMessages(prev => [...prev, { 
          role: 'assistant', 
          content: "I've analyzed your diagram. It appears to be related to neural network architecture. Would you like me to find documents about Neural Ennead architecture?"
        }]);
      }, 1500);
    }
  };

  // Open document in Google Docs
  const openInGoogleDocs = (docName) => {
    // In a real implementation, this would open the document in Google Docs
    // or redirect to a Google Docs URL
    alert(`Opening "${docName}" in Google Docs...`);
    
    // Update reading progress (simulate)
    if (!readingProgress[docName] || readingProgress[docName] < 10) {
      updateReadingProgress(docName, 10);
    }
  };

  // Utility functions
  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'Critical': return 'bg-red-100 text-red-800';
      case 'High': return 'bg-orange-100 text-orange-800';
      case 'Medium': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 100) return 'bg-green-500';
    if (progress > 50) return 'bg-blue-500';
    return 'bg-amber-500';
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl text-gray-600">Loading document data...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Executive Guide to Neural Ennead</h1>
      
      <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-6">
        <div className="flex justify-between items-center">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-amber-700">
                Currently using demo data. Upload your own Neural Ennead document repository CSV for real data.
              </p>
            </div>
          </div>
          <div>
            <input 
              type="file" 
              ref={csvFileInputRef} 
              className="hidden" 
              accept=".csv" 
              onChange={handleCSVUpload}
            />
            <button
              onClick={() => csvFileInputRef.current.click()}
              disabled={isUploading}
              className={`px-4 py-2 rounded-md text-sm font-medium ${isUploading 
                ? 'bg-gray-300 text-gray-500' 
                : 'bg-blue-600 text-white hover:bg-blue-700'}`}
            >
              {isUploading ? 'Uploading...' : 'Upload CSV'}
            </button>
          </div>
        </div>
      </div>
      
      {/* Chatbot Widget */}
      <div className={`fixed bottom-4 right-4 z-10 transition-all duration-300 ${chatOpen ? 'w-96' : 'w-16'}`}>
        {/* Chat toggle button */}
        <button 
          className={`w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg hover:bg-blue-700 transition-colors ${chatOpen ? 'absolute bottom-0 right-0' : ''}`}
          onClick={() => setChatOpen(!chatOpen)}
        >
          {chatOpen ? <X size={24} /> : <MessageSquare size={24} />}
        </button>
        
        {/* Chat panel */}
        {chatOpen && (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden h-96 flex flex-col">
            <div className="bg-blue-600 text-white px-4 py-3 flex justify-between items-center">
              <h3 className="font-medium">Neural Ennead Assistant</h3>
              <div className="flex space-x-2">
                <button 
                  className={`text-white p-1 rounded-full hover:bg-blue-500 ${isRecording ? 'bg-red-500' : ''}`}
                  onClick={toggleVoiceRecording}
                >
                  <Mic size={16} />
                </button>
                <button 
                  className="text-white p-1 rounded-full hover:bg-blue-500"
                  onClick={handleImageUpload}
                >
                  <Image size={16} />
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleFileChange}
                />
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {chatMessages.map((msg, index) => (
                <div 
                  key={index} 
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[80%] rounded-lg px-4 py-2 ${
                      msg.role === 'user' 
                        ? 'bg-blue-100 text-blue-900' 
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {msg.isImage ? (
                      <div className="flex items-center space-x-2">
                        <Image size={16} />
                        <span>{msg.content}</span>
                      </div>
                    ) : (
                      <p>{msg.content}</p>
                    )}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
            
            <form onSubmit={handleChatSubmit} className="border-t border-gray-200 p-2 flex space-x-2">
              <input 
                type="text"
                className="flex-1 border border-gray-300 rounded-md px-3 py-2"
                placeholder="Ask about documents or Neural Ennead..."
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
              />
              <button 
                type="submit"
                className="bg-blue-600 text-white rounded-md px-4 py-2 hover:bg-blue-700"
              >
                <Send size={16} />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedExecutiveDashboard;
      
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Priority
            </label>
            <select 
              className="w-full p-2 border border-gray-300 rounded-md"
              value={filters.priority}
              onChange={(e) => handleFilterChange('priority', e.target.value)}
            >
              <option value="all">All Priorities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Audience
            </label>
            <select 
              className="w-full p-2 border border-gray-300 rounded-md"
              value={filters.audience}
              onChange={(e) => handleFilterChange('audience', e.target.value)}
            >
              <option value="all">All Audiences</option>
              {uniqueAudiences.map((audience, index) => (
                <option key={index} value={audience}>{audience}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search Documents
            </label>
            <input 
              type="text" 
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Search by title or content..."
              value={filters.searchQuery}
              onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex flex-wrap gap-4">
          <label className="inline-flex items-center">
            <input 
              type="checkbox"
              className="form-checkbox h-4 w-4 text-blue-600"
              checked={filters.bookmarked}
              onChange={(e) => handleFilterChange('bookmarked', e.target.checked)}
            />
            <span className="ml-2 text-sm text-gray-700">Bookmarked Only</span>
          </label>
          
          <label className="inline-flex items-center">
            <input 
              type="checkbox"
              className="form-checkbox h-4 w-4 text-blue-600"
              checked={filters.inProgress}
              onChange={(e) => handleFilterChange('inProgress', e.target.checked)}
            />
            <span className="ml-2 text-sm text-gray-700">In Progress</span>
          </label>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Document List */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-gray-100 px-4 py-3 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-800">
                Documents ({filteredDocs.length})
              </h2>
            </div>
            
            <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
              {filteredDocs.length > 0 ? (
                filteredDocs.map((doc, index) => (
                  <div 
                    key={index}
                    className={`px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors ${activeDocument && activeDocument['File Name'] === doc['File Name'] ? 'bg-blue-50' : ''}`}
                    onClick={() => setActiveDocument(doc)}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-medium text-gray-900 truncate pr-2">{doc['File Name']}</h3>
                      <div className="flex items-center space-x-2">
                        <button 
                          className="text-gray-400 hover:text-yellow-500 focus:outline-none"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleBookmark(doc['File Name']);
                          }}
                        >
                          {bookmarkedDocs.includes(doc['File Name']) ? 
                            <BookmarkCheck size={16} className="text-yellow-500" /> : 
                            <Bookmark size={16} />
                          }
                        </button>
                        <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(doc['Priority Level'])}`}>
                          {doc['Priority Level']}
                        </span>
                      </div>
                    </div>
                    
                    {/* Progress bar */}
                    {readingProgress[doc['File Name']] > 0 && (
                      <div className="w-full bg-gray-200 rounded-full h-1.5 mb-2">
                        <div 
                          className={`h-1.5 rounded-full ${getProgressColor(readingProgress[doc['File Name']])}`}
                          style={{ width: `${readingProgress[doc['File Name']]}%` }}
                        ></div>
                      </div>
                    )}
                    
                    <p className="mt-1 text-sm text-gray-600 line-clamp-2">{doc.Summary}</p>
                  </div>
                ))
              ) : (
                <div className="px-4 py-3 text-gray-500 text-center">
                  No documents match your filters
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Document Details */}
        <div className="md:col-span-2">
          {activeDocument ? (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-gray-100 px-6 py-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-gray-800">{activeDocument['File Name']}</h2>
                  <div className="flex items-center space-x-3">
                    <button 
                      className="text-gray-500 hover:text-yellow-500 focus:outline-none"
                      onClick={() => toggleBookmark(activeDocument['File Name'])}
                    >
                      {bookmarkedDocs.includes(activeDocument['File Name']) ? 
                        <BookmarkCheck size={20} className="text-yellow-500" /> : 
                        <Bookmark size={20} />
                      }
                    </button>
                    <button 
                      className="text-gray-500 hover:text-blue-500 focus:outline-none"
                      onClick={() => exportMetadata(activeDocument)}
                    >
                      <Download size={20} />
                    </button>
                    <span className={`text-sm px-3 py-1 rounded-full ${getPriorityColor(activeDocument['Priority Level'])}`}>
                      {activeDocument['Priority Level']}
                    </span>
                  </div>
                </div>
                
                {/* Progress bar */}
                {readingProgress[activeDocument['File Name']] > 0 && (
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div 
                      className={`h-2 rounded-full ${getProgressColor(readingProgress[activeDocument['File Name']])}`}
                      style={{ width: `${readingProgress[activeDocument['File Name']]}%` }}
                    >
                    </div>
                  </div>
                )}
              </div>
              
              <div className="p-6">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Summary</h3>
                  <p className="text-gray-700">{activeDocument.Summary}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Key Takeaway</h3>
                    <p className="text-gray-700">{activeDocument['Key Takeaway']}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Decision/Action Required</h3>
                    <p className="text-gray-700">{activeDocument['Decision or Action Required']}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Target Audience</h3>
                    <div className="flex flex-wrap gap-2">
                      {activeDocument.Audience.split(',').map((audience, index) => (
                        <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                          {audience.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Dependencies</h3>
                    <p className="text-gray-700">
                      {activeDocument.Dependencies === 'None' ? 
                        'No dependencies' : 
                        activeDocument.Dependencies}
                    </p>
                  </div>
                </div>
                
                {/* Reading progress slider */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Reading Progress</h3>
                  <div className="flex items-center space-x-4">
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={readingProgress[activeDocument['File Name']] || 0}
                      onChange={(e) => updateReadingProgress(activeDocument['File Name'], parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="text-gray-700 font-medium">
                      {readingProgress[activeDocument['File Name']] || 0}%
                    </span>
                  </div>
                </div>
                
                {/* Annotations */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Annotations</h3>
                  <div className="space-y-3 max-h-48 overflow-y-auto mb-3 p-2 border border-gray-200 rounded-md">
                    {annotations[activeDocument['File Name']] && annotations[activeDocument['File Name']].length > 0 ? (
                      annotations[activeDocument['File Name']].map((annotation) => (
                        <div key={annotation.id} className="bg-gray-50 p-3 rounded-md">
                          <div className="flex justify-between mb-1">
                            <span className="text-sm text-gray-500">
                              {annotation.user} - {new Date(annotation.timestamp).toLocaleString()}
                            </span>
                            <button 
                              className="text-gray-400 hover:text-red-500"
                              onClick={() => deleteAnnotation(activeDocument['File Name'], annotation.id)}
                            >
                              <X size={14} />
                            </button>
                          </div>
                          <p className="text-gray-700">{annotation.text}</p>
                        </div>
                      ))
