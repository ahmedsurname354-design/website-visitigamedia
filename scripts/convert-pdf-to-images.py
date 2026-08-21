#!/usr/bin/env python3
"""Convert PDF pages to PNG images for the flipbook display."""

import sys
from pathlib import Path

import pymupdf


SCRIPT_DIR = Path(__file__).parent
PROJECT_ROOT = SCRIPT_DIR.parent
PDF_PATH = PROJECT_ROOT / "public" / "products" / "product-catalogue-2026.pdf"
OUTPUT_DIR = PROJECT_ROOT / "public" / "products" / "catalogue-pages"
PAGE_COUNT = 26
# High-resolution source images keep small catalogue text sharp when zoomed
# or displayed in the full-screen reader.
ZOOM = 2.5


def convert_pdf_to_images():
    """Render the catalogue's first PAGE_COUNT pages as PNG files."""
    try:
        OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

        if not PDF_PATH.exists():
            print(f"PDF file not found: {PDF_PATH}")
            sys.exit(1)

        print(f"Loading PDF from: {PDF_PATH}")
        pdf_document = pymupdf.open(str(PDF_PATH))
        num_pages = min(pdf_document.page_count, PAGE_COUNT)
        print(f"Converting {num_pages} pages to images...")

        for page_num in range(num_pages):
            page = pdf_document[page_num]
            pixmap = page.get_pixmap(matrix=pymupdf.Matrix(ZOOM, ZOOM), alpha=False)
            filename = f"page-{page_num + 1:02d}.png"
            pixmap.save(str(OUTPUT_DIR / filename))
            print(f"  Converted page {page_num + 1}/{num_pages}: {filename}")

        pdf_document.close()
        print(f"Successfully converted {num_pages} pages.")
        print(f"Images saved to: {OUTPUT_DIR}")
    except ImportError as error:
        print(f"Missing dependency: {error}")
        print("Install it with: python -m pip install PyMuPDF")
        sys.exit(1)
    except Exception as error:
        print(f"Error converting PDF to images: {error}")
        sys.exit(1)


if __name__ == "__main__":
    convert_pdf_to_images()
