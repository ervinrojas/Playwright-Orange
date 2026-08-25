import {test, expect} from '@playwright/test';
import { UserApiClient } from '../../../api/UserApiClient';


test('API Get all users 403 Unauthorized', async ({ page, request}) => {
  const apiClient = await UserApiClient.fromSavedAuthStateEmp(request)
  const response = await apiClient.getUsers()
  expect(response.status()).toBe(403)

  console.log('Response body (403): ', await response.text());
  /*const authFilePath = path.resolve(process.cwd(), '.auth', 'employee.json')
    const authState = JSON.parse(await readFile(authFilePath, 'utf-8')) as {
      cookies?: Array<{name: string, value: string}>
    }

    const orangeHrmCookie = authState.cookies?.find(cookie => cookie.name === 'orangehrm')
    expect(orangeHrmCookie, 'The orangehrm cookie was not found in the saved auth state').toBeTruthy()

    const cookieHeader = `orangehrm=${orangeHrmCookie?.value}`  

    const response = await request.get('https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/admin/users?limit=50&offset=0&sortField=u.userName&sortOrder=ASC',{
      headers: {
        Cookie: cookieHeader,
        Accept: 'application/json'
      }
    })
    expect(response.status()).toBe(403)

    console.log('Response body (403): ', await response.text());*/
})