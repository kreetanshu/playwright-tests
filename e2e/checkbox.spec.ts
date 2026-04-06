import {test, expect, Browser, Page, Locator, BrowserContext} from '@playwright/test'

import {chromium, firefox} from 'playwright'


let browser: BrowserContext;
let page:  Page;

test.beforeAll(async()=>{
 browser = await chromium.launchPersistentContext('',{channel: 'chrome'})
 const pages: Page[] = browser.pages();
 page = pages[0]
})

test('checkbox-test',async()=>{
   await page.goto("https://demoqa.com/checkbox")
   const checkBox = page.getByRole('checkbox');

   console.log(await checkBox.count())

   if(!await checkBox.isChecked()){
     await checkBox.check();
   }
   
   await page.waitForTimeout(3000)
})