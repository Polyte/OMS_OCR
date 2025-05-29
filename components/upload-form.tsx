"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { AlertCircle, FileText, Upload } from "lucide-react"
import { ThemeToggle } from "./theme-toggle"

export default function UploadForm() { // UploadForm.tsx
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [selectedFile, setSelectedFile] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault() // Prevent default form submission behavior
    setIsLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)

    try {
      const response = await fetch("http://localhost:5000/api/upload", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.details?.join(", ") || data.error || "Upload failed")
      }

      // Store results in sessionStorage and navigate to results page
      sessionStorage.setItem("processingResults", JSON.stringify(data))
      router.push("/results")
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const fileInput = document.getElementById("file") as HTMLInputElement
      if (fileInput) {
        fileInput.files = e.dataTransfer.files
        setSelectedFile(e.dataTransfer.files[0].name)
      }
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0].name)
    }
  }

  return (
    <div className="min-h-screen background flex items-center justify-center p-4 transition-colors">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-colors">
        <div className="text-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">OMS OCR Image/Doc Processor</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 dark:text-white">
            Upload a PDF or image file for OCR processing.  
          </p>
        </div>
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-md flex items-start">
                <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  First Name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  placeholder="Your name"
                  disabled={isLoading}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm 
                  bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                  disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:text-gray-500 dark:disabled:text-gray-400
                  transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="surName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Last Name
                </label>
                <input
                  id="surName"
                  name="surName"
                  type="text"
                  required
                  placeholder="Surname"
                  disabled={isLoading}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm 
                  bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                  disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:text-gray-500 dark:disabled:text-gray-400
                  transition-colors"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Date of Birth
              </label>
              <input
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                required
                disabled={isLoading}
                max={new Date().toISOString().split("T")[0]}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm 
                bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:text-gray-500 dark:disabled:text-gray-400
                transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="file" className="block text-sm font-medium text-gray-700 dark:text-gray-300 dark:text-white">
                Document Upload
              </label>
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors
                ${
                  dragActive
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                    : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  id="file"
                  name="file"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  required
                  disabled={isLoading}
                  className="hidden"
                  onChange={handleFileChange}
                />
                <label htmlFor="file" className="cursor-pointer">
                  <div className="flex flex-col items-center space-y-2">
                    <Upload className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 dark:text-white">
                        Click here to upload your file
                      </span>{" "}
                      or drag and drop
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-500">PDF, PNG, JPG up to 10MB</div>
                  </div>
                </label>
                {selectedFile && (
                  <div className="mt-2 text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-md truncate">
                    {selectedFile}
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium 
              text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-colors"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 dark:text-white"></div>
                  Processing Your File Or Document...
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4 mr-2" />
                  OCR Extract
                </>
              )}
            </button>
          </form>
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
