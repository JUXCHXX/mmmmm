/**
 * PDF Generator Utility
 * Genera PDFs institucionalizados para comunicaciones
 */

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export interface CommunicationPDFOptions {
  title: string;
  content: string;
  category: string;
  audience: string;
  author: string;
  date: string;
  brandImage?: string;
  adminSignature?: string;
  logoUrl?: string;
}

/**
 * Genera un PDF a partir de HTML
 */
export const generatePDFFromHTML = async (
  element: HTMLElement,
  filename: string,
  options?: {
    orientation?: 'portrait' | 'landscape';
    format?: 'a4' | 'letter';
  }
): Promise<void> => {
  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: options?.orientation || 'portrait',
      unit: 'mm',
      format: options?.format || 'a4',
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = pdfWidth - 20; // Márgenes
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let yPosition = 10;

    // Agregar imagen si cabe en una página
    if (imgHeight <= pdfHeight - 20) {
      pdf.addImage(imgData, 'PNG', 10, yPosition, imgWidth, imgHeight);
    } else {
      // Dividir en múltiples páginas
      let remainingHeight = canvas.height;
      let pageCount = 0;

      while (remainingHeight > 0) {
        if (pageCount > 0) {
          pdf.addPage();
          yPosition = 10;
        }

        const canvasHeight = Math.min(
          remainingHeight,
          (canvas.width * (pdfHeight - 20)) / imgWidth
        );

        const sourceY = pageCount * canvasHeight;

        const pageCanvas = document.createElement('canvas');
        pageCanvas.width = canvas.width;
        pageCanvas.height = canvasHeight;

        const ctx = pageCanvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(
            canvas,
            0,
            sourceY,
            canvas.width,
            canvasHeight,
            0,
            0,
            canvas.width,
            canvasHeight
          );
        }

        const pageImgData = pageCanvas.toDataURL('image/png');
        const pageImgHeight = (canvasHeight * imgWidth) / canvas.width;

        pdf.addImage(
          pageImgData,
          'PNG',
          10,
          yPosition,
          imgWidth,
          pageImgHeight
        );

        remainingHeight -= canvasHeight;
        pageCount++;
      }
    }

    pdf.save(filename);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Error al generar el PDF');
  }
};

/**
 * Genera un PDF institucionalizado de comunicación
 */
export const generateCommunicationPDF = async (
  options: CommunicationPDFOptions
): Promise<void> => {
  const {
    title,
    content,
    category,
    audience,
    author,
    date,
    brandImage,
    adminSignature,
    logoUrl
  } = options;

  // Crear contenedor temporal para renderizar
  const tempContainer = document.createElement('div');
  tempContainer.style.position = 'absolute';
  tempContainer.style.left = '-9999px';
  tempContainer.style.width = '210mm';
  tempContainer.style.padding = '20mm';
  tempContainer.style.fontFamily = 'Inter, system-ui, sans-serif';
  tempContainer.style.backgroundColor = '#ffffff';
  tempContainer.style.lineHeight = '1.6';

  // Crear documento usando métodos DOM seguros (sin innerHTML)
  const mainDiv = document.createElement('div');
  mainDiv.style.maxWidth = '210mm';
  mainDiv.style.margin = '0 auto';

  // Header con Logo
  const headerDiv = document.createElement('div');
  headerDiv.style.textAlign = 'center';
  headerDiv.style.marginBottom = '30px';
  headerDiv.style.paddingBottom = '20px';
  headerDiv.style.borderBottom = '3px solid hsl(217 91% 50%)';

  if (brandImage) {
    const logoImg = document.createElement('img');
    logoImg.src = brandImage;
    logoImg.style.maxHeight = '80px';
    logoImg.style.marginBottom = '10px';
    logoImg.addEventListener('error', () => {
      logoImg.style.display = 'none';
    });
    headerDiv.appendChild(logoImg);
  }

  const titleH1 = document.createElement('h1');
  titleH1.textContent = 'BUNTY';
  titleH1.style.color = 'hsl(217 91% 30%)';
  titleH1.style.margin = '0';
  titleH1.style.fontSize = '28px';
  titleH1.style.fontWeight = '700';
  headerDiv.appendChild(titleH1);

  const subtitleP = document.createElement('p');
  subtitleP.textContent = 'Plataforma de Gestión de Condominio';
  subtitleP.style.color = 'hsl(220 13% 55%)';
  subtitleP.style.margin = '5px 0 0 0';
  subtitleP.style.fontSize = '12px';
  subtitleP.style.textTransform = 'uppercase';
  subtitleP.style.letterSpacing = '1px';
  headerDiv.appendChild(subtitleP);

  mainDiv.appendChild(headerDiv);

  // Documento Principal
  const docDiv = document.createElement('div');
  docDiv.style.marginBottom = '40px';

  // Metadatos
  const metadataDiv = document.createElement('div');
  metadataDiv.style.display = 'grid';
  metadataDiv.style.gridTemplateColumns = '1fr 1fr';
  metadataDiv.style.gap = '20px';
  metadataDiv.style.marginBottom = '30px';
  metadataDiv.style.padding = '15px';
  metadataDiv.style.backgroundColor = 'hsl(220 14% 96%)';
  metadataDiv.style.borderRadius = '8px';

  const metadata = [
    { label: 'Categoría', value: category },
    { label: 'Audiencia', value: audience },
    { label: 'Autor', value: author },
    { label: 'Fecha', value: date }
  ];

  metadata.forEach(({ label, value }) => {
    const metaItem = document.createElement('div');

    const labelP = document.createElement('p');
    labelP.textContent = label;
    labelP.style.color = 'hsl(220 13% 55%)';
    labelP.style.fontSize = '11px';
    labelP.style.textTransform = 'uppercase';
    labelP.style.margin = '0 0 5px 0';
    metaItem.appendChild(labelP);

    const valueP = document.createElement('p');
    valueP.textContent = value;
    valueP.style.color = 'hsl(220 13% 25%)';
    valueP.style.fontSize = '14px';
    valueP.style.fontWeight = '600';
    valueP.style.margin = '0';
    metaItem.appendChild(valueP);

    metadataDiv.appendChild(metaItem);
  });

  docDiv.appendChild(metadataDiv);

  // Título
  const titleH2 = document.createElement('h2');
  titleH2.textContent = title;
  titleH2.style.color = 'hsl(217 91% 30%)';
  titleH2.style.fontSize = '24px';
  titleH2.style.fontWeight = '700';
  titleH2.style.margin = '0 0 20px 0';
  titleH2.style.lineHeight = '1.3';
  docDiv.appendChild(titleH2);

  // Contenido
  const contentDiv = document.createElement('div');
  contentDiv.textContent = content;
  contentDiv.style.color = 'hsl(220 13% 25%)';
  contentDiv.style.fontSize = '14px';
  contentDiv.style.lineHeight = '1.8';
  contentDiv.style.whiteSpace = 'pre-wrap';
  contentDiv.style.wordWrap = 'break-word';
  docDiv.appendChild(contentDiv);

  mainDiv.appendChild(docDiv);

  // Footer con Firma
  const footerDiv = document.createElement('div');
  footerDiv.style.marginTop = '50px';
  footerDiv.style.paddingTop = '20px';
  footerDiv.style.borderTop = '1px solid hsl(220 13% 82%)';

  if (adminSignature) {
    const signatureContainer = document.createElement('div');
    signatureContainer.style.marginBottom = '30px';

    const sigLabelP = document.createElement('p');
    sigLabelP.textContent = 'Firma Digital:';
    sigLabelP.style.color = 'hsl(220 13% 25%)';
    sigLabelP.style.fontSize = '12px';
    sigLabelP.style.margin = '0 0 10px 0';
    signatureContainer.appendChild(sigLabelP);

    const sigContentDiv = document.createElement('div');
    sigContentDiv.textContent = adminSignature.substring(0, 100) + '...';
    sigContentDiv.style.padding = '10px';
    sigContentDiv.style.backgroundColor = 'hsl(220 14% 96%)';
    sigContentDiv.style.borderRadius = '4px';
    sigContentDiv.style.fontFamily = 'monospace';
    sigContentDiv.style.fontSize = '10px';
    sigContentDiv.style.wordBreak = 'break-all';
    sigContentDiv.style.color = 'hsl(220 13% 55%)';
    signatureContainer.appendChild(sigContentDiv);

    footerDiv.appendChild(signatureContainer);
  }

  const footerP = document.createElement('p');
  footerP.textContent = `Documento generado automáticamente por BUNTY el ${new Date().toLocaleString('es-ES')}`;
  footerP.style.color = 'hsl(220 13% 55%)';
  footerP.style.fontSize = '11px';
  footerP.style.margin = '0';
  footerP.style.textAlign = 'center';
  footerDiv.appendChild(footerP);

  mainDiv.appendChild(footerDiv);

  // Agregar al contenedor principal
  tempContainer.appendChild(mainDiv);

  // Agregar al documento
  document.body.appendChild(tempContainer);

  try {
    // Generar PDF
    await generatePDFFromHTML(
      tempContainer,
      `Comunicacion_${title.replace(/\s+/g, '_')}_${Date.now()}.pdf`
    );
  } finally {
    // Limpiar
    document.body.removeChild(tempContainer);
  }
};

export default {
  generatePDFFromHTML,
  generateCommunicationPDF
};
