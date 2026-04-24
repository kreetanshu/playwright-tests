import {request, test, expect } from '@playwright/test'

test('Mock API', async ({page,context})=>{

    await page.route("**/users/1", route => {
        if(route.request().method() === 'GET'){
            route.fulfill({ body: JSON.stringify({ mocked: true }) })
        }
        else{
            route.continue()
        }
    })

    // await context.route("*//*/users/1", route => {
    //     route.fulfill({ body: JSON.stringify({ mocked: true }) })
    // })

    const response = await page.goto("https://jsonplaceholder.typicode.com/users/1");
    
   console.log(await response?.json())
})