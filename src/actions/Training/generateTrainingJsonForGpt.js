import { getPageData, getTableData } from "../../modules/getPageData.js";
import { getTaskList } from "../../modules/getTaskList.js";

export const generateTrainingJsonForGpt = async () => {
  // Тестирование функции получения списка задач
  const trainingList = await getTaskList("2025-11-04", "2026-01-13", "Тренировка", true, "descending");

  // Создаем массив промисов для каждой тренировки
  const promises = trainingList.results.map(async (training) => {
    const date = training.properties["Дата"].date.start;
    const name = training.properties["Name"].title[0].plain_text;
    // Тестирование функции получения данных страницы
    const pageData = await getPageData(training.url.split("/").pop());
    const tableBlock = pageData.results[0];

    // Получаем и парсим таблицу
    if (tableBlock && tableBlock.type === "table" && tableBlock.has_children) {
      const table = await getTableData(tableBlock.id, date, name);
      return table;
    }
    return [];
  });

  // Ждем завершения всех промисов и собираем результаты
  const results = await Promise.all(promises);
  const workOuts = results.flat();
  return workOuts;
}