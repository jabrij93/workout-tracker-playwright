const loginWith = async (page, username, password)  => {
    await page.goto('http://localhost:5173')
    await page.getByTestId('username').fill(username)
    await page.getByTestId('password').fill(password)
    await page.getByRole('button', { name: 'Login', exact: true }).click()
}

const createWorkout = async (page, workout, date = null) => {
    await page.getByRole('button', { name: 'NEW +', exact: true }).nth(1).click();
    await page.getByTestId('workout').fill(workout);
  
    if (date) {
      // Wait for the date input to be visible and click it
      console.log('Waiting for date input to be visible...');
      const dateInput = page.getByTestId('date');
      await dateInput.waitFor({ state: 'visible', timeout: 10000 }); // Wait for the input to be visible
      console.log('Date input is visible. Clicking it...');
      await dateInput.click();
  
      // Navigate to the desired month and year
      const [targetMonth, targetYear, targetDay] = date.split(' ');
      const currentMonthYear = await page.locator('.react-datepicker__current-month').innerText();
      const [currentMonth, currentYear] = currentMonthYear.split(' ');
  
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
  
      // Select the target day
      await page.locator(`.react-datepicker__day--0${targetDay}`).click();
    }
  
    // Wait for the network request to complete after clicking "Add Workout"
    const addWorkoutButton = page.getByRole('button', { name: 'Add Workout' });
    await Promise.all([
      page.waitForResponse((response) => {
        console.log('Response received:', response.url(), response.status());
        return response.url().includes('/api/workouts') && response.status() === 200;
      }, { timeout: 10000 }), // Increase timeout to 10 seconds
      addWorkoutButton.click(),
    ]);
  };
  
export { loginWith, createWorkout };