import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function PDFParser() {
  const [numPages, setNumPages] = useState(null);
  const [title, setTitle] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(`${process.env.PUBLIC_URL}/assets/page.pdf`);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  function handlePageRender({ getAnnotations, getTextContent }) {
    getTextContent().then(content => {
      const title = content.items[0]?.str || "No Title Found";
      setTitle(title);
    });
  }

  return (
    <div>
      <Document
        file={pdfUrl}
        onLoadSuccess={onDocumentLoadSuccess}
        renderMode="canvas"
      >
        <Page pageNumber={1} renderAnnotationLayer={false} onRenderSuccess={handlePageRender} />
      </Document>
      <p>Page count: {numPages}</p>
      <p>Title: {title}</p>
    </div>
  );
}
