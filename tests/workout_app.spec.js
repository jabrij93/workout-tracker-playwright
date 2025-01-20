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

  describe.only('when logged in', () => {
    beforeEach(async ({ page }) => {
      await page.goto('http://localhost:5173');
      await page.getByTestId('username').first().fill('mluukkai');
      await page.getByTestId('password').last().fill('salainen');
      await page.getByRole('button', { name: 'Login', exact: true }).click();
      await expect(page.getByText('Matti Luukkainen')).toBeVisible();

      await page.getByRole('button', { name: 'NEW +', exact: true }).nth(1).click();
      await page.getByTestId('workout').fill('pull-ups by playwright with date 14');

      // Wait for the date input to be visible and click it
      console.log('Waiting for date input to be visible...');
      const dateInput = page.getByTestId('date');
      await dateInput.waitFor({ state: 'visible', timeout: 10000 }); // Wait for the input to be visible
      console.log('Date input is visible. Clicking it...');
      await dateInput.click();

      // Navigate to the desired month (January 2025)
      const currentMonthYear = await page.locator('.react-datepicker__current-month').innerText();
      const [currentMonth, currentYear] = currentMonthYear.split(' ');

      const targetMonth = 'January';
      const targetYear = '2025';
      let clicksNeeded = 0;

      if (currentYear < targetYear || (currentYear === targetYear && currentMonth !== targetMonth)) {
        const months = [
          'January', 'February', 'March', 'April', 'May', 'June',
          'July', 'August', 'September', 'October', 'November', 'December'
        ];
        const currentMonthIndex = months.indexOf(currentMonth);
        const targetMonthIndex = months.indexOf(targetMonth);
        clicksNeeded = (targetYear - currentYear) * 12 + (targetMonthIndex - currentMonthIndex);
      }

      for (let i = 0; i < clicksNeeded; i++) {
        await page.locator('.react-datepicker__navigation--next').click();
      }

      // Select the 19th day of January 2025
      await page.locator('.react-datepicker__day--019').click();

      // Wait for the network request to complete after clicking "Add Workout"
      await Promise.all([
        page.waitForResponse(response => {
          console.log('Response received:', response.url(), response.status());
          return response.url().includes('/api/workouts') && response.status() === 200;
        }, { timeout: 10000 }), // Increase timeout to 10 seconds
        page.getByRole('button', { name: 'Add Workout' }).click(),
      ]);
    }, 30000); // Increase timeout for the hook

    test('and a workout exists', async ({ page }) => {
      await expect(page.getByText('pull-ups by playwright with date 14').first()).toBeVisible();
    });
  });
});