"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, User, Calendar, FileText } from "lucide-react"
import type { ProcessingResult } from "@/lib/types"
import { ThemeToggle } from "@/components/theme-toggle"

export default function ResultsPage() {
  const [results, setResults] = useState<ProcessingResult | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => { // Fetch results from sessionStorage when the component mounts
    const storedResults = sessionStorage.getItem("processingResults")
    if (storedResults) {
      try {
        const parsedResults = JSON.parse(storedResults)
        setResults(parsedResults)
      } catch (error) {
        console.error("Error parsing stored results:", error)
        router.push("/")
      }
    } else {
      router.push("/") // Redirect to upload page if no results found
    }
    setIsLoading(false)
  }, [router])

  const handleBackToUpload = () => { // Clear sessionStorage and navigate back to upload page
    sessionStorage.removeItem("processingResults")
    router.push("/")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center transition-colors">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500 dark:border-blue-400"></div>
      </div>
    )
  }

  if (!results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4 transition-colors">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center transition-colors">
          <p className="text-gray-600 dark:text-gray-400 mb-4">No results found. Please upload a file first.</p>
          <button
            onClick={handleBackToUpload}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium 
            text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800
            transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Upload
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen   p-4 transition-colors">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Processed OCR Results</h1>
          <button
            onClick={handleBackToUpload}
            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium 
            text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600
            focus:outline-none focus:ring-2 roundend focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800
            transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Upload Another File To Process
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Personal Information Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-colors">
            <div className="border-b border-gray-200 dark:border-gray-700 p-4">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                <User className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                Personal Information
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Information processed from your input</p>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Full Name</label>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">{results.fullName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Age</label>
                <div className="flex items-center space-x-2">
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{results.age}</p>
                  <span
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                  bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 transition-colors"
                  >
                    <Calendar className="h-3 w-3 mr-1" />
                    years old
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Extracted Text Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-colors">
            <div className="border-b border-gray-200 dark:border-gray-700 p-4">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                <FileText className="h-5 w-5 mr-2 text-green-600 dark:text-green-400" />
                Extracted Text
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Raw text content from your uploaded file</p>
            </div>
            <div className="p-4">
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 max-h-64 overflow-y-auto transition-colors">
                {results.rawExtractedText ? (
                  <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-mono">
                    {results.rawExtractedText}
                  </pre>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 italic">No text could be extracted from the file.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Full Width Text Display */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-colors">
          <div className="border-b border-gray-200 dark:border-gray-700 p-4">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Complete Extracted Content</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Full text content with preserved formatting</p>
          </div>
          <div className="p-4">
            <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-6 min-h-32 transition-colors">
              {results.rawExtractedText ? (
                <div className="prose dark:prose-invert max-w-none">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                    {results.rawExtractedText}
                  </p>
                </div>
              ) : (
                <div className="flex items-center justify-center h-32 text-gray-500 dark:text-gray-400">
                  <div className="text-center">
                    <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No text content was extracted from the uploaded file.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
       <div>
     <div className="wave"></div>
     <div className="wave"></div>
     <div className="wave"></div>
  </div>
    </div>
  )
}
