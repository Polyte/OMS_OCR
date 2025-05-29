const express = require("express")
const multer = require("multer")
const cors = require("cors")
const path = require("path")
const fs = require("fs")
const Tesseract = require("tesseract.js")
 const pdf = require("pdf-parse");

const app = express()
const PORT = process.env.PORT || 5000

// Our Middleware
app.use(
  cors({
    origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
    credentials: true,
  }),
)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, "uploads")
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

// Configure this for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname))
  },
})

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit for file uploads
  }, // File type validation
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["application/pdf", "image/jpeg", "image/png", "image/jpg"]
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error("Invalid file type. Only PDF, JPEG, and PNG files are allowed."))
    }
  },
})

// Calculating the age of the person based on date of birth
function calculateAge(dateOfBirth) { // Function to calculate age from date of birth
  const today = new Date()
  const birthDate = new Date(dateOfBirth)
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age-- // If the current month is before the birth month or it's the same month but the current day is before the birth day, subtract one year
  }

  return age // Return the calculated age
}

// Validate form data or check for errors
function validateFormData(body, file) {
  const errors = []
  const { firstName, surName, dateOfBirth } = body // Destructure the body to get firstName, surName, and dateOfBirth

  if (!firstName?.trim()) {
    errors.push("First name is required")
  }

  if (!surName?.trim()) {
    errors.push("Surname is required")
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

  if (!file) {
    errors.push("Document or file is required")
  }

  return {
    isValid: errors.length === 0,
    errors,
    data: errors.length === 0 ? { firstName, surName, dateOfBirth, file } : undefined,
  }
}

// OCR functions or checks
async function extractTextFromImage(filePath) {
  try {
    const {
      data: { text },
    } = await Tesseract.recognize(filePath, "eng", { // We use Tesseract OCR for images
      logger: (m) => console.log(m),
    })
    return text.trim()
  } catch (error) {
    console.error("Error extracting text from image:", error)
    throw new Error("Failed to extract text from image")
  }
}

// PDF_Parse to extract text from PDF files
async function extractTextFromPDF(filePath) {
  try {

    const buffer = fs.readFileSync(filePath); // Read the PDF file into a buffer

    // Use pdf-parse to extract text
    const data = await pdf(buffer);

    return data.text; // The extracted text is in data.text
  } catch (error) {
    console.error("Error extracting text from PDF:", error);
    throw new Error("Failed to extract text from PDF");
  }
}

// Process the uploaded file based on its type
async function processFile(file) {
  const fileType = file.mimetype // Get the MIME type of the file

  if (fileType.startsWith("image/")) { // Check if the file is an image to use Tesseract OCR
    return await extractTextFromImage(file.path)
  } else if (fileType === "application/pdf") { // Check if the file is a PDF to use pdf-parse
    return await extractTextFromPDF(file.path)
  } else {
    throw new Error("Unsupported file type")
  }
}

// Routes for the Express server
app.get("/api/health", (req, res) => { // Health check endpoint
  res.json({ status: "OK", message: "Express server is running" })
})

app.post("/api/upload", upload.single("file"), async (req, res) => {
  try {
    // Validate form data
    const validation = validateFormData(req.body, req.file)
    if (!validation.isValid) {
      // Clean up uploaded file if validation fails (if file is present)
      if (req.file) {
        fs.unlinkSync(req.file.path)
      }
      return res.status(400).json({ // Return a 400 error with validation errors
        error: "Validation failed",
        details: validation.errors,
      })
    }

    const { firstName, surName, dateOfBirth } = validation.data // Destructure the validated data to get firstName, surName, and dateOfBirth
    const file = req.file

    console.log("Processing file:", file.originalname)
    console.log("File type:", file.mimetype)
    console.log("File size:", file.size)

    // Process the file to extract text
    const rawExtractedText = await processFile(file)

    // Calculate age
    const age = calculateAge(dateOfBirth) // Call the calculateAge function with dateOfBirth

    // Prepare response
    const result = {
      fullName: `${firstName.trim()} ${surName.trim()}`,
      age,
      rawExtractedText,
    }

    // Clean up uploaded file after processing
    fs.unlinkSync(file.path)

    console.log("Processing completed successfully")
    res.json(result)
  } catch (error) {
    console.error("Error processing upload:", error)

    // Clean up uploaded file if error occurs
    if (req.file) {
      try {
        fs.unlinkSync(req.file.path)
      } catch (cleanupError) {
        console.error("Error cleaning up file:", cleanupError)
      }
    }

    res.status(500).json({
      error: "Failed to process file", // Return a 500 error with the error message
      details: error.message || "Unknown error",
    })
  }
})

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") { // Check if the error is due to file size limit exceeded
      return res.status(400).json({
        error: "File too large", // Return a 400 error for file size limit exceeded
        details: ["File size must be less than 10MB"],
      })
    }
  }

  res.status(500).json({
    error: "Server error",
    details: [error.message || "Unknown error occurred"],
  })
})

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ error: "Route not found" })  // Return a 404 error for unknown routes
})

app.listen(PORT, () => {
  console.log(`Express server running on http://localhost:${PORT}`)
  console.log(`Health check available at http://localhost:${PORT}/api/health`)
})

module.exports = app
