import {test, expect, Browser, Page, Locator} from '@playwright/test'
import { chromium, firefox } from 'playwright'

let browser: Browser;
let page:  Page;


test.beforeAll(async ()=>{
  browser = await chromium.launch({headless: false});
  const context = await browser.newContext({httpCredentials: {username: 'admin',password: 'admin'}})
  page = await context.newPage();
})

test.afterAll(async () => {
    await browser.close();
})

test('Test Shadow Root',async()=>{
    await page.goto('chrome://downloads/')

    await page.locator('#searchInput').fill("node");
    await page.waitForTimeout(3000)
    //let expLink = await page.getByRole('link').filter({hasText: 'node'}).getAttribute('title')
    //console.log(expLink)
})