const { test, expect, describe, beforeEach } = require('@playwright/test')
const { loginWith, createWorkout } = require('./helper')

describe('Workout Tracker app', () => {
  beforeEach(async ({ page, request }) => {

    await request.post('/api/testing/reset')

    await request.post('/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    });

    await request.post('/api/users', {
      data: {
        name: 'Superuser',
        username: 'root',
        password: 'salainen'
      }
    });

    await page.goto('/')
  })

  test('front page can be opened', async ({ page }) => {
    await page.goto('/')
  
    const locator = await page.getByText('Let\'s do this')
    await expect(locator).toBeVisible()
    await expect(page.getByText('This is not a real online service! You know you need something like this in your life to help you realize your deepest dreams.')).toBeVisible()
  })

  test('user can login', async ({ page }) => {
    await loginWith(page, 'mluukkai', 'salainen')
    await expect(page.getByText('Matti Luukkainen')).toBeVisible()
  })

  test('login fails with wrong password', async ({ page }) => {
    await loginWith(page, 'mluukkai', 'salainen2')
    await expect(page.getByText('Username or password is incorrect')).toBeVisible()
  })

  describe('when logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')
      await expect(page.getByText('Matti Luukkainen')).toBeVisible();
      await createWorkout(page, 'pull-ups without date 2')
      await createWorkout(page, 'pull-ups with date', 'January 2025 19');
    })

    test('add workout without date', async ({ page }) => {
      await createWorkout(page, 'pull-ups without date')
    });

    test('workout without date exists', async ({ page }) => {
      await expect(page.getByText('pull-ups without date 2').first()).toBeVisible();
    });

    test.only('workout with date exists', async ({ page }) => {
      await expect(page.getByText('pull-ups with date').first()).toBeVisible();
    });

    test('and a workout exists', async ({ page }) => {
      await expect(page.getByText('pull-ups by playwright with date 14').first()).toBeVisible();
    });

    test('workout details can be displayed more', async ({ page }) => {
      await page.getByRole('button', { name: 'show details', exact: true }).nth(0).click();
    });
  });
});