from fastapi import FastAPI, UploadFile, File, Form
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
import os

from merge_pdfs import merge_pdfs
from split_pdf_pages import split_pdf_pages
from split_pdf_range import split_pdf_range

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
    password: str | None = Form(None)
):
    file_objs = [file.file for file in files]
    output = merge_pdfs(file_objs, password)

    return FileResponse(
        output,
        media_type="application/pdf",
        filename="merged.pdf"
    )

@app.post("/split-pages")
async def split_pages_api(
    file: UploadFile = File(...),
    password: str | None = Form(None)
):
    files = split_pdf_pages(file.file, password)
    return {
        "message": "PDF split successfully",
        "files": files
    }

@app.post("/split-range")
async def split_range_api(
    file: UploadFile = File(...),
    start_page: int = Form(...),
    end_page: int = Form(...),
    password: str | None = Form(None)
):
    output = split_pdf_range(
        file.file, start_page, end_page, password
    )

    return FileResponse(
        output,
        media_type="application/pdf",
        filename="split.pdf"
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)