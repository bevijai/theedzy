import React, { useState, useCallback, useRef } from 'react';
import { 
  Upload, 
  FileText, 
  Brain, 
  Sparkles, 
  X, 
  Download, 
  Eye,
  BookOpen,
  Zap,
  Target,
  CheckCircle,
  AlertCircle,
  FileImage,
  File,
  Trash2,
  Search,
  Filter,
  Plus,
  MessageCircle
} from 'lucide-react';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadDate: Date;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  progress: number;
  preview?: string;
}

interface StudyNote {
  id: string;
  title: string;
  content: string;
  sourceFile: string;
  createdAt: Date;
  tags: string[];
  summary: string;
}

interface Flashcard {
  id: string;
  question: string;
  answer: string;
  difficulty: 'easy' | 'medium' | 'hard';
  sourceFile: string;
  createdAt: Date;
}

export default function AIStudyNotes() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [studyNotes, setStudyNotes] = useState<StudyNote[]>([]);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [activeTab, setActiveTab] = useState<'upload' | 'notes' | 'flashcards' | 'chat'>('upload');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFile, setSelectedFile] = useState<UploadedFile | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Drag and Drop Handlers
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFileUpload(droppedFiles);
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    handleFileUpload(selectedFiles);
  }, []);

  const handleFileUpload = useCallback((fileList: File[]) => {
    const newFiles: UploadedFile[] = fileList.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      uploadDate: new Date(),
      status: 'uploading',
      progress: 0,
    }));

    setFiles(prev => [...prev, ...newFiles]);

    // Simulate file upload and processing
    newFiles.forEach(file => {
      simulateFileProcessing(file.id);
    });
  }, []);

  const simulateFileProcessing = (fileId: string) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 20;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        
        setFiles(prev => prev.map(file => 
          file.id === fileId 
            ? { ...file, status: 'processing', progress: 100 }
            : file
        ));

        // Simulate processing completion
        setTimeout(() => {
          setFiles(prev => prev.map(file => 
            file.id === fileId 
              ? { ...file, status: 'completed' }
              : file
          ));
          
          // Generate sample study notes and flashcards
          generateSampleContent(fileId);
        }, 2000);
      } else {
        setFiles(prev => prev.map(file => 
          file.id === fileId 
            ? { ...file, progress }
            : file
        ));
      }
    }, 300);
  };

  const generateSampleContent = (fileId: string) => {
    const file = files.find(f => f.id === fileId);
    if (!file) return;

    // Generate sample study notes
    const sampleNote: StudyNote = {
      id: Math.random().toString(36).substr(2, 9),
      title: `Study Notes: ${file.name.replace(/\.[^/.]+$/, "")}`,
      content: `AI-generated summary of key concepts from ${file.name}. This includes main topics, important definitions, and key takeaways that will help you understand the material better.`,
      sourceFile: file.name,
      createdAt: new Date(),
      tags: ['AI Generated', 'Summary', 'Key Concepts'],
      summary: 'Comprehensive overview of the main topics covered in the document.'
    };

    // Generate sample flashcards
    const sampleFlashcards: Flashcard[] = [
      {
        id: Math.random().toString(36).substr(2, 9),
        question: `What is the main topic discussed in ${file.name}?`,
        answer: 'The main topic covers fundamental concepts and their practical applications.',
        difficulty: 'medium',
        sourceFile: file.name,
        createdAt: new Date()
      },
      {
        id: Math.random().toString(36).substr(2, 9),
        question: 'Define the key term mentioned in the document.',
        answer: 'A comprehensive explanation of the important concept with examples.',
        difficulty: 'easy',
        sourceFile: file.name,
        createdAt: new Date()
      }
    ];

    setStudyNotes(prev => [...prev, sampleNote]);
    setFlashcards(prev => [...prev, ...sampleFlashcards]);
  };

  const removeFile = (fileId: string) => {
    setFiles(prev => prev.filter(file => file.id !== fileId));
    setStudyNotes(prev => prev.filter(note => {
      const sourceFile = files.find(f => f.id === fileId)?.name;
      return note.sourceFile !== sourceFile;
    }));
    setFlashcards(prev => prev.filter(card => {
      const sourceFile = files.find(f => f.id === fileId)?.name;
      return card.sourceFile !== sourceFile;
    }));
  };

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return <FileText className="w-6 h-6" />;
    if (type.includes('image')) return <FileImage className="w-6 h-6" />;
    return <File className="w-6 h-6" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const tabs = [
    { id: 'upload', label: 'Upload Files', icon: Upload, count: files.length },
    { id: 'notes', label: 'Study Notes', icon: BookOpen, count: studyNotes.length },
    { id: 'flashcards', label: 'Flashcards', icon: Zap, count: flashcards.length },
    { id: 'chat', label: 'AI Chat', icon: MessageCircle, count: 0 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-violet-600 to-purple-600 rounded-3xl shadow-xl mb-6">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-5xl font-black mb-4">
            <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              AI Study Notes
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Upload your documents and let AI create personalized study materials, summaries, and flashcards for better learning.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center px-6 py-3 rounded-2xl font-bold transition-all transform hover:scale-105 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-xl'
                  : 'bg-white text-gray-700 hover:bg-gray-50 shadow-lg'
              }`}
            >
              <tab.icon className="w-5 h-5 mr-2" />
              {tab.label}
              {tab.count > 0 && (
                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-bold ${
                  activeTab === tab.id
                    ? 'bg-white/20 text-white'
                    : 'bg-violet-100 text-violet-600'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Upload Tab */}
          {activeTab === 'upload' && (
            <div className="p-8">
              {/* File Upload Area */}
              <div
                className={`relative border-3 border-dashed rounded-3xl p-12 text-center transition-all ${
                  isDragOver
                    ? 'border-violet-500 bg-violet-50'
                    : 'border-gray-300 hover:border-violet-400 hover:bg-gray-50'
                }`}
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={handleFileSelect}
                  accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
                  className="hidden"
                />
                
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-violet-500 to-purple-500 rounded-3xl flex items-center justify-center mb-6 shadow-xl">
                    <Upload className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 mb-4">
                    Upload Your Study Materials
                  </h3>
                  <p className="text-gray-600 mb-6 max-w-md">
                    Drag and drop your files here, or click to browse. Supports PDFs, documents, and images.
                  </p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-8 py-4 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all"
                  >
                    <Plus className="w-5 h-5 mr-2 inline" />
                    Choose Files
                  </button>
                  <div className="mt-4 text-sm text-gray-500">
                    Supported formats: PDF, DOC, DOCX, TXT, PNG, JPG
                  </div>
                </div>
              </div>

              {/* Uploaded Files List */}
              {files.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Uploaded Files</h3>
                  <div className="space-y-4">
                    {files.map((file) => (
                      <div key={file.id} className="bg-gray-50 rounded-2xl p-6 hover:bg-gray-100 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                              file.status === 'completed' ? 'bg-green-100 text-green-600' :
                              file.status === 'error' ? 'bg-red-100 text-red-600' :
                              'bg-violet-100 text-violet-600'
                            }`}>
                              {file.status === 'completed' ? <CheckCircle className="w-6 h-6" /> :
                               file.status === 'error' ? <AlertCircle className="w-6 h-6" /> :
                               getFileIcon(file.type)}
                            </div>
                            <div>
                              <h4 className="font-bold text-gray-900">{file.name}</h4>
                              <p className="text-sm text-gray-600">
                                {formatFileSize(file.size)} • {file.uploadDate.toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            {file.status === 'uploading' || file.status === 'processing' ? (
                              <div className="flex items-center space-x-2">
                                <div className="w-24 bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-violet-600 h-2 rounded-full transition-all"
                                    style={{ width: `${file.progress}%` }}
                                  ></div>
                                </div>
                                <span className="text-sm text-gray-600">{Math.round(file.progress)}%</span>
                              </div>
                            ) : (
                              <>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                  file.status === 'completed' ? 'bg-green-100 text-green-700' :
                                  'bg-red-100 text-red-700'
                                }`}>
                                  {file.status === 'completed' ? 'Ready' : 'Error'}
                                </span>
                                <button
                                  onClick={() => removeFile(file.id)}
                                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                                >
                                  <Trash2 className="w-5 h-5" />
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                        {file.status === 'processing' && (
                          <div className="mt-3 text-sm text-violet-600 font-medium">
                            <Sparkles className="w-4 h-4 inline mr-1" />
                            AI is analyzing your document...
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Study Notes Tab */}
          {activeTab === 'notes' && (
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">AI-Generated Study Notes</h2>
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search notes..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500"
                    />
                  </div>
                  <button className="p-2 text-gray-400 hover:text-violet-600 hover:bg-violet-50 rounded-xl transition-colors">
                    <Filter className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {studyNotes.length === 0 ? (
                <div className="text-center py-12">
                  <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">No Study Notes Yet</h3>
                  <p className="text-gray-600">Upload some documents to get started with AI-generated study notes.</p>
                </div>
              ) : (
                <div className="grid gap-6">
                  {studyNotes.map((note) => (
                    <div key={note.id} className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-2xl p-6 border border-violet-100">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-2">{note.title}</h3>
                          <p className="text-sm text-gray-600">From: {note.sourceFile}</p>
                        </div>
                        <div className="flex space-x-2">
                          <button className="p-2 text-violet-600 hover:bg-violet-100 rounded-xl transition-colors">
                            <Eye className="w-5 h-5" />
                          </button>
                          <button className="p-2 text-violet-600 hover:bg-violet-100 rounded-xl transition-colors">
                            <Download className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                      <p className="text-gray-700 mb-4">{note.content}</p>
                      <div className="flex flex-wrap gap-2">
                        {note.tags.map((tag, index) => (
                          <span key={index} className="px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-sm font-medium">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Flashcards Tab */}
          {activeTab === 'flashcards' && (
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">AI-Generated Flashcards</h2>
                <button className="px-4 py-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all">
                  <Zap className="w-4 h-4 mr-2 inline" />
                  Study Mode
                </button>
              </div>

              {flashcards.length === 0 ? (
                <div className="text-center py-12">
                  <Zap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">No Flashcards Yet</h3>
                  <p className="text-gray-600">Upload documents to automatically generate flashcards for studying.</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {flashcards.map((card) => (
                    <div key={card.id} className="group relative">
                      <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 overflow-hidden">
                        <div className="bg-gradient-to-br from-violet-500 to-purple-500 p-4">
                          <div className="flex justify-between items-start mb-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-bold text-white bg-white/20`}>
                              {card.difficulty.toUpperCase()}
                            </span>
                            <Target className="w-5 h-5 text-white/80" />
                          </div>
                        </div>
                        <div className="p-6">
                          <h3 className="font-bold text-gray-900 mb-3">Q: {card.question}</h3>
                          <p className="text-gray-600 text-sm mb-4">A: {card.answer}</p>
                          <div className="text-xs text-gray-500">
                            From: {card.sourceFile}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Chat Tab */}
          {activeTab === 'chat' && (
            <div className="p-8">
              <div className="text-center py-12">
                <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">AI Chat Assistant</h3>
                <p className="text-gray-600 mb-6">Ask questions about your uploaded documents and get instant answers.</p>
                <button className="px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all">
                  <Sparkles className="w-5 h-5 mr-2 inline" />
                  Coming Soon
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}