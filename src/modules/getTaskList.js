import { axios, HEADERS_WITH_SECRET, TASK_DATABASE_ID } from "../baseImport.js";

/**
 * Получает список задач из базы данных Notion
 * @param {string} databaseId - ID базы данных
 * @param {string} dateFrom - Дата начала (YYYY-MM-DD)
 * @param {string} dateTo - Дата конца (YYYY-MM-DD)
 * @param {string} name - Название задачи
 * @param {boolean} done - Готово ли задание
 * @param {string} filterDirection - Направление фильтрации (descending или ascending)
 * @returns {Promise<Object>} Список задач
 */

export async function getTaskList(dateFrom, dateTo, name, done = true, filterDirection = "descending") {
  try {
    const res = await axios.post(
      `https://api.notion.com/v1/databases/${TASK_DATABASE_ID}/query`,
      {
        "filter": {
          "and": [
            { "property": "Дата", "date": { "on_or_before": dateTo } },
            { "property": "Дата", "date": { "on_or_after": dateFrom } },
            { "property": "Name", "title": { "contains": name } },
            { "property": "Готово", "checkbox": { "equals": done } }
          ]
        },
        "sorts": [
          { "property": "Дата", "direction": filterDirection }
        ]
      },
      HEADERS_WITH_SECRET
    );
    return res.data;
  } catch (err) {
    console.error("Error querying DB:", err.response?.data || err.message);
  }
}