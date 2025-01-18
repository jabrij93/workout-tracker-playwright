const { test, expect, describe, beforeEach } = require('@playwright/test')

describe('Workout Tracker app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3002/api/testing/reset')

    await request.post('http://localhost:3002/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    });

    await request.post('http://localhost:3002/api/users', {
      data: {
        name: 'Superuser',
        username: 'root',
        password: 'salainen'
      }
    });

    await page.goto('http://localhost:5173')
  })

  test('front page can be opened', async ({ page }) => {
    await page.goto('http://localhost:5173')
  
    const locator = await page.getByText('Let\'s do this')
    await expect(locator).toBeVisible()
    await expect(page.getByText('This is not a real online service! You know you need something like this in your life to help you realize your deepest dreams.')).toBeVisible()
  })

  test('user can login', async ({ page }) => {
    await page.goto('http://localhost:5173')
    await page.getByTestId('username').first().fill('mluukkai')
    await page.getByTestId('password').last().fill('salainen')
    await page.getByRole('button', { name: 'Login', exact: true }).click()
    await expect(page.getByText('Matti Luukkainen')).toBeVisible()
  })

  test('login fails with wrong password', async ({ page }) => {
    await page.goto('http://localhost:5173')
    await page.getByTestId('username').first().fill('mluukkai')
    await page.getByTestId('password').last().fill('wrongpassword')
    await page.getByRole('button', { name: 'Login', exact: true }).click()
    await expect(page.getByText('Username or password is incorrect')).toBeVisible()
  })

  describe('when logged in', () => {
    beforeEach(async ({ page }) => {
      await page.goto('http://localhost:5173');
      await page.getByTestId('username').first().fill('mluukkai');
      await page.getByTestId('password').last().fill('salainen');
      await page.getByRole('button', { name: 'Login', exact: true }).click();
      await expect(page.getByText('Matti Luukkainen')).toBeVisible();
  
      await page.getByRole('button', { name: 'NEW +', exact: true }).nth(1).click();
      await page.getByTestId('workout').fill('pull-ups by playwright with date 11');
  
      // Use placeholder text to locate the date input
      // console.log('Filling in the date...');
      // await page.locator('input[placeholder="Select a date"]').fill('11-09-2024');
      // console.log('Date filled.');
  
      // // Close the date picker
      // await page.keyboard.press('Escape'); // Press Escape to close the date picker
      // await page.waitForSelector('.react-datepicker', { state: 'hidden' }); // Wait for the date picker to close
  
      // Wait for the network request to complete after clicking "Add Workout"
      await Promise.all([
        page.waitForResponse(response => {
          console.log('Response received:', response.url(), response.status());
          return response.url().includes('/api/workouts') && response.status() === 200;
        }, { timeout: 10000 }), // Increase timeout to 10 seconds
        page.getByRole('button', { name: 'Add Workout' }).click(),
      ]);
    }, 10000);
  
    test('and a workout exists', async ({ page }) => {
      await expect(page.getByText('pull-ups by playwright with date 11').first()).toBeVisible();
    });
  });
})

