import jsPDF from "jspdf";

// Helper function to load and convert image to data URL
async function imageToDataUrl(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = src;

    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL("image/jpeg", 0.85));
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
  imagesToUse = {},
}) {
  const doc = new jsPDF();
  let y = 16;

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 12;

  const checkPageBreak = (neededSpace = 20) => {
    if (y + neededSpace > pageHeight - 16) {
      doc.addPage();
      y = 16;
    }
  };

  // ===== PAGE 1 =====
  doc.setFontSize(28);
  doc.setFont(undefined, "bold");
  doc.text("Porsche Configuration", margin, y);
  y += 14;

  doc.setFontSize(18);
  doc.text(model?.name || "Vehicle", margin, y);
  y += 12;

  if (imagesToUse?.threeQuarter) {
    try {
      const imgData = await imageToDataUrl(imagesToUse.threeQuarter);
      const imgHeight = 70;
      doc.addImage(
        imgData,
        "JPEG",
        margin,
        y,
        pageWidth - margin * 2,
        imgHeight
      );
      y += imgHeight + 8;
    } catch (err) {
      console.error(err);
    }
  }

  doc.setFontSize(12);
  doc.setFont(undefined, "normal");
  doc.text(
    `Base Model Price: $${Number(basePrice).toLocaleString()}`,
    margin,
    y
  );
  y += 12;

  // ===== SELECTED OPTIONS =====
  doc.setFontSize(14);
  doc.setFont(undefined, "bold");
  doc.text("Selected Options & Upgrades", margin, y);
  y += 8;

  const selectedEntries = Object.entries(selected || {});
  let optionTotal = 0;
  let optionCount = 0;

  doc.setFontSize(10);
  doc.setFont(undefined, "normal");

  for (const [category, items] of selectedEntries) {
    if (!items || (Array.isArray(items) && items.length === 0)) continue;

    const arr = Array.isArray(items) ? items : [items];

    checkPageBreak(20);

    doc.setFont(undefined, "bold");
    doc.setFillColor(245, 245, 245);
    doc.rect(margin, y - 4, pageWidth - margin * 2, 6, "F");
    doc.text(category, margin + 2, y);
    y += 6;

    doc.setFont(undefined, "normal");

    for (const item of arr) {
      const name = item?.name ?? "Unknown";
      const price = Number(item?.price_modifier ?? 0);
      optionTotal += price;
      optionCount++;

      const priceText = `+$${price.toLocaleString()}`;
      const textWidth = pageWidth - margin * 2 - 40;
      const lines = doc.splitTextToSize(name, textWidth);

      for (let i = 0; i < lines.length; i++) {
        doc.text(`• ${lines[i]}`, margin + 4, y);

        if (i === lines.length - 1) {
          doc.text(
            priceText,
            pageWidth - margin - doc.getTextWidth(priceText),
            y
          );
        }
        y += 4;
      }
      checkPageBreak(6);
    }
    y += 2;
  }

  doc.setFontSize(9);
  doc.setFont(undefined, "italic");
  doc.text(`Total options selected: ${optionCount}`, margin, y);
  y += 10;

  // ===== PRICING SUMMARY =====
  checkPageBreak(40);

  doc.setFontSize(11);
  doc.setFont(undefined, "normal");

  doc.line(margin, y, pageWidth - margin, y);
  y += 8;

  doc.text("Base Price", margin, y);
  doc.text(
    `$${Number(basePrice).toLocaleString()}`,
    pageWidth - margin - doc.getTextWidth(`$${basePrice}`),
    y
  );
  y += 6;

  doc.text("Options Total", margin, y);
  doc.text(
    `+$${optionTotal.toLocaleString()}`,
    pageWidth - margin - doc.getTextWidth(`+$${optionTotal}`),
    y
  );
  y += 8;

  doc.setFontSize(16);
  doc.setFont(undefined, "bold");
  doc.line(margin, y, pageWidth - margin, y);
  y += 8;

  doc.text("Total Price", margin, y);
  doc.text(
    `$${Number(total).toLocaleString()}`,
    pageWidth - margin - doc.getTextWidth(`$${total}`),
    y
  );

  // ===== ADDITIONAL VIEWS =====
  doc.addPage();
  y = 16;

  doc.setFontSize(16);
  doc.setFont(undefined, "bold");
  doc.text("Additional Views", margin, y);
  y += 12;

  const views = [
    { key: "side", label: "Side View" },
    { key: "rear", label: "Rear View" },
    { key: "interior", label: "Interior View" },
  ];

  let index = 0;

  for (const v of views) {
    if (!imagesToUse?.[v.key]) continue;

    const imgData = await imageToDataUrl(imagesToUse[v.key]);
    const imgWidth = (pageWidth - margin * 3) / 2;
    const imgHeight = 60;
    const x =
      margin + (index % 2 === 1 ? imgWidth + margin : 0);

    doc.addImage(imgData, "JPEG", x, y, imgWidth, imgHeight);
    doc.setFontSize(11);
    doc.text(v.label, x + 4, y + imgHeight + 6);

    if (index % 2 === 1) y += imgHeight + 16;
    index++;
  }

  // ===== FOOTER =====
  const now = new Date().toLocaleString();
  const totalPages = doc.internal.pages.length - 1;

  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setFont(undefined, "italic");
    doc.text(`Generated: ${now}`, margin, pageHeight - 8);
    doc.text(
      `Page ${i} of ${totalPages}`,
      pageWidth - margin - 20,
      pageHeight - 8
    );
  }

  doc.save(
    `Porsche-${model?.name || "Configuration"}-${Date.now()}.pdf`
  );
}
