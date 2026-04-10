import {test, expect, Browser, Page, BrowserContext} from '@playwright/test'
import {chromium, firefox} from 'playwright'

let browser: Browser;
let page: Page;
let context: BrowserContext;

test.beforeAll(async() => {
      browser = await chromium.launch({headless: false})
      context = await browser.newContext();
      page = await context.newPage()
})

test('js executor',async()=>{
    await page.goto("https://playwright.dev/docs/api/class-browsercontext")
    await page.evaluate(()=>{
        window.scrollTo(0,document.body.scrollHeight)
    })
    let videoLink = page.getByRole('link').filter({hasText: 'Learn Videos'});
    await videoLink.hover()
    
    await videoLink.evaluate((el: HTMLElement)=>{
        el.style.border = '3px solid red'
    })

    await page.screenshot({path:'./screenshots/page.png'})
    await videoLink.screenshot({path:'./screenshots/video.png'})

    await page.waitForTimeout(3000)

    let pages: Page[]=context.pages()
})

test('Browser context',async()=>{
    await page.goto("https://www.leafground.com/window.xhtml")
    //let pages: Page[]=context.pages()
    await page.locator("text='Open Multiple'").click() 
    await page.waitForTimeout(2000);
    let pages: Page[]=context.pages()
    //pages.push(...context.pages())
    console.log(pages.length)

    for(const popup of pages){
        await popup.waitForLoadState();
        console.log(await popup.title());
        await popup.close()
    }
})



