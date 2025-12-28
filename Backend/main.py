from fastapi import FastAPI, UploadFile, File, Form
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
import os

from merge_pdfs import merge_pdfs
from split_pdf_pages import split_pdf_pages
from split_pdf_range import split_pdf_range
import zipfile
import tempfile

app = FastAPI(title="PDF Tools API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

os.makedirs("output", exist_ok=True)

@app.post("/merge")
async def merge_api(
    files: list[UploadFile] = File(...),
    password: str | None = Form(None),
    filename: str = Form("merged.pdf")
):
    file_objs = [file.file for file in files]
    output = merge_pdfs(file_objs, password)
    
    # Ensure filename has .pdf extension
    if not filename.endswith('.pdf'):
        filename += '.pdf'

    return FileResponse(
        output,
        media_type="application/pdf",
        filename=filename
    )

@app.post("/split-pages")
async def split_pages_api(
    file: UploadFile = File(...),
    password: str | None = Form(None),
    filename: str | None = Form(None),
):
    """Split PDF into pages. If `filename` is provided and ends with .zip (or not),
    the endpoint will return a zip archive containing all split page PDFs for download.
    Otherwise it returns JSON with generated file paths.
    """
    # Determine prefix to use for output PDF names
    prefix = None
    if filename:
        # If user provided e.g. mypages.zip or mypages, use 'mypages' as prefix
        prefix = filename[:-4] if filename.lower().endswith('.zip') else filename

    files = split_pdf_pages(file.file, password, filename_prefix=prefix)

    if filename:
        # Ensure .zip extension
        zip_name = filename if filename.lower().endswith('.zip') else f"{filename}.zip"
        zip_path = os.path.join('output', zip_name)
        # Create zip containing the generated PDFs
        with zipfile.ZipFile(zip_path, 'w', compression=zipfile.ZIP_DEFLATED) as zf:
            for fpath in files:
                zf.write(fpath, arcname=os.path.basename(fpath))

        # Optionally remove individual files to keep output folder tidy
        for fpath in files:
            try:
                os.remove(fpath)
            except Exception:
                pass

        return FileResponse(
            zip_path,
            media_type='application/zip',
            filename=zip_name
        )

    # Default response: return JSON with list of files
    return {
        "message": "PDF split successfully",
        "files": files
    }

@app.post("/split-range")
async def split_range_api(
    file: UploadFile = File(...),
    start_page: int = Form(...),
    end_page: int = Form(...),
    password: str | None = Form(None),
    filename: str = Form("split.pdf")
):
    output = split_pdf_range(
        file.file, start_page, end_page, password
    )
    
    # Ensure filename has .pdf extension
    if not filename.endswith('.pdf'):
        filename += '.pdf'

    return FileResponse(
        output,
        media_type="application/pdf",
        filename=filename
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)