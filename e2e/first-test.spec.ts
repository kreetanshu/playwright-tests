import {test, expect, Browser, Page} from '@playwright/test'
import {chromium, firefox} from 'playwright'

const url: string = "https://google.com"
const expTitle: string = 'Google';
const url2: string = "https://en.wikipedia.org/wiki/Main_Page"

let browser: Browser;
let page:  Page;


test.beforeAll(async ()=>{
  browser = await chromium.launch({headless: false});
  page = await browser.newPage();
})

test.afterAll(async () => {
    await browser.close();
})

test('first-google-test' ,async ()=>{
  
    await page.goto(url);

    await page.waitForTimeout(3000)

    const title = await page.title();

    expect(title).toContain(expTitle)
})

let enteredText: string = "Test"

test('test-locators' ,async ()=>{
  
    await page.goto(url2);

    await page.waitForTimeout(3000)

    let searchBox = page.locator("//input[@placeholder='Search Wikipedia']").nth(0);
    
    await searchBox.fill(enteredText);

    await page.getByRole('button',{name: 'Search'}).click()

    const actualText = await page.locator('.mw-page-title-main').nth(0).innerText();

    expect(actualText).toEqual(enteredText)
})

test('test dropdown',async () =>{
  
    await page.goto("https://demoqa.com/select-menu");

    await page.locator('select#oldSelectMenu').click();

    const optionElements = await page.locator('select#oldSelectMenu option').all();
    
    // Using map() with Promise.all() for concise iteration
    // const actualListItems: string[] = await Promise.all(
    //     optionElements.map(option => option.innerText())
    // );

    const actualListItems = await page.locator('select#oldSelectMenu option').allInnerTexts();

    actualListItems.sort();

    console.log(actualListItems);

    await page.locator('select#oldSelectMenu').selectOption('Green')

    await page.waitForTimeout(3000)

    //const optionsElements2 = await page.locator('select#oldSelectMenu option').allInnerTexts();

})

test('test multiselect',async () =>{
  
    await page.goto("https://demoqa.com/select-menu");

    //await page.locator('input#react-select-4-input').click();
    let combobox = page.getByRole('combobox').last();

    await combobox.click();

    //await combobox.getByRole('listitem').filter({has: page.getByText('Green')}).click()

    await page.locator("//div[text()='Green']").click();
    //await page.getByText('Green', { exact: true }).click()

    await page.locator("//div[text()='Blue']").click();

    await page.waitForTimeout(3000);
})

