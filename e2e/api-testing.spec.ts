import { expect, test } from '@playwright/test'

test('GET API Test', async ({ request }) => {
    const response = await request.get('https://jsonplaceholder.typicode.com/users/1');
    //console.log(await response.json()) 
    expect(response.status()).toBe(200)

    const responseHeader = response.headersArray()
    //console.log(responseHeader)
    //const apiDateStr = responseHeader.find(p=>p.name==='Date')?.value ?? ''
    const apiDateStr: string = responseHeader.find(p => p.name === 'Date')!.value
    const apidate = new Date(apiDateStr)
    const todayDate = new Date();
    console.log(responseHeader.find(p => p.name === 'Date')?.value)
    expect(todayDate.toDateString()).toBe(apidate.toDateString())

})

test('Post API Test', async ({ request }) => {
    const response = await request.post('https://fakestoreapi.com/products/', {
        data: {
            "title": "RK",
            "price": 2,
            "description": "Test RK",
            "category": "human",
            "image": "http://example.com"
        },
        headers: {
            'Content-Type': 'application/json'
        }
    }
    )
    expect(response.status()).toBe(201)
    console.log(await response.json())
})