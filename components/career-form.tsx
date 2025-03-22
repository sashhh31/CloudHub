"use client"
import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useProfile } from '@/context/ProfileContext';

export function CareerForm() {
  const [jobTitle, setJobTitle] = useState<string>('');
  const [linkedinUrl, setLinkedinUrl] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [fileType, setFileType] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [extractedText, setExtractedText] = useState<string>('');
  const [progress, setProgress] = useState<number>(0);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const router = useRouter();
  const [pdfJsLoaded, setPdfJsLoaded] = useState<boolean>(false);
  const { setProfileData } = useProfile();


  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.min.js';
    script.async = true;
    
    script.onload = () => {
      // Add type declaration for pdfjsLib
      const pdfjsLib = (window as any)['pdfjs-dist/build/pdf'];
      pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';
      setPdfJsLoaded(true);
    };
    
    script.onerror = () => {
      console.error('Could not load PDF.js library');
      setError('Failed to load PDF processing library');
    };
    
    document.body.appendChild(script);
    
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Extract text from PDF using PDF.js
  const extractPdfText = async (pdfFile: File): Promise<string> => {
    if (!pdfJsLoaded) {
      throw new Error('PDF.js library not loaded');
    }

    const arrayBuffer = await pdfFile.arrayBuffer();
    const pdfjsLib = (window as any)['pdfjs-dist/build/pdf'];
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    
    // Show initial progress
    setProgress(10);
    
    const pdf = await loadingTask.promise;
    const numPages = pdf.numPages;
    
    // Update progress
    setProgress(30);
    
    let fullText = '';
    
    // Extract text from each page
    for (let i = 1; i <= numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      
      // Concatenate the text items
      const pageText = textContent.items.map((item: { str: any; }) => item.str).join(' ');
      fullText += pageText + '\n\n';
      
      // Update progress based on page completion
      setProgress(30 + Math.floor((i / numPages) * 70));
    }
    
    setProgress(100);
    return fullText;
  };

  // Fallback method using FileReader for text files
  const readTextFile = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = (e) => reject(e);
      reader.readAsText(file);
    });
  };

  const handleLinkedinChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLinkedinUrl(value);
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    if (selectedFile) {
      if (selectedFile.type === "application/pdf") {
        setFileType("pdf");
        try {
          setIsLoading(true);
          setProgress(0);
          
          // Create URL for PDF display
          const fileUrl = URL.createObjectURL(selectedFile);
          setPdfUrl(fileUrl);
          
          // Extract text from PDF using PDF.js
          const text = await extractPdfText(selectedFile);
          setExtractedText(text);
        } catch (err) {
          console.error("Error extracting PDF text:", err);
          setError("Failed to extract text from PDF: " + (err instanceof Error ? err.message : 'Unknown error'));
        } finally {
          setIsLoading(false);
        }
      } else if (
        selectedFile.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        setFileType("docx");
        setPdfUrl(null);
        setExtractedText(''); // Will be handled on server
      } else if (selectedFile.type === "text/plain") {
        setFileType("txt");
        setPdfUrl(null);
        // For text files, read them directly
        try {
          const text = await readTextFile(selectedFile);
          setExtractedText(text);
        } catch (err) {
          console.error("Error reading text file:", err);
          setError("Failed to read text file");
        }
      } else if (selectedFile.type === "application/json") {
        setFileType("json");
        setPdfUrl(null);
        // For JSON files, read them directly
        try {
          const text = await readTextFile(selectedFile);
          setExtractedText(text);
        } catch (err) {
          console.error("Error reading JSON file:", err);
          setError("Failed to read JSON file");
        }
      } else {
        setFileType("other");
        setPdfUrl(null);
      }
      setFile(selectedFile);
    }
  };

  const clearFileSelection = () => {
    setFile(null);
    setFileType('');
    setPdfUrl(null);
    setExtractedText('');
    setProgress(0);
  };

  const clearLinkedinUrl = () => {
    setLinkedinUrl('');
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Check that both LinkedIn URL and file are provided
    if (!linkedinUrl) {
      setError('Please enter your LinkedIn URL');
      return;
    }
    
    if (!file) {
      setError('Please upload your resume');
      return;
    }
  
    setIsLoading(true);
    setError('');
  
    try {
      const formData = new FormData();
      formData.append('jobTitle', jobTitle);
      formData.append('linkedinUrl', linkedinUrl);
      
      // Always append the file
      formData.append('resume', file);
      formData.append('fileType', fileType);
      
      if (extractedText && (fileType === 'pdf' || fileType === 'txt' || fileType === 'json')) {
        formData.append('extractedText', extractedText);
      }
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error:", errorText);
        throw new Error(`Server error: ${errorText}`);
      }
      
      const data = await response.json();

      if (!data.analysis) {
        throw new Error('No analysis data received from server');
      }
      
      // Update context instead of using localStorage directly
      setProfileData({ analysis: data.analysis.analysis });
      
      router.push('/result');
    } catch (error) {
      console.error('Error processing data:', error);
      setError('Failed to process data: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setIsLoading(false);
    }
  };

  // Determine if submit button should be enabled
  const isSubmitDisabled = isLoading || 
                          !linkedinUrl || 
                          !file || 
                          (file && fileType === 'pdf' && !extractedText && !error);

  return (
    <div className="space-y-6 rounded-lg w-[500px] bg-white p-6">
      <form onSubmit={handleSubmit}>
        <div className="space-y-2">
          <Label htmlFor="job-title">Enter your job title</Label>
          <Input 
            id="job-title" 
            placeholder="Enter your job title" 
            className="bg-gray-100"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            disabled={isLoading}
          />
        </div>
        
        <div className="space-y-2 mt-6">
          <Label>Upload Portfolio</Label>
          
          {/* LinkedIn URL input - always required */}
          <div className="flex items-center rounded-md border border-gray-200 px-3 py-2 bg-gray-100 relative">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5 text-blue-600"
            >
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
              <rect width="4" height="12" x="2" y="9" />
              <circle cx="4" cy="4" r="2" />
            </svg>
            <Input
              className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
              placeholder="Paste LinkedIn URL here (required)"
              value={linkedinUrl}
              onChange={handleLinkedinChange}
              disabled={isLoading}
              required
            />
            {linkedinUrl && (
              <button
                type="button"
                className="absolute right-2 text-gray-400 hover:text-gray-600"
                onClick={clearLinkedinUrl}
                title="Clear URL"
              >
                ×
              </button>
            )}
          </div>
          
          <div className="text-center text-sm text-gray-500">and</div>
          
          {/* Resume upload - always required */}
          <div 
            className="flex h-32 cursor-pointer items-center justify-center rounded-md border border-dashed border-gray-300 px-6 py-4 text-center relative"
            onClick={() => {
              document.getElementById('file-upload')?.click();
            }}
          >
            <div className="space-y-1">
              <p className="text-sm font-medium">Upload your resume (required)</p>
              <p className="text-xs text-gray-500">Supported formats: PDF, DOCX, TXT, JSON</p>
              <input 
                id="file-upload"
                type="file" 
                className="hidden" 
                accept=".pdf,.docx,.txt,.json"
                onChange={handleFileChange}
                disabled={isLoading}
                required
              />
              {file && (
                <div className="text-xs text-green-600 mt-2 flex items-center justify-center">
                  <span>Selected: {file.name} ({fileType})</span>
                  <button
                    type="button"
                    className="ml-2 text-red-500 hover:text-red-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      clearFileSelection();
                    }}
                    title="Remove file"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Progress bar */}
        {progress > 0 && progress < 100 && (
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
            <div 
              className="bg-blue-600 h-2.5 rounded-full" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}
        
        {/* Error message */}
        {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
        
        <Button 
          type="submit"
          className="w-full rounded-full bg-blue-600 hover:bg-blue-700 mt-6"
          disabled={isSubmitDisabled}
        >
          {isLoading ? 'Processing...' : 'Analyze Portfolio'}
        </Button>
      </form>
    </div>
  );
}