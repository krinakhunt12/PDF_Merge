from tkinter import Tk, filedialog
from PyPDF2 import PdfReader, PdfWriter
import os

def split_pdf_pages():
    root = Tk()
    root.withdraw()

    input_pdf = filedialog.askopenfilename(
        title="Select PDF to split",
        filetypes=[("PDF Files", "*.pdf")]
    )

    if not input_pdf:
        return

    reader = PdfReader(input_pdf)

    output_folder = filedialog.askdirectory(title="Select output folder")
    if not output_folder:
        return

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

if __name__ == "__main__":
    split_pdf_pages()
