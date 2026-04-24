import {test, expect, Browser, Page, Locator} from '@playwright/test'
import { chromium, firefox } from 'playwright'

let browser: Browser;
let page:  Page;


test.beforeAll(async ()=>{
  browser = await chromium.launch({headless: false});
  page = await browser.newPage();
})

test.afterAll(async () => {
    await browser.close();
})

test('webtable test', async()=>{
    await page.goto("https://money.rediff.com/indices/bse/snsx50");
    const rows = await page.locator("table.dataTable tbody tr").allInnerTexts();
    //console.log(rows)

    let tableList: string [][] = [];
    tableList[0] = [];
    let i=0;
    for(const row of rows){
       tableList[i]= row.split("\t")
       //console.log(row)
       i++;
    }

    //console.log(tableList)
    console.log(tableList.at(0)?.at(0))

    expect(tableList.at(0)?.at(0)).toContain("Adani")

})

test('webtable test 2', async()=>{
    await page.goto("https://money.rediff.com/indices/bse/snsx50");
    const rows = await page.locator("table.dataTable tbody tr").all();
    //console.log(rows)

    let tableList: string [][] = [];
    let tableCells: string[] = [];

    for(const row of rows){
        const cells = await row.locator('td').all();
        
        tableCells = [];

        for(const cell of cells){
            const cellText = await cell.innerText();
            tableCells.push(cellText);
        }
        tableList.push(tableCells);
    }

    console.log(tableList)
    console.log(tableList.at(0)?.at(0))

    expect(tableList.at(0)?.at(0)).toContain("Adani")

})