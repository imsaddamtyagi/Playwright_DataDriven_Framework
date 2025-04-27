const fs = require('fs');
const path = require('path');

// Initialize counters for passed, failed and skipped tests
let passedTests = 0;
let failedTests = 0;
let skippedTests = 0;

// Initialize HTML report structure without CSS styling
let reportHTML = `
<div class="report-container">
  <div class="report-header">
  </div>
  <table>
    <thead>
      <tr>
        <th>Scenario</th>
        <th>Description</th>
        <th>Remarks</th>
        <th>File</th>
        <th>Result</th>
      </tr>
    </thead>
    <tbody>`;
let stepCount = 1;

// Function to write to the report
async function writeToReport(description, remarks, screenshotPath, result) {
  let resultClass;
  if (result.toLowerCase() === 'pass') 
    { resultClass = 'status-pass';
  } else if (result.toLowerCase() === 'fail') {
    resultClass = 'status-fail';
  } else if (result.toLowerCase() === 'skip') {
    resultClass = 'status-skipped';
  }
  const baseDirectory = __dirname;
  const relativepath = path.relative(baseDirectory, screenshotPath);

  if(result.toLowerCase() === 'pass')      { passedTests++; }
  else if(result.toLowerCase() === 'fail') { failedTests++; }
  else if(result.toLowerCase() === 'skip') { skippedTests++; }

  reportHTML += `
    <tr>
      <td>${stepCount++}</td>
      <td>${description}</td>
      <td>${remarks}</td>
      <td><a class="screenshot-link" href="${relativepath}" target="_blank">View Screenshot</a></td>
      <td><span class="${resultClass}">${result}</span></td>
    </tr>
    `;
}

// Function to generate the combined HTML report
function generateCombinedReport(testResults, executionTime) {
  testResults = {
    passed: passedTests,
    failed: failedTests,
    skipped: skippedTests
  };

  const chartData = JSON.stringify({
    labels: ['Passed', 'Failed', 'Skipped'],
    datasets: [{
      data: [testResults.passed, testResults.failed, testResults.skipped],
      backgroundColor: ['#4CAF50', '#F44336', '#FFC107']
    }]
  });

  const combinedHtmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Test Summary</title>
      <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
      <script src="https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels"></script>
  <style>
/* General Styling */
body {
    font-family: 'Arial', sans-serif;
    margin: 0;
    padding: 0;
    background-color: #f5f5f5;
}

/* Header Styling */
h1, h2, h3 {
    color: #333;
    margin: 0;
    padding: 5px;
    text-align: center;
    font-size: 18px;
    font-weight: bold;
    letter-spacing: 1px;
}

/* Header Section (Logo + Summary Table) */
.header-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 20px;
    padding: 20px;
    background: white;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.12);
    border-radius: 12px;
    margin-bottom: 20px;
    max-width: 1000px;
    margin: auto;
    flex-wrap: wrap;
    transition: all 0.3s ease;
}

/* Logo */
.company-logo {
    max-width: 80px;
    max-height: 80px;
    height: auto;
    width: auto;
    filter: drop-shadow(2px 2px 5px rgba(0, 0, 0, 0.1));
}

/* Report Title */
.report-title {
    text-align: center;
    font-weight: bold;
    font-size: 20px;
    width: 100%;
    margin-bottom: 10px;
}

/* Summary Table */
.summary-table {
    border-collapse: collapse;
    background: #fff;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.12);
    border-radius: 10px;
    overflow: hidden;
    width: 100%;
    max-width: 600px;
    min-width: 400px;
}

/* Table Content */
.summary-table th, .summary-table td {
    padding: 12px 18px;
    border: 1px solid #ddd;
    text-align: left;
    word-wrap: break-word;
}

