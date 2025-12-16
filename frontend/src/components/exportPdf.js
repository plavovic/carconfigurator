import jsPDF from "jspdf";

export default function exportPdf({ basePrice, total, selected = {}, selectedTech = [] }) {
  const doc = new jsPDF();

  let y = 16;

  doc.setFontSize(16);
  doc.text("Car Configuration", 14, y);
  y += 10;

  doc.setFontSize(12);
  doc.text(`Base price: ${basePrice}`, 14, y);
  y += 10;

  // Technology (multi)
  doc.setFontSize(13);
  doc.text("Technology:", 14, y);
  y += 8;

  if (!selectedTech.length) {
    doc.setFontSize(12);
    doc.text("- None", 18, y);
    y += 8;
  } else {
    doc.setFontSize(12);
    for (const t of selectedTech) {
      const name = t?.name ?? "Unknown";
      const price = Number(t?.price_modifier ?? 0);
      doc.text(`- ${name} (+${price})`, 18, y);
      y += 7;
      if (y > 280) { doc.addPage(); y = 16; }
    }
  }

  y += 4;

  // Other categories (single)
  doc.setFontSize(13);
  doc.text("Other selections:", 14, y);
  y += 8;

  const entries = Object.entries(selected || {});
  if (!entries.length) {
    doc.setFontSize(12);
    doc.text("- None", 18, y);
    y += 8;
  } else {
    doc.setFontSize(12);
    for (const [category, opt] of entries) {
      if (!opt) continue;
      const name = opt?.name ?? "Unknown";
      const price = Number(opt?.price_modifier ?? 0);
      doc.text(`- ${category}: ${name} (+${price})`, 18, y);
      y += 7;
      if (y > 280) { doc.addPage(); y = 16; }
    }
  }

  y += 6;
  doc.setFontSize(14);
  doc.text(`Total: ${total}`, 14, y);

  doc.save("car-configuration.pdf");
}
