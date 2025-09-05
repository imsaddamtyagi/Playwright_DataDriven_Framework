import { test, expect   } from '@playwright/test'; // Import Playwright
import { readExcelData  } from '../DataHandler/excelHelper';
import { finalizeReport } from '../ReportHandler/report.js';
import PlaywrightActions from '../ActionHandler/PlaywrightActions';
const TestDataPath = './TestData/PlaywrightData.xlsx';
const URL = 'https://demo.automationtesting.in/Register.html';

test('runTest', async ({ page }) => {
    const startTime = new Date().getTime();
    let endTime;
    let actions = new PlaywrightActions(page, expect);
    try {
        const masterSheetName = "MasterSheet";
        const masterSheetData = await readExcelData(TestDataPath, masterSheetName);
        const sheetNames = masterSheetData.map(row => row.name);
        let count = 1;

        for (const sheetName of sheetNames) {
            console.log(`^^^^^^^^^^^^ Executing test cases from sheet -> ${sheetName} ^^^^^^^^^^^^`);
            if (sheetName === 'Login Page' || count === 1) {
                await page.goto(URL, { waitUntil: 'domcontentloaded' });
                console.log(`!!!!! Login Page is Loaded !!!!!`);
                count += 1;
            }

            const testData = await readExcelData(TestDataPath, sheetName); // Path to Excel file
            for (const actionData of testData) {
                const normalizedData = {};
                for (const key in actionData) {
                   {const trimmedKey = key.trim().toLowerCase().replace(/\s+/g, '');
                    normalizedData[trimmedKey] = actionData[key];}
                }
                
                const { name, operation, xpathlocator, testdata } = normalizedData;
                // console.log('Normalized values:', name, operation, xpathlocator, testdata);

                switch (operation) {
                    case 'doclick':             await actions.doClick(xpathlocator, testdata);                    break;
                    case 'dofill':              await actions.doFill(xpathlocator, testdata);                     break;
                    case 'dofillindex':         await actions.doFillIndex(xpathlocator, testdata);                break;
                    case 'dowaitforelement':    await actions.doWaitForElement(xpathlocator);                     break;
                    case 'dofileupload':        await actions.doFileUpload(xpathlocator,testdata);                break;
                    case 'doscroll':            await actions.doScroll(xpathlocator,testdata);                    break;
                    case 'dowait':              await actions.doWait(xpathlocator,testdata);                      break;
                    case 'doreport':            await actions.doReport(xpathlocator, testdata,name);              break;
                    case 'doswitchtab':         await actions.doSwitchTab(xpathlocator);                          actions.page=newTab; actions = new PlaywrightActions(newTab,except);                   break;
                    case 'doselect':            await actions.doSelect(xpathlocator,testdata);                    break;
                
                   default: console.log(`Invalid operation: ${operation}`);

                } // Switch ends
            } // Inner for ends
        } // Outer for ends
    } catch (error) {
        console.error("An error occurred", error);
    } finally {
        endTime = new Date().getTime();
        const executionTime = getExecutionTime(startTime, endTime);
        finalizeReport(actions.testResults, executionTime);
        await page.pause();
    }
});


function getExecutionTime(startTime, endTime) 
{
    const duration = endTime - startTime;
    const minutes = Math.floor((duration / (1000 * 60)) % 60);
    const seconds = Math.floor((duration / 1000) % 60);
    return `${minutes}m ${seconds}s`;
}
