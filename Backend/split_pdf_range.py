from PyPDF2 import PdfReader, PdfWriter
import os
import uuid
import tempfile
from typing import BinaryIO

os.makedirs("output", exist_ok=True)


def split_pdf_range(file_obj: BinaryIO, start_page: int, end_page: int, password: str | None = None) -> str:
    """Split pages from start_page to end_page (1-based inclusive) from file_obj and
    write a single PDF to the output folder. Returns the output file path.
    """
    try:
        file_obj.seek(0)
    except Exception:
        pass

    reader = PdfReader(file_obj)
    writer = PdfWriter()

    total_pages = len(reader.pages)
    # Clamp values
    start = max(1, int(start_page))
    end = min(int(end_page), total_pages)

    for i in range(start - 1, end):
        writer.add_page(reader.pages[i])

    if password:
        writer.encrypt(password)

    out_path = os.path.join("output", f"split_range_{uuid.uuid4().hex}.pdf")
    with open(out_path, "wb") as out_f:
        writer.write(out_f)

    return out_path


if __name__ == "__main__":
    # Keep backward-compatible CLI behavior when executed directly
    from tkinter import Tk, filedialog

    root = Tk()
    root.withdraw()

    input_pdf = filedialog.askopenfilename(
        title="Select PDF",
        filetypes=[("PDF Files", "*.pdf")]
    )

    if not input_pdf:
        raise SystemExit(0)

    start = int(input("Enter start page: "))
    end = int(input("Enter end page: "))

    with open(input_pdf, "rb") as f:
        output_path = split_pdf_range(f, start, end, password=None)

    print(f"✅ PDF saved to {output_path}")
