export interface ProcessingResult {
  fullName: string
  age: number
  rawExtractedText: string
}

export interface UploadFormData {
  firstName: string
  surName: string
  dateOfBirth: string
  file: File
}
