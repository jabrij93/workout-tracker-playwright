const loginWith = async (page, username, password)  => {
    await page.goto('http://localhost:5173')
    await page.getByTestId('username').fill(username)
    await page.getByTestId('password').fill(password)
    await page.getByRole('button', { name: 'Login', exact: true }).click()
}

const createWorkout = async (page, workout) => {
  await page
    .locator('div.header-two') // Parent container
    .locator('div.header')     // Child container
    .getByRole('button', { name: 'NEW +', exact: true })
    .click();
  await page.getByTestId('workout').fill(workout)
  await page.getByRole('button', { name: 'Add Workout' }).click()
  await page.getByTestId('workout-card', { hasText: workout }).waitFor();
}
  
export { loginWith, createWorkout };