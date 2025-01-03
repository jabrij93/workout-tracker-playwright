const { test, expect } = require('@playwright/test')

test('front page can be opened', async ({ page }) => {
  await page.goto('http://localhost:5173')

  const locator = await page.getByText('Let\'s do this')
  await expect(locator).toBeVisible()
  await expect(page.getByText('This is not a real online service! You know you need something like this in your life to help you realize your deepest dreams.')).toBeVisible()
})