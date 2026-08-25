import {test, expect} from '@playwright/test';
import { UserApiClient } from "../../../api/UserApiClient"


test('API Get all users 200 OK', async ({ page, request}) => {

    const apiClient = await UserApiClient.fromSavedAuthState(request)
    const response = await apiClient.getUsers()
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
    console.log('Response body (401): ', await response.text());
})

test('API Add an Admin users 200 OK', async ({ page, request}) => {
    const apiClient = await UserApiClient.fromSavedAuthState(request)
    const newUserPayload = {
      username: crypto.randomUUID().slice(0, 20),
      password: 'admin123',
      status: true,
      userRoleId: 1,
      empNumber: 1
    }
    
    const response = await apiClient.createUser(newUserPayload)
    expect(response.ok()).toBeTruthy()

    const bodyJson = await response.json()
    console.log(JSON.stringify(await bodyJson))
})

test('API Add an ESS users 200 OK', async ({ page, request}) => {
  const apiClient = await UserApiClient.fromSavedAuthState(request)
  const newUserPayload = {
      username: crypto.randomUUID().slice(0, 20),
      password: 'admin123',
      status: true,
      userRoleId: 2,
      empNumber: 1
    }
    
    const response = await apiClient.createUser(newUserPayload)
    expect(response.ok()).toBeTruthy()

    const bodyJson = await response.json()
    console.log(JSON.stringify(await bodyJson))  
})

test('API Add an user which already exist 422', async ({ page, request}) => {
  const apiClient = await UserApiClient.fromSavedAuthState(request)
    const newUserPayload = {
      username: 'Admin',
      password: 'admin123',
      status: true,
      userRoleId: 1,
      empNumber: 1
    }
    
    const response = await apiClient.createUser(newUserPayload)
    expect(response.status()).toBe(422)

    const bodyJson = await response.json()
    console.log(JSON.stringify(await bodyJson))  
})

test('API Delete an Admin users 200 OK', async ({ page, request}) => {
    const apiClient = await UserApiClient.fromSavedAuthState(request)
    const newUserPayload = {
      username: crypto.randomUUID().slice(0, 20),
      password: 'admin123',
      status: true,
      userRoleId: 1,
      empNumber: 1
    }
    
    const response = await apiClient.createUser(newUserPayload)  
    expect(response.ok()).toBeTruthy()

    const bodyJson = await response.json()
    console.log(JSON.stringify(await bodyJson))
  
    const userId = await bodyJson.data.id
    console.log(`User id ${userId}`)

    const UserDeletionResponse = await apiClient.deleteUsers(userId) 
    expect(UserDeletionResponse.ok()).toBeTruthy()

    const userDelteionResponseJson = await UserDeletionResponse.json()
    console.log(JSON.stringify(await userDelteionResponseJson))
})

/*test('API Add Employee 200 OK', async ({ page, request}) => {
    const apiClient = await UserApiClient.fromSavedAuthState(request)
    const newUserPayload = {
      username: 'Employee',
      password: 'employee123',
      status: true,
      userRoleId: 2,
      empNumber: 1
    }
    
    const response = await apiClient.createUser(newUserPayload)
    expect(response.ok()).toBeTruthy()

    const bodyJson = await response.json()
    console.log(JSON.stringify(await bodyJson))
})*/