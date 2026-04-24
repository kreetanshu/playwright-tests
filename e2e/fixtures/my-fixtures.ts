import {test as base, expect} from '@playwright/test';

type MyFixtures = {
    username: string,
    age: number
}

export const test = base.extend<MyFixtures>({
    username: async({},use)=>{
      console.log("--------Before--------")
      await use("Into the USE method");
      console.log("--------After--------")
    }
})

export {expect}