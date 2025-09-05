const ExcelJS = require('exceljs');

export async function readExcelData(filePath, sheetName) {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);

    const worksheet = workbook.getWorksheet(sheetName);
    const rows = [];
    worksheet.eachRow((row, rowNumber) => {
 const rowValues = 
 row.values.slice(1).filter(value => value !== undefined && value !== null && value !== '');
        if (rowValues.length > 0 && rowNumber > 1) {
            const [name, operation, XPathLocator, testData] = rowValues;
            rows.push({ name, operation, XPathLocator, testData });
        }
    });
    return rows;
}
