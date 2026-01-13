export const trainingFormatting = (tableRows) => {
  const filteredArray = tableRows.filter(row => row.type === "table_row")
  .map(row => row.table_row.cells
    .map(cell => cell
      .map(rich => rich.plain_text).join("")));
  return filteredArray;
}

export const gptFormatting = (arr, date, name) => {
  let workOuts = [{
    date: date,
    trainType: name,
    exercises: [],
  }];
  for (let i = 1; i < arr.length; i++) {
    let exercise = {
      weight: {values: arr[i][0], unit: arr[i][0].toLowerCase().includes("lbs") ? "lbs" : "kg"},
      exercise: arr[i][1],
      set1: arr[i][2],
      set2: arr[i][3],
      set3: arr[i][4],
      set4: arr[i][5],
    }
    workOuts[0].exercises.push(exercise);
  }
  return workOuts;
}