import React, { useEffect, useState } from 'react';

const PDFTextExtractor = () => {
  const [text, setText] = useState('');
  const pdfUrl = 'http://itd2.fw.ondgni.com:70/Hospedia9_5/Design/Lab/printlabreport_pdf.aspx?IsPrev=0&testid=O582,O581'; // Your PDF URL

  useEffect(() => {
    const extractText = async () => {
      try {
        const loadingTask = window.pdfjsLib.getDocument(pdfUrl);
        const pdf = await loadingTask.promise;
        let fullText = '';

        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
          const page = await pdf.getPage(pageNum);
          const content = await page.getTextContent();
          const strings = content.items.map(item => item.str).join(' ');
          fullText += strings + '\n\n';
        }

        setText(fullText);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    extractText();
  }, []);

  return (
    <div>
      <h2>PDF Text:</h2>
      <pre style={{ whiteSpace: 'pre-wrap' }}>{text}</pre>
    </div>
  );
};

export default PDFTextExtractor;
