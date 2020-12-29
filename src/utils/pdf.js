import jsPdf from 'jspdf';
import 'jspdf-autotable';
import { dateToDDMMYYYY, dateToHHMM } from './apis/helpers';
import domtoimage from 'dom-to-image'

export const generateReport = (tabledData, reportName, fromDate, toDate, branchName, description, language) => {
  const totalPagesExp = '{total_pages_count_string}';
  let pdf = new jsPdf('l', 'pt', 'a4');
  const image = `data:image/png;base64,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`;
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const from = fromDate ? dateToDDMMYYYY(fromDate) : 'All'
  const to = toDate ? dateToDDMMYYYY(toDate) : 'All'
  const generatedAt = `${dateToDDMMYYYY(new Date())} ${dateToHHMM(new Date())}`
  const header = (data) => {
    pdf.setFontSize(16);
    pdf.setFontStyle('normal');
    // const marginLeft = 50;
    // const date = new Date().getTime()
    // const xOffsetReport = (pdf.internal.pageSize.width / 2) - (pdf.getStringUnitWidth(`test`) * pdf.internal.getFontSize() / 2);
    if (data.pageCount > 1) {
      pdf.addImage(image, 'PNG', pageWidth / 2 - 30, 10, 80, 32);
    } else {
      pdf.addImage(image, 'PNG', pageWidth / 2 - 70, 10, 150, 60);
    }
  }
  const footer = (data) => {
    let str = 'Page ' + data.pageCount;
    if (typeof pdf.putTotalPages === 'function') {
      str = str + ' of ' + totalPagesExp;
    }
    pdf.setFontSize(12);
    const marginLft = data.settings.margin.left;
    const xOffset = (pdf.internal.pageSize.width / 2) - (pdf.getStringUnitWidth(str) * pdf.internal.getFontSize() / 2);
    pdf.text(str, xOffset + marginLft, pageHeight - 10);
  }
  pdf.text(reportName, pageWidth / 2, 100, 'center');
  pdf.setFontSize(12);
  pdf.text(description, pageWidth / 2, 115, 'center')
  pdf.setFontSize(12);
  branchName ? pdf.text('Branch: ' + branchName, pageWidth / 2, 130, 'center') : pdf.text('Branch: All', pageWidth / 2, 130, 'center');
  pdf.setFontSize(12);
  pdf.text('From: ' + from + ' To: ' + to, pageWidth / 2, 145, 'center');
  pdf.setFontSize(12);
  pdf.text('Report gerated at: ' + generatedAt, pageWidth / 2, 160, 'center');
  const label = document.querySelector(`#exported`)
  domtoimage.toPng(label).then(canLabel => {
    if (canLabel.length > 50) {
      pdf.addImage(canLabel, 'PNG', language === 'ar' ? 0 : pageWidth / 4, 160, 700, 200)
    }
    const options = { beforePageContent: header, afterPageContent: footer, startY: pdf.pageCount > 1 ? pdf.autoTableEndPosY() + 100 : 350, margin: { left: 5, right: 5, bottom: 5 } };
    const columns = Object.keys(tabledData[0]).map(key => {
      return { header: key, dataKey: key }
    })
    pdf.autoTable(columns, tabledData, options);
    if (typeof pdf.putTotalPages === 'function') {
      pdf.putTotalPages(totalPagesExp);
    }
    pdf.save(reportName + '_export_' + new Date().toISOString().split('T')[0] + '.pdf');
  })
};

