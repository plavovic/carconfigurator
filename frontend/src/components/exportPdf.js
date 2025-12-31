import jsPDF from "jspdf";

// Helper function to load and convert image to data URL
async function imageToDataUrl(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = src;
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/jpeg', 0.85));
      } catch (e) {
        reject(e);
      }
    };
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
  });
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
    checkPageBreak(100);
    try {
      const imgData = await imageToDataUrl(imagesToUse.threeQuarter);
      const imgHeight = 70;
      const imgWidth = pageWidth - 2 * margin;
      doc.addImage(imgData, 'JPEG', margin, y, imgWidth, imgHeight);
      y += imgHeight + 6;
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
            doc.text(`• ${splitText[i]}`, margin + 4, y);
            const priceXPos = pageWidth - margin - doc.getTextWidth(priceText) - 2;
            doc.text(priceText, priceXPos, y);
          } else {
            doc.text(`• ${splitText[i]}`, margin + 4, y);
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
  checkPageBreak(50);
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

        const imgData = await imageToDataUrl(imagesToUse[angle]);
        
        const imgWidth = (pageWidth - 3 * margin) / 2;
        const imgHeight = 60;
        const xPos = margin + (viewsAdded % 2) * (imgWidth + margin);
        
        // Add image
        doc.addImage(imgData, 'JPEG', xPos, y, imgWidth, imgHeight);
        
        // Add label below image
        doc.setFontSize(11);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(50, 50, 50);
        doc.text(angleLabels[angle], xPos + 4, y + imgHeight + 5);
        
        viewsAdded++;
        
        if (viewsAdded % 2 === 1) {
          // After first image in row
        } else {
          // After second image in row, move down
          y += imgHeight + 12;
        }
      } catch (e) {
        console.error(`Failed to add ${angle} image:`, e);
      }
    }
  }

  // Handle case where we only added one image
  if (viewsAdded % 2 === 1) {
    y += 80;
  }


  // ===== FOOTER ON LAST PAGE =====
  checkPageBreak(5);
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
