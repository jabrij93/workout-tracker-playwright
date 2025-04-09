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

    await page.goto('')
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
    })

    test('a new workout can be created', async ({ page }) => {
      await createWorkout(page, 'a workout created by playwright', '02-03-2025', 'testt')
      await expect(
        page.getByTestId('workout-card-a workout created by playwright')
        .locator('.main-workout'))
        .toHaveText('a workout created by playwright, 02-03-2025');
    })

    describe('and a workout exists', () => {
      beforeEach(async ({ page }) => {
        await createWorkout(page, 'first workout', '01-03-2025', 'pull-ups')
        await createWorkout(page, 'second workout', '02-03-2025', 'dips')
        await createWorkout(page, 'third workout', '03-03-2025', 'squats')
      })
  
      test('workout exist', async ({ page }) => {
        await page.pause()
        const card = page.getByTestId('workout-card-third workout')
        await expect(card).toBeVisible()
      })

      test('workout can be expand to see details', async ({ page }) => {
        const card = page.getByTestId('workout-card-second workout');
      
        // Click the "See more" button inside the card
        await card.getByRole('button', { name: 'See more' }).click();
      
        // Assert that the details and likes are now visible
        await expect(card.getByText('Detail : dips')).toBeVisible();
      });
      

      // test('see more button can be clicked', async ({ page }) => {
      //   const workoutList = await page.locator('div.title', { hasText: 'second workout' });

      //   // Within that blog container, find and click the "show" button
      //   const showButton = workoutList.getByRole('button', { name: 'See more' });
      //   await showButton.click();

      //   await expect(page.getByText('Detail : dips')).toBeVisible();
      // })
    })
  });
});