#!/bin/bash

# Tickets Deck Architecture Documentation Converter
# This script converts the markdown documentation to PDF format

echo "🎫 Tickets Deck Architecture Documentation Converter"
echo "=================================================="

# Check if pandoc is installed
if ! command -v pandoc &> /dev/null; then
    echo "❌ Pandoc is not installed. Please install it first:"
    echo "   macOS: brew install pandoc"
    echo "   Ubuntu: sudo apt-get install pandoc"
    echo "   Windows: Download from https://pandoc.org/installing.html"
    exit 1
fi

# Check if wkhtmltopdf is installed (for better PDF generation)
if command -v wkhtmltopdf &> /dev/null; then
    echo "✅ Using wkhtmltopdf for PDF generation"
    PDF_ENGINE="--pdf-engine=wkhtmltopdf"
else
    echo "⚠️  wkhtmltopdf not found, using default PDF engine"
    echo "   For better results, install wkhtmltopdf:"
    echo "   macOS: brew install wkhtmltopdf"
    echo "   Ubuntu: sudo apt-get install wkhtmltopdf"
    PDF_ENGINE=""
fi

# Input and output files
MARKDOWN_FILE="Tickets_Deck_Architecture_Overview.md"
PDF_FILE="Tickets_Deck_Architecture_Overview.pdf"
HTML_FILE="Tickets_Deck_Architecture_Overview.html"

# Check if markdown file exists
if [ ! -f "$MARKDOWN_FILE" ]; then
    echo "❌ Markdown file '$MARKDOWN_FILE' not found!"
    exit 1
fi

echo ""
echo "📄 Converting markdown to PDF..."

# Convert markdown to PDF with custom styling
pandoc "$MARKDOWN_FILE" \
    -o "$PDF_FILE" \
    $PDF_ENGINE \
    --from markdown \
    --to pdf \
    --variable geometry:margin=1in \
    --variable fontsize:11pt \
    --variable documentclass:article \
    --variable colorlinks:true \
    --variable linkcolor:blue \
    --variable urlcolor:blue \
    --variable toccolor:blue \
    --toc \
    --toc-depth=3 \
    --number-sections \
    --highlight-style=github \
    --metadata title="Tickets Deck Architecture Overview" \
    --metadata author="Tickets Deck Development Team" \
    --metadata date="$(date '+%B %d, %Y')" \
    --metadata subject="Software Architecture Documentation" \
    --metadata keywords="Architecture, Next.js, NestJS, TypeScript, Event Ticketing"

if [ $? -eq 0 ]; then
    echo "✅ PDF generated successfully: $PDF_FILE"
    
    # Get file size
    if command -v stat &> /dev/null; then
        if [[ "$OSTYPE" == "darwin"* ]]; then
            # macOS
            SIZE=$(stat -f%z "$PDF_FILE")
        else
            # Linux
            SIZE=$(stat -c%s "$PDF_FILE")
        fi
        SIZE_MB=$(echo "scale=2; $SIZE / 1024 / 1024" | bc 2>/dev/null || echo "N/A")
        echo "📊 File size: ${SIZE_MB} MB"
    fi
else
    echo "❌ Failed to generate PDF"
    exit 1
fi

echo ""
echo "📄 Files generated:"
echo "   📝 Markdown: $MARKDOWN_FILE"
echo "   🌐 HTML: $HTML_FILE"
echo "   📄 PDF: $PDF_FILE"

echo ""
echo "🎉 Documentation conversion completed!"
echo ""
echo "💡 Tips:"
echo "   • Open the HTML file in a browser for interactive viewing"
echo "   • Use the PDF for printing or sharing"
echo "   • The markdown file is the source for future edits"
echo ""
echo "🔗 To view the files:"
echo "   HTML: open $HTML_FILE"
echo "   PDF: open $PDF_FILE"
