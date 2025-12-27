from tkinter import Tk, filedialog
from PyPDF2 import PdfReader, PdfWriter

def split_pdf_range():
    root = Tk()
    root.withdraw()

    input_pdf = filedialog.askopenfilename(
        title="Select PDF",
        filetypes=[("PDF Files", "*.pdf")]
    )

    if not input_pdf:
        return

    start = int(input("Enter start page: "))
    end = int(input("Enter end page: "))

    reader = PdfReader(input_pdf)
    writer = PdfWriter()

    for i in range(start - 1, end):
        writer.add_page(reader.pages[i])

    password = input("Enter password (leave blank for no password): ")
    if password:
        writer.encrypt(password)

    output_pdf = filedialog.asksaveasfilename(
        defaultextension=".pdf",
        filetypes=[("PDF Files", "*.pdf")],
        title="Save PDF as"
    )

    if output_pdf:
        with open(output_pdf, "wb") as f:
            writer.write(f)
        print("✅ PDF saved successfully")

if __name__ == "__main__":
    split_pdf_range()
