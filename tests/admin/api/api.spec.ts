import {test, expect, request} from '@playwright/test';
import { readFile } from 'fs/promises';
import * as path from 'path';


test('API Get all users 200 OK', async ({ page, request}) => {
    const authFilePath = path.resolve(process.cwd(), '.auth', 'admin.json')
    const authState = JSON.parse(await readFile(authFilePath, 'utf-8')) as {
      cookies?: Array<{name: string, value: string}>
    }

    const orangeHrmCookie = authState.cookies?.find(cookie => cookie.name = 'orangehrm')
    expect(orangeHrmCookie, 'The orangehrm cookie was not found in the saved auth state').toBeTruthy()

    const cookieHeader = `orangehrm=${orangeHrmCookie?.value}`  

    const response = await request.get('https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/admin/users?limit=50&offset=0&sortField=u.userName&sortOrder=ASC',{
      headers: {
        Cookie: cookieHeader,
        Accept: 'application/json'
      }
    })
    expect(response.ok()).toBeTruthy()

    const bodyJson = await response.json()
    console.log(JSON.stringify(await bodyJson))
})

test('API Get all users 401 Unauthorized', async ({ page, request}) => {

    const cookieHeader = `orangehrm=invalid_value-to-force_response_401`  

    const response = await request.get('https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/admin/users?limit=50&offset=0&sortField=u.userName&sortOrder=ASC',{
      headers: {
        Cookie: cookieHeader,
        Accept: 'application/json'
      }
    })
    expect(response.status()).toBe(401)

    const bodyJson = await response.json()
    console.log('Response body (401): ', await response.text());
})


test('API Add an Admin users 200 OK', async ({ page, request}) => {
    const authFilePath = path.resolve(process.cwd(), '.auth', 'admin.json')
    const authState = JSON.parse(await readFile(authFilePath, 'utf-8')) as {
      cookies?: Array<{name: string, value: string}>
    }

    const username = crypto.randomUUID().slice(0, 20)
    const password = 'admin123' 

    const orangeHrmCookie = authState.cookies?.find(cookie => cookie.name = 'orangehrm')
    expect(orangeHrmCookie, 'The orangehrm cookie was not found in the saved auth state').toBeTruthy()

    const cookieHeader = `orangehrm=${orangeHrmCookie?.value}`  

    const response = await request.post('https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/admin/users',{
      headers: {
        Cookie: cookieHeader,
        Accept: 'application/json'
      },
      data: {
        username: username, password: password, status: true, userRoleId: 1, empNumber: 137
      }
    })
    expect(response.ok()).toBeTruthy()

    const bodyJson = await response.json()
    console.log(JSON.stringify(await bodyJson))
})

test('API Add an ESS users 200 OK', async ({ page, request}) => {
    const authFilePath = path.resolve(process.cwd(), '.auth', 'admin.json')
    const authState = JSON.parse(await readFile(authFilePath, 'utf-8')) as {
      cookies?: Array<{name: string, value: string}>
    }

    const username = crypto.randomUUID().slice(0, 20)
    const password = 'admin123' 

    const orangeHrmCookie = authState.cookies?.find(cookie => cookie.name = 'orangehrm')
    expect(orangeHrmCookie, 'The orangehrm cookie was not found in the saved auth state').toBeTruthy()

    const cookieHeader = `orangehrm=${orangeHrmCookie?.value}`  

    const response = await request.post('https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/admin/users',{
      headers: {
        Cookie: cookieHeader,
        Accept: 'application/json'
      },
      data: {
        username: username, password: password, status: true, userRoleId: 2, empNumber: 137
      }
    })
    expect(response.ok()).toBeTruthy()

    const bodyJson = await response.json()
    console.log(JSON.stringify(await bodyJson))
})

test('API Add an user which already exist 422', async ({ page, request}) => {
    const authFilePath = path.resolve(process.cwd(), '.auth', 'admin.json')
    const authState = JSON.parse(await readFile(authFilePath, 'utf-8')) as {
      cookies?: Array<{name: string, value: string}>
    }

    const username = 'Admin'
    const password = 'admin123' 

    const orangeHrmCookie = authState.cookies?.find(cookie => cookie.name = 'orangehrm')
    expect(orangeHrmCookie, 'The orangehrm cookie was not found in the saved auth state').toBeTruthy()

    const cookieHeader = `orangehrm=${orangeHrmCookie?.value}`  

    const response = await request.post('https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/admin/users',{
      headers: {
        Cookie: cookieHeader,
        Accept: 'application/json'
      },
      data: {
        username: username, password: password, status: true, userRoleId: 1, empNumber: 137
      }
    })
    expect(response.status()).toBe(422)

    const bodyJson = await response.json()
    console.log(JSON.stringify(await bodyJson))
})