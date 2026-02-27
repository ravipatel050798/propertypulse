const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    page.on('console', msg => {
        if (msg.type() === 'error') {
            console.log('PAGE ERROR LOG:', msg.text());
        }
    });
    
    page.on('pageerror', err => {
        console.log('PAGE EXCEPTION:', err.toString());
    });

    await page.goto('http://localhost:5173');
    await new Promise(r => setTimeout(r, 2000));
    
    // Click Network
    await page.evaluate(() => {
        const links = document.querySelectorAll('div, button, a, span');
        for (const el of links) {
            if (el.textContent === 'Property Network') {
                el.click();
                break;
            }
        }
    });

    await new Promise(r => setTimeout(r, 2000));
    await browser.close();
})();
