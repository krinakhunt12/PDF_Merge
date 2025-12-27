# PDF Operations Backend API

A production-ready FastAPI backend service for handling daily office PDF operations including merging, splitting, and extracting page ranges with optional password protection.

## 🎯 Overview

This backend service provides RESTful APIs for common PDF manipulation tasks. It can be integrated with web applications, internal office tools, automation scripts, or used as the foundation for SaaS PDF tools.

## ✨ Features

- **PDF Merging** - Combine multiple PDF files into a single document
- **Page Splitting** - Extract individual pages from a PDF
- **Range Extraction** - Split PDFs by custom page ranges
- **Password Protection** - Optional encryption for output PDFs
- **File Upload Support** - Multipart form-data handling
- **API Documentation** - Auto-generated Swagger UI
- **Asynchronous Processing** - Built on FastAPI for high performance

## 🛠️ Tech Stack

- **FastAPI** - Modern Python web framework for building APIs
- **PyPDF2** - PDF processing and manipulation library
- **Uvicorn** - Lightning-fast ASGI server
- **Python 3.8+** - Required runtime environment

## 📁 Project Structure

```
Backend/
│
├── main.py                  # FastAPI application entry point
├── merge_pdfs.py            # PDF merge logic
├── split_pdf_pages.py       # Split PDF into individual pages
├── split_pdf_range.py       # Extract PDF page ranges
├── requirements.txt         # Python dependencies
├── output/                  # Generated PDF output directory
└── venv/                    # Virtual environment (not tracked in git)
```

## 🚀 Getting Started

### Prerequisites

- Python 3.8 or higher
- pip (Python package manager)

### Installation

**1. Clone the repository**

```bash
git clone <repository-url>
cd Backend
```

**2. Create a virtual environment**

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

**3. Install dependencies**

```bash
pip install -r requirements.txt
```

### Running the Server

**Development mode (with auto-reload):**

```bash
uvicorn main:app --reload
```

**Production mode:**

```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```

The server will start at `http://127.0.0.1:8000`

### Command Breakdown

- `uvicorn` - ASGI server for running FastAPI applications
- `main` - Python filename (main.py) containing the FastAPI app
- `app` - FastAPI instance variable (`app = FastAPI()`)
- `--reload` - Auto-restart server on code changes (development only)

## 📚 API Documentation

Interactive API documentation is available at:

- **Swagger UI**: `http://127.0.0.1:8000/docs`
- **ReDoc**: `http://127.0.0.1:8000/redoc`

The documentation allows you to:
- Test endpoints directly in the browser
- View request/response schemas
- Understand required and optional parameters
- See example responses

## 🔌 API Endpoints

### 1. Merge PDFs

**Endpoint:** `POST /merge`

Combine multiple PDF files into a single document.

**Request:**
- `files` (required): Multiple PDF files
- `password` (optional): Password for output PDF encryption

**Response:**
- Success: Downloads the merged PDF file
- Error: JSON error message

**Example using cURL:**

```bash
curl -X POST "http://127.0.0.1:8000/merge" \
  -F "files=@document1.pdf" \
  -F "files=@document2.pdf" \
  -F "password=mysecret123"
```

---

### 2. Split PDF into Pages

**Endpoint:** `POST /split-pages`

Extract all pages from a PDF as individual files.

**Request:**
- `file` (required): Single PDF file
- `password` (optional): Password for output PDFs

**Response:**
- Success: JSON with array of generated file paths
- Error: JSON error message

**Example Response:**

```json
{
  "message": "PDF split successfully",
  "files": [
    "output/page_1.pdf",
    "output/page_2.pdf",
    "output/page_3.pdf"
  ]
}
```

---

### 3. Split PDF by Page Range

**Endpoint:** `POST /split-range`

Extract a specific range of pages from a PDF.

**Request:**
- `file` (required): Single PDF file
- `start_page` (required): Starting page number (1-indexed)
- `end_page` (required): Ending page number (inclusive)
- `password` (optional): Password for output PDF

**Response:**
- Success: Downloads the extracted PDF range
- Error: JSON error message

**Example using cURL:**

```bash
curl -X POST "http://127.0.0.1:8000/split-range" \
  -F "file=@document.pdf" \
  -F "start_page=3" \
  -F "end_page=7" \
  -F "password=protect123"
```

## 🔐 Password Protection

All endpoints support optional password protection:

- **With password**: Output PDF is encrypted and requires password to open
- **Without password**: Output PDF is unprotected and freely accessible

This allows flexible security based on document sensitivity.

## 🏢 Use Cases

- **Office Automation** - Batch processing of internal documents
- **Invoice Management** - Merge monthly invoices for accounting
- **Legal Documents** - Split contracts for individual client distribution
- **HR Systems** - Extract specific pages from employment records
- **SaaS Applications** - Backend for PDF manipulation services
- **Report Generation** - Combine multiple reports into single deliverable

## 🛠️ Troubleshooting

### Common Issues

**Problem:** `uvicorn: command not found`

**Solution:**
```bash
# Ensure virtual environment is activated
venv\Scripts\activate  # Windows
source venv/bin/activate  # macOS/Linux

# Reinstall uvicorn if needed
pip install uvicorn
```

**Problem:** Module import errors

**Solution:**
```bash
# Reinstall all dependencies
pip install -r requirements.txt --force-reinstall
```

**Problem:** Permission denied on output folder

**Solution:**
```bash
# Create output directory with proper permissions
mkdir output
chmod 755 output  # macOS/Linux
```

## 🔮 Future Enhancements

- [ ] ZIP archive download for batch split operations
- [ ] Automatic cleanup of temporary files
- [ ] API authentication (JWT/API keys)
- [ ] Rate limiting for production use
- [ ] Docker containerization
- [ ] Frontend web interface
- [ ] Cloud storage integration (AWS S3, Google Drive)
- [ ] Batch processing queue system
- [ ] PDF watermarking capabilities
- [ ] OCR text extraction
- [ ] PDF compression

## 📝 Requirements

See `requirements.txt` for complete dependency list:

```
fastapi>=0.104.0
uvicorn>=0.24.0
PyPDF2>=3.0.0
python-multipart>=0.0.6
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

Developed as a practical backend utility for real-world PDF automation using Python & FastAPI.

## 🙏 Acknowledgments

- FastAPI framework for excellent async API capabilities
- PyPDF2 library for reliable PDF processing
- The Python community for continuous support

---

**⭐ If you find this project useful, please consider giving it a star!**