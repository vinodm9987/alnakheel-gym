import jsPdf from 'jspdf';
import 'jspdf-autotable';
import { dateToDDMMYYYY, dateToHHMM } from './apis/helpers';
import domtoimage from 'dom-to-image'

export const generateReport = (image, tabledData, reportName, fromDate, toDate, branchName, description, language) => {
  const totalPagesExp = '{total_pages_count_string}';
  let pdf = new jsPdf('l', 'pt', 'a4');
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
      branchName && image && pdf.addImage(image, 'PNG', pageWidth / 2 - 30, 10, 80, 32)
    } else {
      branchName && image && pdf.addImage(image, 'PNG', pageWidth / 2 - 70, 10, 150, 60);
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
  pdf.text('Report Generated On: ' + generatedAt, pageWidth / 2, 160, 'center');
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

