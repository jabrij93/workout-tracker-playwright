const loginWith = async (page, username, password)  => {
    await page.goto('http://localhost:5173')
    await page.getByTestId('username').fill(username)
    await page.getByTestId('password').fill(password)
    await page.getByRole('button', { name: 'Login', exact: true }).click()
}

const monthToNumber = {
  January: 1, February: 2, March: 3, April: 4,
  May: 5, June: 6, July: 7, August: 8,
  September: 9, October: 10, November: 11, December: 12
};

const formatMonth = (monthStr) => monthToNumber[monthStr]; 

const createWorkout = async (page, workout, date) => {
  // Open the form by clicking "NEW +"
  const newButton = page.locator('div.header').getByRole('button', { name: 'NEW +', exact: true });
  await newButton.click();

  // Fill in workout details
  await page.getByTestId('workout').fill(workout);

  // Extract date components
  const [day, month, year] = date.split('-');
  
  // Open the date picker
  await page.click('div.react-datepicker__input-container');

  while (true) {
    const currentText = await page.locator('h2.react-datepicker__current-month').textContent();
    const [currentMonthStr, currentYear] = currentText.split(' ');
  
    const currentMonth = monthToNumber[currentMonthStr]; // Convert to number
    const targetMonth = parseInt(month); // Convert to number
  
    if (parseInt(currentYear) === parseInt(year) && currentMonth === targetMonth) {
      break; // Stop when the correct month and year are reached
    }
  
    if (parseInt(currentYear) > parseInt(year) || 
        (parseInt(currentYear) === parseInt(year) && targetMonth < currentMonth)) {
      // Move backward if the target month is earlier
      await page.click('button[aria-label="Previous Month"]');
    } else {
      // Move forward if the target month is later
      await page.click('button[aria-label="Next Month"]');
    }
  }  

  // Select the correct day
  await page.click(`.react-datepicker__day--0${day}`);
  console.log('YearMonthDay:', year, month, day);

  // Submit the form
  await page.getByRole('button', { name: 'Add Workout' }).click();

  // Wait for confirmation that the workout was added
  await page.getByText(workout).waitFor();
};

// const createWorkout = async (page, workout, date) => {
//   await page
//     .locator('div.dashboard-header')
//     .getByRole('button', { name: '✖', exact: true })
//     .click();
//   await page
//     .locator('div.first-header') 
//     .getByRole('button', { name: 'NEW +', exact: true })
//     .click();
//   await page.getByTestId('workout').fill(workout)
//   // Extract year, month, day from date
//   const [day, month, year] = date.split('-');
  
//   await page.click('div.react-datepicker__input-container') // Open the calendar

//   while (true) {
//     const currentText = await page.locator('h2.react-datepicker__current-month').textContent()
//     const [currentMonth, currentYear] = currentText.split(' ');

//     if (parseInt(currentYear) === parseInt(year) && currentMonth === formatMonth(month)) {
//       break;
//     }

//     await page.click('button[aria-label="Next Month"]');
//   }
//    // Select the correct day
//    await page.click(`.react-datepicker__day--0${day}`);
//    console.log('YearMonthDay:', year, month, day)

//   // Select the date using the date picker
//   // const datePicker = await page.locator('input.react-datepicker-ignore-onclickoutside') 
//   // await datePicker.fill(date) // Format: "YYYY-MM-DD"

//   await page.getByRole('button', { name: 'Add Workout' }).click()
//   await page.getByText(workout).waitFor()
// }
  
export { loginWith, createWorkout };