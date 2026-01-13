import { getTaskList } from "./src/modules/getTaskList.js";

const trainingList = await getTaskList("2026-01-01", "2026-01-13", "Тренировка", true, "descending");
console.log(trainingList);
