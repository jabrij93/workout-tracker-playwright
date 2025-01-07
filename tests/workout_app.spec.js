const { test, expect, describe, beforeEach } = require('@playwright/test')

describe('Workout Tracker app', () => {
  test('front page can be opened', async ({ page }) => {
    await page.goto('http://localhost:5173')
  
    const locator = await page.getByText('Let\'s do this')
    await expect(locator).toBeVisible()
    await expect(page.getByText('This is not a real online service! You know you need something like this in your life to help you realize your deepest dreams.')).toBeVisible()
  })

  describe('when logged in', () => {
    beforeEach(async ({ page }) => {
      await page.goto('http://localhost:5173')

    await page.getByTestId('username').first().fill('mluukkai')
    await page.getByTestId('password').last().fill('salainen')
    await page.getByRole('button', { name: 'Login', exact: true }).click()
    await expect(page.getByText('Matti Luukkainen')).toBeVisible()
    })

    test('a new workout can be created', async ({ page }) => {
      await page.getByRole('button', { name: 'NEW +', exact: true }).nth(1).click()
      await page.getByTestId('workout').fill('a new workout created by playwright')
      await page.getByRole('button', { name: 'Add Workout' }).click()
    })
  })  
})

