import jsPDF from "jspdf";

let _logoCache: string | null = null;

export async function getLogoBase64(): Promise<string | null> {
  if (_logoCache) return _logoCache;
  try {
    const resp = await fetch("/logo.png");
    const blob = await resp.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        _logoCache = reader.result as string;
        resolve(_logoCache);
      };
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

export type Period = "all" | "today" | "week" | "month";

export function periodLabel(period: Period): string {
  if (period === "today") return "Today — " + new Date().toLocaleDateString();
  if (period === "week")
    return (
      "This Week — " +
      new Date(Date.now() - 7 * 86400000).toLocaleDateString() +
      " to " +
      new Date().toLocaleDateString()
    );
  if (period === "month")
    return (
      "This Month — " +
      new Date().toLocaleString("default", { month: "long", year: "numeric" })
    );
  return "All Time";
}

export function filterByPeriod(items: any[], period: Period): any[] {
  if (period === "all") return items;
  const now = new Date();
  const start = new Date();
  if (period === "today") {
    start.setHours(0, 0, 0, 0);
  } else if (period === "week") {
    start.setDate(now.getDate() - 7);
    start.setHours(0, 0, 0, 0);
  } else if (period === "month") {
    start.setDate(1);
    start.setHours(0, 0, 0, 0);
  }
  return items.filter((i) => new Date(i.createdAt) >= start);
}

export async function drawYOUKUHeader(
  doc: jsPDF,
  reportTitle: string,
  reportSubtitle: string,
  period: Period,
  recordCount: number,
  extraLine?: string
): Promise<void> {
  const W = doc.internal.pageSize.getWidth();
  const headerH = 52;

  doc.setFillColor(8, 8, 20);
  doc.rect(0, 0, W, headerH, "F");

  doc.setFillColor(30, 30, 55);
  doc.rect(0, headerH, W, 0.4, "F");

  const logo = await getLogoBase64();
  const logoSize = 28;
  const logoX = 10;
  const logoY = (headerH - logoSize) / 2;
  if (logo) {
    doc.addImage(logo, "PNG", logoX, logoY, logoSize, logoSize);
  }

  const nameX = logo ? logoX + logoSize + 5 : logoX;

  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 60, 60);
  doc.text("YOUKU", nameX, logoY + 11);

  doc.setFontSize(7.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(160, 160, 200);
  doc.text("youku.com  |  Stream Anytime, Anywhere", nameX, logoY + 18);

  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.text(reportTitle, W / 2, 16, { align: "center" });

  doc.setFontSize(8.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(180, 190, 230);
  doc.text(reportSubtitle, W / 2, 24, { align: "center" });

  doc.setFontSize(8);
  doc.setTextColor(150, 160, 200);
  doc.text(
    `Period: ${periodLabel(period)}   |   Generated: ${new Date().toLocaleString()}   |   Records: ${recordCount}`,
    W / 2,
    31,
    { align: "center" }
  );

  if (extraLine) {
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(100, 220, 170);
    doc.text(extraLine, W / 2, 38, { align: "center" });
  }

  doc.setFontSize(7.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(120, 130, 170);
  doc.text("admin@youku.com  |  youku.com", W - 10, 14, { align: "right" });

  doc.setDrawColor(99, 102, 241);
  doc.setLineWidth(0.8);
  doc.line(0, headerH, W, headerH);
}

export function drawYOUKUFooter(doc: jsPDF, pageNum: number, totalPages: number) {
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();
  doc.setFillColor(8, 8, 20);
  doc.rect(0, H - 10, W, 10, "F");
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(120, 130, 170);
  doc.text(
    `YOUKU — Confidential & Official Document  |  Page ${pageNum} of ${totalPages}  |  youku.com`,
    W / 2,
    H - 4,
    { align: "center" }
  );
}

export function drawSignatureBlock(
  doc: jsPDF,
  sigY: number,
  leftTitle: string,
  leftLines: string[],
  docId: string
) {
  const W = doc.internal.pageSize.getWidth();
  const accentR = 99, accentG = 102, accentB = 241;

  doc.setDrawColor(accentR, accentG, accentB);
  doc.setFillColor(248, 248, 255);
  doc.roundedRect(10, sigY, W - 20, 42, 3, 3, "FD");

  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(accentR, accentG, accentB);
  doc.text(leftTitle, 18, sigY + 8);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(30, 30, 60);
  doc.setFontSize(8.5);
  leftLines.forEach((line, idx) => {
    doc.text(line, 18, sigY + 16 + idx * 7);
  });

  const midX = W / 2 + 8;
  doc.setFont("helvetica", "bold");
  doc.setTextColor(accentR, accentG, accentB);
  doc.setFontSize(9);
  doc.text("AUTHORIZED BY — CEO SIGNATURE", midX, sigY + 8);

  doc.setDrawColor(80, 80, 120);
  doc.setLineWidth(0.5);
  doc.line(midX, sigY + 22, W - 15, sigY + 22);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(80, 80, 120);
  doc.setFontSize(8);
  doc.text("Chief Executive Officer — YOUKU", midX, sigY + 27);
  doc.text("Name: _______________________________", midX, sigY + 33);
  doc.text("Date:  _______________________________", midX, sigY + 39);

  doc.setFontSize(7);
  doc.setTextColor(150, 155, 180);
  doc.text(
    `Doc ID: ${docId}  |  Official YOUKU Document — youku.com`,
    W / 2,
    sigY + 40,
    { align: "center" }
  );
}
