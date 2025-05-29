import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function calculateAge(dateOfBirth: string): number {
  const today = new Date()
  const birthDate = new Date(dateOfBirth)
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }

  return age
}

export function validateFormData(formData: FormData): {
  isValid: boolean
  errors: string[]
  data?: {
    firstName: string
    surName: string
    dateOfBirth: string
    file: File
  }
} {
  const errors: string[] = []
  const firstName = formData.get("firstName") as string
  const surName = formData.get("surName") as string
  const dateOfBirth = formData.get("dateOfBirth") as string
  const file = formData.get("file") as File

  if (!firstName?.trim()) {
    errors.push("First name is required")
  }

  if (!surName?.trim()) {
    errors.push("Last name is required")
  }

  if (!dateOfBirth) {
    errors.push("Date of birth is required")
  } else {
    const birthDate = new Date(dateOfBirth)
    const today = new Date()
    if (birthDate > today) {
      errors.push("Date of birth cannot be in the future")
    }
  }

  if (!file || file.size === 0) {
    errors.push("File is required")
  }

  if (errors.length > 0) {
    return {
      isValid: false,
      errors: errors,
    }
  }

  return {
    isValid: true,
    errors: [],
    data: {
      firstName: firstName.trim(),
      surName: surName.trim(),
      dateOfBirth: dateOfBirth,
      file: file,
    },
  }
}
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
