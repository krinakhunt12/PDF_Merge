import os
import uuid
import tempfile
import shutil
from typing import Iterable, BinaryIO

from PyPDF2 import PdfMerger, PdfReader, PdfWriter

os.makedirs("output", exist_ok=True)

def merge_pdfs(file_objs: Iterable[BinaryIO], password: str | None = None) -> str:
    merger = PdfMerger()
    for f in file_objs:
        try:
            f.seek(0)
        except Exception:
            pass
        merger.append(f)

    tmp = tempfile.NamedTemporaryFile(delete=False, suffix=".pdf")
    tmp_path = tmp.name
    tmp.close()

    # write merged pdf to temporary file
    merger.write(tmp_path)
    merger.close()

    out_path = os.path.join("output", f"merged_{uuid.uuid4().hex}.pdf")

    if password:
        # read merged file and re-write with password
        reader = PdfReader(tmp_path)
        writer = PdfWriter()
        for page in reader.pages:
            writer.add_page(page)
        writer.encrypt(password)
        with open(out_path, "wb") as out_f:
            writer.write(out_f)
        os.unlink(tmp_path)
    else:
        # move the temp merged file to output (cross-platform)
        shutil.move(tmp_path, out_path)

    return out_path