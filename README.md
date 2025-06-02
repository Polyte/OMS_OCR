![image](https://github.com/user-attachments/assets/ff7938b1-9fc1-4e3b-a508-7e4c63c2c1aa)


# OMS File Processor Application

A full-stack application for processing PDF and image files to extract text content, built with Next.js frontend and Express.js backend.

## Features

- **File Upload**: Support for PDF, JPEG, and PNG files up to 10MB
- **Text Extraction**: OCR processing for images using Tesseract.js
- **Personal Information Processing**: Age calculation and full name formatting
- **Responsive Design**: Clean, modern UI with Tailwind CSS
- **Error Handling**: Comprehensive validation and error management

## Tech Stack

### Frontend
- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework


### Backend
- **Express.js**: Node.js web framework
- **Multer**: File upload middleware
- **Tesseract.js**: OCR library for text extraction
- **CORS**: Cross-origin resource sharing

## Project Structure

\`\`\` 
file-processor/
├── app/ # Next.js frontend
│   ├── components/         # React components
│   ├── lib/               # Utilities and types
│   ├── results/           # Results page
│   └── layout.tsx         # Root layout
├── server/                # Express.js backend
│   ├── server.js          # Main server file
│   ├── package.json       # Server dependencies
│   └── uploads/           # Temporary file storage
└── README.md
\`\`\`

## Setup Instructions

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Backend Setup

1. **Navigate to server directory**:
   \`\`\`bash
   cd server
   \`\`\`

2. **Install dependencies**:
   \`\`\`bash
   npm install
   \`\`\`

3. **Start the Express server**:
   ///
   # Development mode with auto-restart
   npm run dev
   
   # Production mode
   npm start
  

   The server will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to the root directory**:
   \`\`\`bash
   cd ..
   \`\`\`

2. **Install dependencies**:
   \`\`\`bash
   
   pnpm install
   
   pnpm approve builds
   
   pnpm build or

   npm run build
   \`\`\`

4. **Start the Next.js development server**:
   \`\`\`bash
   npm run dev
   
   or pnpm dev
   \`\`\`

   The frontend will run on `http://localhost:3000`

## Usage

1. **Start both servers** (backend on :5000, frontend on :3000)
2. **Open your browser** to `http://localhost:3000`
3. **Fill out the form**:
   - Enter your first name and last name
   - Select your date of birth
   - Upload a PDF or image file (max 10MB)
4. **Click "Process File"** to submit
5. **View results** on the results page showing:
   - Full name (constructed from input)
   - Calculated age
   - Extracted text from the uploaded file

## API Endpoints

### POST /api/upload
Processes uploaded files and personal information.

**Request**:
- `Content-Type`: `multipart/form-data`
- `firstName`: string (required)
- `surName`: string (required)
- `dateOfBirth`: string (required, YYYY-MM-DD format)
- `file`: File (required, PDF/JPEG/PNG, max 10MB)

**Response**:
\`\`\`json
{
  "fullName": "John Doe",
  "age": 25,
  "rawExtractedText": "Extracted text content..."
}
\`\`\`

### GET /api/health
Health check endpoint for server status.

## Development Notes

### File Processing
- **Images**: Uses Tesseract.js for OCR text extraction
- **PDFs**: Basic text extraction (can be enhanced with pdf-parse)
- **Validation**: File type, size, and required field validation
- **Cleanup**: Temporary files are automatically deleted after processing

### Security Considerations
- File size limits (10MB)
- File type restrictions
- CORS configuration for cross-origin requests
- Input validation and sanitization

### Error Handling
- Comprehensive validation on both client and server
- Graceful error messages for users
- Automatic file cleanup on errors
- Server error logging

## Common Issues

1. **CORS Errors**: Ensure both servers are running on correct ports
2. **File Upload Fails**: Check file size (max 10MB) and type (PDF/JPEG/PNG)
3. **OCR Not Working**: Tesseract.js requires good image quality for best results
4. **Server Not Starting**: Check if port 5000 is available

## Future Enhancements

- Enhanced PDF text extraction with pdf-parse
- Batch file processing
- User authentication and file history
- Cloud storage integration
- Advanced OCR preprocessing
- Real-time processing status updates

## License
 
This project is licensed by Polite Makwala under OMS OCR License.
\`\`\`

Next step was to create a development script to run both servers:
