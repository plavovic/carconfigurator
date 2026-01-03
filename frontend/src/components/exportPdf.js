import jsPDF from "jspdf";

function isRemoteUrl(url) {
  return /^https?:\/\//i.test(String(url || ''));
}

function toProxyUrl(url) {
  return `/api/image-proxy?url=${encodeURIComponent(url)}`;
}

function blobToDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Failed to read image blob'));
    reader.readAsDataURL(blob);
  });
}

async function fetchImageAsDataUrl(src) {
  const source = String(src || '').trim();
  if (!source) throw new Error('Missing image source');

  // Remote Porsche images are blocked by CORS/ORB when loaded directly in browser.
  // Fetch them via our backend proxy so they become same-origin.
  const fetchUrl = isRemoteUrl(source) ? toProxyUrl(source) : source;

  const response = await fetch(fetchUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch image (${response.status}): ${source}`);
  }

  const blob = await response.blob();
  const dataUrl = await blobToDataUrl(blob);
  const mime = blob.type || '';
  const format = mime.toLowerCase().includes('png') ? 'PNG' : 'JPEG';

  return { dataUrl, format };
}

function fitIntoBox(imgWidth, imgHeight, maxWidth, maxHeight) {
  const safeImgWidth = Number(imgWidth) || 1;
  const safeImgHeight = Number(imgHeight) || 1;
  const scale = Math.min(maxWidth / safeImgWidth, maxHeight / safeImgHeight);
  return {
    width: safeImgWidth * scale,
    height: safeImgHeight * scale,
  };
}

function getImageDimensions(doc, dataUrl) {
  try {
    const props = doc.getImageProperties(dataUrl);
    return { width: props.width, height: props.height };
  } catch {
    // Fallback: assume a 16:9-ish image if jsPDF can't introspect it.
    return { width: 1600, height: 900 };
  }
}

export default async function exportPdf({ 
  model = {}, 
  basePrice = 0, 
  total = 0, 
  selected = {}, 
  imagesToUse = {} 
}) {
  const doc = new jsPDF();
  let y = 16;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 12;

  // Helper function to add a new page if needed
  const checkPageBreak = (neededSpace = 20) => {
    if (y + neededSpace > pageHeight - 16) {
      doc.addPage();
      y = 12;
    }
  };

  // ===== PAGE 1: COVER / MAIN IMAGE =====
  // Title
  doc.setFontSize(28);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text("Porsche Configuration", margin, y);
  y += 12;

  // Model name with pricing
  doc.setFontSize(18);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(50, 50, 50);
  doc.text(model?.name || "Vehicle", margin, y);
  y += 10;

  // Add main preview image (3/4 view) - larger on first page
  if (imagesToUse?.threeQuarter) {
    checkPageBreak(110);
    try {
      const { dataUrl, format } = await fetchImageAsDataUrl(imagesToUse.threeQuarter);
      const maxWidth = pageWidth - 2 * margin;
      const maxHeight = 90;
      const { width: naturalW, height: naturalH } = getImageDimensions(doc, dataUrl);
      const fitted = fitIntoBox(naturalW, naturalH, maxWidth, maxHeight);
      const x = margin + (maxWidth - fitted.width) / 2;
      doc.addImage(dataUrl, format, x, y, fitted.width, fitted.height);
      y += fitted.height + 8;
    } catch (e) {
      console.error('Failed to add main preview image:', e);
    }
  }

  // Add base price on first page
  y += 4;
  doc.setFontSize(12);
  doc.setFont(undefined, 'normal');
  doc.setTextColor(80, 80, 80);
  doc.text(`Base Model Price: $${Number(basePrice).toLocaleString()}`, margin, y);
  y += 8;


  // ===== SELECTED OPTIONS SECTION =====
  checkPageBreak(30);
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text("Selected Options & Upgrades", margin, y);
  y += 8;

  const selectedEntries = Object.entries(selected || {});
  if (selectedEntries.length > 0) {
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(60, 60, 60);

    let optionCount = 0;

    for (const [category, items] of selectedEntries) {
      if (!items || (Array.isArray(items) && items.length === 0)) continue;

      const itemsArray = Array.isArray(items) ? items : [items];
      
      checkPageBreak(20);

      // Category header with background
      doc.setDrawColor(200, 200, 200);
      doc.setFillColor(245, 245, 245);
      doc.rect(margin, y - 3, pageWidth - 2 * margin, 6, 'F');
      
      doc.setFont(undefined, 'bold');
      doc.setTextColor(0, 0, 0);
      doc.text(`${category}`, margin + 3, y);
      y += 6;

      doc.setFont(undefined, 'normal');
      doc.setTextColor(60, 60, 60);

      for (const item of itemsArray) {
        const name = item?.name ?? "Unknown";
        const price = Number(item?.price_modifier || 0);
        
        // Item with right-aligned price
        const priceText = `+$${price.toLocaleString()}`;
        const textWidth = pageWidth - 2 * margin - 40;
        const splitText = doc.splitTextToSize(`${name}`, textWidth);
        
        for (let i = 0; i < splitText.length; i++) {
          if (i === splitText.length - 1) {
            // Last line - add price on the right
            doc.text(`- ${splitText[i]}`, margin + 4, y);
            const priceXPos = pageWidth - margin - doc.getTextWidth(priceText) - 2;
            doc.text(priceText, priceXPos, y);
          } else {
            doc.text(`- ${splitText[i]}`, margin + 4, y);
          }
          y += 4;
        }
        
        optionCount++;
        checkPageBreak(5);
      }
      
      y += 2;
    }

    // Summary count
    doc.setFontSize(9);
    doc.setTextColor(120, 120, 120);
    doc.setFont(undefined, 'italic');
    doc.text(`Total options selected: ${optionCount}`, margin, y);
    y += 6;
  } else {
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("No additional options selected", margin, y);
    y += 6;
  }


  // ===== PRICING SUMMARY =====
  checkPageBreak(25);
  
  // Calculate option total
  let optionTotal = 0;
  for (const [, items] of selectedEntries) {
    if (!items || (Array.isArray(items) && items.length === 0)) continue;
    const itemsArray = Array.isArray(items) ? items : [items];
    for (const item of itemsArray) {
      optionTotal += Number(item?.price_modifier || 0);
    }
  }

  // Pricing box
  y += 4;
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.8);
  doc.line(margin, y, pageWidth - margin, y);
  y += 8;

  doc.setFontSize(11);
  doc.setFont(undefined, 'normal');
  doc.setTextColor(60, 60, 60);
  
  const baseText = `Base Price (${model?.name || 'Model'})`;
  doc.text(baseText, margin, y);
  const basePrice$ = `$${Number(basePrice).toLocaleString()}`;
  doc.text(basePrice$, pageWidth - margin - doc.getTextWidth(basePrice$), y);
  y += 6;

  if (optionTotal > 0) {
    doc.text("Selected Options Total", margin, y);
    const optTotal$ = `+$${Number(optionTotal).toLocaleString()}`;
    doc.text(optTotal$, pageWidth - margin - doc.getTextWidth(optTotal$), y);
    y += 8;
  }

  // Total price - prominent
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(1);
  doc.line(margin, y, pageWidth - margin, y);
  y += 6;

  doc.setFontSize(16);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(0, 0, 0);
  const totalText = `Total Price`;
  doc.text(totalText, margin, y);
  const totalPrice$ = `$${Number(total).toLocaleString()}`;
  doc.text(totalPrice$, pageWidth - margin - doc.getTextWidth(totalPrice$), y);
  y += 10;

  // ===== ADDITIONAL VIEWS PAGE =====
  doc.addPage();
  y = 16;

  doc.setFontSize(16);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text("Additional Views", margin, y);
  y += 12;

  // Add all available angle views in a grid
  const angleViews = ['side', 'rear', 'interior'];
  let angleLabels = {
    'side': 'Side View',
    'rear': 'Rear View',
    'interior': 'Interior View'
  };

  let viewsAdded = 0;

  for (const angle of angleViews) {
    if (imagesToUse?.[angle]) {
      try {
        // Check if we need a new row
        if (viewsAdded > 0 && viewsAdded % 2 === 0) {
          checkPageBreak(90);
          y += 8;
        }

        const { dataUrl, format } = await fetchImageAsDataUrl(imagesToUse[angle]);
        const cellWidth = (pageWidth - 3 * margin) / 2;
        const cellHeight = 75;
        const xPos = margin + (viewsAdded % 2) * (cellWidth + margin);

        const { width: naturalW, height: naturalH } = getImageDimensions(doc, dataUrl);
        const fitted = fitIntoBox(naturalW, naturalH, cellWidth, cellHeight);
        const xImg = xPos + (cellWidth - fitted.width) / 2;
        const yImg = y + (cellHeight - fitted.height) / 2;
        doc.addImage(dataUrl, format, xImg, yImg, fitted.width, fitted.height);

        // Add label below cell
        doc.setFontSize(11);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(50, 50, 50);
        doc.text(angleLabels[angle], xPos + 4, y + cellHeight + 6);
        
        viewsAdded++;
        
        if (viewsAdded % 2 === 1) {
          // After first image in row
        } else {
          // After second image in row, move down
          y += cellHeight + 18;
        }
      } catch (e) {
        console.error(`Failed to add ${angle} image:`, e);
      }
    }
  }

  // Handle case where we only added one image
  if (viewsAdded % 2 === 1) {
    y += 90;
  }


  // ===== FOOTER ON LAST PAGE =====
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.setFont(undefined, 'italic');
  
  const now = new Date().toLocaleString();
  doc.text(`Configuration generated: ${now}`, margin, pageHeight - 8);
  
  // Page numbers
  const totalPages = doc.internal.pages.length - 1;
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(180, 180, 180);
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin - 15, pageHeight - 8);
  }

  doc.save(`Porsche-${model?.name || 'Configuration'}-${Date.now()}.pdf`);
}
