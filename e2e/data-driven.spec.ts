import {test,expect, Browser, Page} from '@playwright/test'

import { chromium, firefox } from 'playwright'

import formDataJson from '../test-data/formData.json'
import {readCSVData} from '../utils/readCSV'

let browser: Browser;
let page:  Page;


test.beforeAll(async ()=>{
  browser = await chromium.launch({headless: false});
  page = await browser.newPage();
})


test('Read from JSON', async () => {
  for(const row of formDataJson){
  await page.goto('https://sso.teachable.com/secure/673/identity/sign_up/otp');
  await page.locator('input#name').fill(row.username)
  await page.locator('input#email').fill(row.email)
  await page.waitForTimeout(2000)  
  }
});

test('Read from excel', async () => {
  const formDataCSV = readCSVData('test-data/formData.csv');
  for(const row of formDataCSV){
  await page.goto('https://sso.teachable.com/secure/673/identity/sign_up/otp');
  await page.locator('input#name').fill(row.username)
  await page.locator('input#email').fill(row.email)
  await page.waitForTimeout(2000)  
  }
});