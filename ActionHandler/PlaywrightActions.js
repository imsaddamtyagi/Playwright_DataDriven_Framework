import { writeToReport } from '../ReportHandler/report.js';
const path = require('path'); // Ensure path module is imported
const fs = require('fs'); // File system module for creating directories
const readline = require('readline');

class PlaywrightActions
 {
    constructor(page, expect) {
        this.page = page;
        this.expect = expect;
        this.stepCount = 1;
        this.testResults = { passed: 0, failed: 0, skipped: 0 };
    }
/*
    async HighlightElement(locator, highlightTime = 50) {
        // Now evaluate the element to create the overlay
        await locator.evaluate((el, highlightTime) => {
            const rect = el.getBoundingClientRect();
            const overlay = document.createElement("div");
            overlay.style.position = "absolute";
            overlay.style.width = rect.width + "px";
            overlay.style.height = rect.height + "px";
            overlay.style.left = rect.left + window.scrollX + "px";
            overlay.style.top = rect.top + window.scrollY + "px";
            overlay.style.border = "2px solid red";
            overlay.style.backgroundColor = "rgba(255, 255, 0, 0.3)";
            overlay.style.zIndex = "9999";
            overlay.style.pointerEvents = "none"; // Allow pointer events to pass through
            document.body.appendChild(overlay);
    
            // Remove the overlay after highlightTime milliseconds
            setTimeout(() => overlay.remove(), highlightTime);
        }, highlightTime);
    
        // Ensure the overlay is removed before continuing
        await new Promise(resolve => setTimeout(resolve, highlightTime + 50));
    }
*/
    async doClick(XPathLocator) {
        try {
            const element = await this.page.locator(XPathLocator);
          //  await element.evaluate(el => {el.style.backgroundColor = 'yellow';el.style.border = '2px solid red';setTimeout(() => {el.style.border = '';}, 150);});
            await element.click();
            console.log(`Clicked on element: ${XPathLocator}`);
        } catch (error) {
            console.error('Error occurred:', error);
        }
    }

    async doFill(XPathLocator, testData) {
        try {
            const element = await this.page.locator(XPathLocator);
          //  await element.evaluate(el => {el.style.backgroundColor = 'yellow';el.style.border = '2px solid red';setTimeout(() => {el.style.border = '';}, 150);});
            await element.fill(testData);
            console.log(`Filled data: ${testData}`);
        } catch (error) {
            console.error('Error occurred:', error);
        }
    }
    
    async doFillIndex(XPathLocator, testData) {
            try {
                const element = await this.page.locator(XPathLocator).nth(0);
               // await element.evaluate(el => {el.style.backgroundColor = 'yellow';el.style.border = '2px solid red';setTimeout(() => {el.style.border = '';}, 150);});
                await element.fill(testData);
                console.log(`Entered -> ${testData} in -> ${XPathLocator}`);
            } catch(error) {
                console.error('Error occurred: ', error);
            }
        }

        async doSelect(XPathLocator, testData) {
            try {
                const element = await this.page.locator(XPathLocator);
              //  await element.evaluate(el => {el.style.backgroundColor = 'yellow';el.style.border = '2px solid red';setTimeout(() => {el.style.border = '';}, 150);});
              await element.selectOption(testData);
            console.log(`Selected data: ${testData}`);
            } catch (error) {
                console.error('Error occurred:', error);
            }
        }

        
        async doSwitchTab(XPathLocator) 
        {
            const context = this.page.context(); // Get the current browser context       
            try {
                const [newTab] = await Promise.all([
                    context.waitForEvent('page'), // Wait for new tab to open
                    await this.page.locator(XPathLocator).click({force: true})
                ]);
                await newTab.waitForLoadState(); // Ensure tab is fully loaded
                console.log(`--->Switch Success--->`);
                this.page = newTab; // Set new tab as active page.
                global.currentPage = newTab; // Store Globally
                return newTab;
            } catch(error) {
                console.error('Error occured:', error);
            }
        }

    async doWaitForElement(XPathLocator)
       {
    try{
        console.log("--------->Waiting started until the element appears on screen---------->");
        const element = await this.page.locator(XPathLocator);
       // await element.evaluate(el => {el.style.backgroundColor = 'yellow';el.style.border = '2px solid red';setTimeout(() => {el.style.border = '';}, 150);});
        await element.waitFor({state:'visible'});
        await element.waitFor({state:'attached'});
        console.log("--------->Element is now visible on the screen---------->");
    } catch(error) {console.error('Error occurred:',error);}
}

async doFileUpload(XPathLocator, testData) {
    try {
        const folderpath = path.join(__dirname, '../SampleFilesForTest');
        const fileToUpload = path.join(folderpath, 'voterback.jpg');
        console.log(`Available Image to be uploaded: ${fileToUpload}`);

        // Start waiting for file chooser before clicking. Note no await.
        const fileChooserPromise = this.page.waitForEvent('filechooser');
        const element = await this.page.locator(XPathLocator);
        await element.evaluate(el => {el.style.backgroundColor = 'yellow';el.style.border = '2px solid red';setTimeout(() => {el.style.border = '';}, 150);});
        await element.click({ force: true });
        const fileChooser = await fileChooserPromise;
        await fileChooser.setFiles(path.join(__dirname, '../SampleFilesForTest/voterback.jpg'));
        console.log(`Upload Success: ${testData}`);
    } catch (error) {
        console.error('Error occurred:', error);
    }
}

async doScroll(XPathLocator) {
    try {
        console.log("Scrolling to element");
        const element = await this.page.locator(XPathLocator).scrollIntoViewIfNeeded();
       // await element.evaluate(el => {el.style.backgroundColor = 'yellow';el.style.border = '2px solid red';setTimeout(() => {el.style.border = '';}, 150);});
        console.log(`scrolled to element: ${XPathLocator}`);
    } catch(error) {
        console.error('Error occured:', error);
    }
}

async doWait(XPathLocator) {
    try {
        console.log("--------------------->Waiting for", XPathLocator / 1000, "Seconds");
        await this.page.waitForTimeout(XPathLocator);
        console.log("--------------------->Wait over for", XPathLocator / 1000, "Seconds");
    } catch (error) {
        console.error('Error occurred:', error);
    }
}

        
    // Function to capture a screenshot and return the file path
async doCaptureScreenshot(actionName) {
    const timestamp = Date.now();
    const screenshotFileName = `${actionName}_${timestamp}.png`;
    const screenshotPath = path.join(__dirname, '../AutomationReports/Screenshots', screenshotFileName);

    // Capture the screenshot
    await this.page.screenshot({ path: screenshotPath });
    // console.log(`Captured screenshot: ${screenshotPath}`);
    return screenshotPath;
}

// Method to handle reporting (called by Test Class)
async doReport(xpathLocator, testData, status='Passed') {
    const description = `${xpathLocator}`;
    const remarks = `${testData}`;
    // Capture the screenshot of the page or action
    const screenshotPath = await this.doCaptureScreenshot('Report Action');
    // Write the report entry with description and remarks
    await writeToReport(description, remarks, screenshotPath, status); // Status is set to 'Pass' automatically
   // console.log('Current testResults:', this.testResults);
}


    }
    
    export default PlaywrightActions;
    
