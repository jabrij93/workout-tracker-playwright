const loginWith = async (page, username, password)  => {
    await page.goto('http://localhost:5173')
    await page.getByTestId('username').fill(username)
    await page.getByTestId('password').fill(password)
    await page.getByRole('button', { name: 'Login', exact: true }).click()
}

const createWorkout = async (page, content) => {
    await page.getByRole('button', { name: 'NEW +', exact: true }).nth(1).click();
    await page.getByTestId('workout').fill(content);
    await page.getByRole('button', { name: 'Add Workout' }).click()
}
  
export { loginWith, createWorkout }