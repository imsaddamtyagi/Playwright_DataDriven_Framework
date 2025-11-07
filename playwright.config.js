const config = 
{
    testDir: './tests',
    timeout: 5 * 60 * 1000,  // 1000 MilliSeconds = 1 Seconds
    //reporter: 'html',

    use:
    {
        browserName: 'chromium',
        headless: false,
        screenshot: 'on',
        video: 'off',
        trace: 'off',
        viewport: { width: 1366, height: 768 },
        permissions: ['geolocation'],
        geolocation: { latitude: 28, longitude: 77 },
        contextOptions: { permissions: ['geolocation'] },
        launchOptions: { slowMo: 100 } // 150 milliseconds slow motion
    },
    expect: { timeout: 5000 } // For Assertion
};

export default config;










/*
const config = {
    testDir: './tests',
    timeout: 300 * 1000, // 100 * Seconds
    fullyParallel: true,
    workers:1, // Executed one by one sequentially and not Parallely
    // workers:3, // Executes parallely on all 3 browser

    use: {
        trace: 'on'
    },

    projects:[
        {
            name:'chromium',
            use:{
                browserName:'chromium',headless: false, slowMo:500, screenshot:'on', video:'on', trace:'off',
                viewport: { width: 1366, height: 768 }, permissions:['geolocation'],
                geolocation:{latitude:28,longitude:77},
                contextOptions:{permissions:['geolocation']}
            },
        },
        {
            name:'firefox',
            use:{
                browserName:'firefox',headless: false, slowMo:500, screenshot:'on', video:'on', trace:'off',
                viewport: { width: 1366, height: 768 }, permissions:['geolocation'],
                geolocation:{latitude:28,longitude:77},
                contextOptions:{permissions:['geolocation']}
            }
        },
{
    name: 'firefox',
    use: {
      browserName: 'firefox', headless: false, slowMo: 500, screenshot: 'on', video: 'on', trace: 'off',
      viewport: { width: 1366, height: 768 }, permissions: ['geolocation'],
      geolocation: { latitude: 28, longitude: 77 },
      contextOptions: { permissions: ['geolocation'] }
    }
  },
  {
    name: 'webkit',
    use: {
      browserName: 'webkit', headless: false, slowMo: 500, screenshot: 'on', video: 'on', trace: 'off',
      viewport: { width: 1366, height: 768 }, permissions: ['geolocation'],
      geolocation: { latitude: 28, longitude: 77 },
      contextOptions: { permissions: ['geolocation'] }
    }
  },
    ],
    expect: { timeout: 5000 }, // For Assertion
};
  
*/