.summary-table th {
    background: linear-gradient(135deg, #4CAF50, #3a9d42);
    color: white;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.summary-table tr:nth-child(even) {
    background-color: #f0f5fa;
}

/* Hover Effects */
.summary-table tr:hover {
    background-color: #e3f2fd;
    transition: background-color 0.3s ease;
}

/* Report Container */
.report-container {
    max-width: 1000px;
    margin: 0 auto;
    background: white;
    padding: 15px;
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
    border-radius: 10px;
    overflow-x: auto;
    transition: all 0.3s ease;
}

/* Main Table Styling */
table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 10px;
}

th, td {
    padding: 10px;
    font-size: 14px;
    border-bottom: 1px solid #ddd;
}

th {
    background: linear-gradient(135deg, #4CAF50, #3a9d42);
    color: white;
    text-align: left;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border-bottom: 3px solid #3a9d42;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

tr:nth-child(even) {
    background-color: #f7f8fc;
}

tr:hover {
    background-color: #e3f2fd;
    transition: background-color 0.3s ease;
}

/* Status Labels */
.status-pass, .status-fail, .status-skipped {
    padding: 7px 12px;
    border-radius: 6px;
    font-weight: bold;
    text-transform: uppercase;
    font-size: 12px;
    display: inline-block;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
}

.status-pass {
    background: linear-gradient(135deg, #28a745, #1e7e34);
    color: white;
}

.status-fail {
    background: linear-gradient(135deg, #dc3545, #a71d2a);
    color: white;
}

.status-skipped {
    background: linear-gradient(135deg, #ff9800, #e57c00);
    color: white;
}

/* Screenshot Link */
.screenshot-link {
    color: #007bff;
    font-weight: bold;
    text-decoration: none;
    transition: all 0.3s ease;
}

.screenshot-link:hover {
    text-decoration: underline;
    opacity: 0.8;
    transform: scale(1.05);
}

/* Chart Styling */
.chart-container {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 2%;
    flex-wrap: wrap;
}

#testChart {
    max-width: 320px;
    max-height: 320px;
    border-radius: 10px;
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
}

/* Footer Styling */
.report-footer {
    text-align: center;
    margin-top: 30px;
    font-size: 14px;
    color: #555;
}

/* Author Info */
.author-info {
    text-align: center;
    margin-top: 20px;
    color: #444;
    font-weight: bold;
    font-size: 14px;
    text-transform: uppercase;
}

/* Responsive Design */
@media screen and (max-width: 768px) {
    .header-container {
        flex-direction: column;
        text-align: center;
        padding: 15px;
    }

    .company-logo {
        max-width: 100px;
    }

    .summary-table {
        width: 100%;
        font-size: 12px;
    }

    th, td {
        padding: 10px;
        font-size: 12px;
    }

    .chart-container {
        flex-direction: column;
    }
}

/* Animations */
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}
</style>

    </head>
    <body>
      <!-- Header Container -->
      <div class="header-container">
        <div class="company-logo">
          <img src="../AutomationReports/Logo/MyLogo.jpg" alt="Company Logo" width="120">
        </div>
        <div class="summary-section">

        <div><h1>Web Test Automation Report</h1></div>

        <table class="summary-table">
          <tr>
            <th style="padding: 10px;border:1px solid #ddd;">Total Tests Executed</th>
            <th style="padding: 10px;border:1px solid #ddd;">Total Tests Passed</th>
            <th style="padding: 10px;border:1px solid #ddd;">Total Tests Failed</th>
            <th style="padding: 10px;border:1px solid #ddd;">Total Tests Skipped</th>
          </tr>
          <tr>
            <td style="padding: 10px;border:1px solid #ddd;">${passedTests + failedTests + skippedTests}</td>
            <td style="padding: 10px;border:1px solid #ddd;">${passedTests}</td>
            <td style="padding: 10px;border:1px solid #ddd;">${failedTests}</td>
            <td style="padding: 10px;border:1px solid #ddd;">${skippedTests}</td>
          </tr>
        </table>
      </div>
      </div>

      <h2>Total Execution Time: ${executionTime}</h2>
      <h3>Detailed Test Results</h3>

      <div id="report">${reportHTML}
      </div>
    
      <div id="chart" class="chart-container">
        <canvas id="testChart"></canvas>
      </div>

      <div class="author-info">
        <p>Date: ${new Date().toLocaleDateString()} Time: ${new Date().toLocaleTimeString()}</p>
        <p>Author: Husain</p>
      </div>

      <script>
        const chartData = ${chartData};
        document.addEventListener("DOMContentLoaded", function() {
          const canvasElement = document.getElementById('testChart');
          if (canvasElement) {
            const ctx = canvasElement.getContext('2d');
            new Chart(ctx, {
              type: 'pie',
              data: chartData,
              options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                  datalabels: {
                    color: '#000',
                    formatter: function(value, context) {
                      return context.chart.data.labels[context.dataIndex] + ': ' + value;
                    },
                    anchor: 'end',
                    align: 'start',
                    offset: 10,
                    borderWidth: 1,
                    borderColor: '#fff',
                    borderRadius: 4,
                    backgroundColor: 'rgba(255,255,255,0.8)',
                    display: function(context) {
                      return context.dataset.data[context.dataIndex]!==0
                      clip;}
                      }                 
                     }
              },
              plugins: [ChartDataLabels]
            });
          } else {
            console.error('Canvas element not found');
          }
        });
      </script>
    </body>
    </html>
  `;
    let Number= Math.floor(Math.random() * 100);
  fs.writeFileSync(`AutomationReports/combined_report_${Number}.html`, combinedHtmlContent);
}

// Function to finalize the HTML report
function finalizeReport(testResults, executionTime) {
  const htmlFooter = `
    </tbody>
    </table>
    <div class="report-footer">
      <p>Generated by Playwright Test Automation Framework</p>
    </div>
  </div>
  </body>
  </html>`;

  // Add footer to the report content
  reportHTML += htmlFooter;
  console.log('Finalizing report with testResults:', {
    passed: passedTests,
    failed: failedTests,
    skipped: skippedTests
  });

  // Generate combined report with the chart
  generateCombinedReport(testResults, executionTime);
}

module.exports = { writeToReport, finalizeReport };
