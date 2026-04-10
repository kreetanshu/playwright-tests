import { test, expect, Browser, Page, Locator } from '@playwright/test'
import { chromium, firefox } from 'playwright'

let browser: Browser;
let page: Page;


test.beforeAll(async () => {
    browser = await chromium.launch({ headless: false });
    page = await browser.newPage();
})

test.afterAll(async () => {
    await browser.close();
})

test('Test Mouse Hover', async () => {
    await page.goto('https://www.way2automation.com')

    await page.locator('//span[text()="All Courses"]').nth(0).hover();
    await page.locator('li#menu-item-27581').click();
    await page.waitForTimeout(3000)
    //let expLink = await page.getByRole('link').filter({hasText: 'node'}).getAttribute('title')
    //console.log(expLink)
})

test('Test Mouse Move', async () => {
    await page.goto('https://jqueryui.com/resizable')

    // Handle iframe
    //const frame = page.frameLocator('iframe');
    const frame = page.frameLocator('iframe.demo-frame')
    let locator = frame.locator("//div[@id='resizable']//div[3]");
    const boundingBox = await locator.boundingBox();

    if (boundingBox) {
        let startX = boundingBox.x + boundingBox.width / 2;
        let startY = boundingBox.y + boundingBox.height / 2;

        await page.mouse.move(startX, startY)
        await page.mouse.down()
        await page.mouse.move(startX + 400, startY + 400)
        await page.mouse.up()
    }
})

test('Drag and Drop', async () => {
    await page.goto('https://jqueryui.com/droppable/');
    const frame = page.frameLocator('iframe.demo-frame')
    await frame.locator('#draggable').dragTo(frame.locator('#droppable'));

    await page.locator("div.menu-top-container li").first().click({ button: 'right' })
    await page.waitForTimeout(3000)
})

test('Alerts', async () => {
    page.on('dialog', async (dialog) => {
        console.log(dialog.message())
        await dialog.accept();
    })
    await page.goto("https://demoqa.com/alerts")
    await page.locator("button#alertButton").click()

    await page.waitForTimeout(3000);
})

test('Single Window Popups', async () => {
    await page.goto("https://www.leafground.com/window.xhtml")

    const [popup1] = await Promise.all([
        page.waitForEvent('popup'),
        await page.locator("text='Open'").click()
    ])

    await page.waitForTimeout(3000)
    const trCount = await popup1.locator("//table//tr").count()

    console.log(trCount);

    popup1.close();

})

//Not a good approch, use insteas BrowserContext.pages()
test('Multiple Window Popups', async () => {
    await page.goto("https://www.leafground.com/window.xhtml")

    const popups: Page[] = []

    page.on('popup',async(popup)=>{
        popups.push(popup);
    })

    await page.locator("text='Open Multiple'").click() 
    await page.waitForTimeout(2000);

    for(const popup of popups){
        let title = await popup.title();
        console.log(title);
        popup.close();
    }

    console.log(popups.length);
})

test('Basic HTTP Auth',async()=>{
    const context = await browser.newContext({
    httpCredentials: {
      username: 'admin',
      password: 'admin'
    }
    })

    page= await context.newPage();
    await page.goto("https://the-internet.herokuapp.com/basic_auth")
    const linkText = await page.getByRole('link').filter({hasText: 'Selenium'}).innerText()
    expect(linkText).toContain("Selenium")
    await page.waitForTimeout(2000)
})

test('File Download', async () => {
   
    await page.goto("https://www.leafground.com/file.xhtml")
    
    page.on('download', async(download)=>{
        await download.saveAs('downloads/TestLeaf Logo.png')
        console.log('Downloaded file saved as:', download.suggestedFilename());
    })
    await page.getByText('Download').nth(1).click()

    await page.waitForTimeout(3000);
})

