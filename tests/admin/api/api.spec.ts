import {test, expect, request} from '@playwright/test';
import { readFile } from 'fs/promises';
import * as path from 'path';


test('API Get all users', async ({ page, request}) => {
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