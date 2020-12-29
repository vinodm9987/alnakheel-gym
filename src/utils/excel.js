import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

export const generateExcel = (json, excelFileName) => {
    const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const EXCEL_EXTENSION = '.xlsx';
    const worksheet = XLSX.utils.json_to_sheet(json);
    const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(data, excelFileName + '_export_' + new Date().toISOString().split('T')[0] + EXCEL_EXTENSION);
}