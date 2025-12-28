from PyPDF2 import PdfReader, PdfWriter
import os
import uuid
from typing import BinaryIO, List, Optional
import zipfile

os.makedirs("output", exist_ok=True)


def split_pdf_pages(file_obj: BinaryIO, password: Optional[str] = None, filename_prefix: Optional[str] = None) -> List[str]:
    """Split a PDF into individual pages. Returns list of output file paths.

    - `filename_prefix` when provided will be used as the base name for output files.
    """
    try:
        file_obj.seek(0)
    except Exception:
        pass

    reader = PdfReader(file_obj)

    base_name = filename_prefix or f"split_pages_{uuid.uuid4().hex}"
    out_files: List[str] = []

    for i, page in enumerate(reader.pages):
        writer = PdfWriter()
        writer.add_page(page)

        if password:
            writer.encrypt(password)

        output_path = os.path.join("output", f"{base_name}_page_{i+1}.pdf")
        with open(output_path, "wb") as f:
            writer.write(f)
        out_files.append(output_path)

    return out_files


if __name__ == "__main__":
    # Backward-compatible CLI
    from tkinter import Tk, filedialog

    root = Tk()
    root.withdraw()

    input_pdf = filedialog.askopenfilename(
        title="Select PDF to split",
        filetypes=[("PDF Files", "*.pdf")]
    )

    if not input_pdf:
        raise SystemExit(0)

    reader = PdfReader(input_pdf)

    output_folder = filedialog.askdirectory(title="Select output folder")
    if not output_folder:
        raise SystemExit(0)

    password = input("Enter password (leave blank for no password): ")

    base_name = os.path.splitext(os.path.basename(input_pdf))[0]

    for i, page in enumerate(reader.pages):
        writer = PdfWriter()
        writer.add_page(page)

        if password:
            writer.encrypt(password)

        output_path = os.path.join(
            output_folder, f"{base_name}_page_{i+1}.pdf"
        )

        with open(output_path, "wb") as f:
            writer.write(f)

    print("✅ PDF split successfully")
