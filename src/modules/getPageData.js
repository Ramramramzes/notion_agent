import { axios, HEADERS_WITH_SECRET } from "../baseImport.js";
import { gptFormatting, trainingFormatting } from "../common/trainingFormatting.js";

/**
 * Получает содержимое страницы (блоки) из Notion
 * @param {string} pageId - ID страницы
 * @returns {Promise<Object>} Содержимое страницы (блоки)
 */
export async function getPageData(pageId) {
  try {
    const res = await axios.get(
      `https://api.notion.com/v1/blocks/${pageId}/children`,
      HEADERS_WITH_SECRET
    );
    return res.data;
  } catch (err) {
    console.error("Error getting page content:", err.response?.data || err.message);
  }
}

/**
 * Получает дочерние блоки блока (например, строки таблицы)
 * @param {string} blockId - ID блока
 * @returns {Promise<Object>} Дочерние блоки
 */
export async function getBlockChildren(blockId) {
  try {
    const res = await axios.get(
      `https://api.notion.com/v1/blocks/${blockId}/children`,
      HEADERS_WITH_SECRET
    );
    return res.data;
  } catch (err) {
    console.error("Error getting block children:", err.response?.data || err.message);
  }
}


/**
 * Получает и парсит таблицу из Notion
 * @param {string} tableBlockId - ID блока таблицы
 * @returns {Promise<Array<Array<string>>>} Распарсенная таблица
 */
export async function getTableData(tableBlockId, date, name) {
  try {
    const tableContent = await getBlockChildren(tableBlockId);
    const tableRows = tableContent.results;
    return gptFormatting(trainingFormatting(tableRows), date, name);
  } catch (err) {
    console.error("Error getting table data:", err.response?.data || err.message);
  }
}

/**
 * Получает метаданные страницы из Notion
 * @param {string} pageId - ID страницы
 * @returns {Promise<Object>} Метаданные страницы
 */
export async function getPageMetadata(pageId) {
  try {
    const res = await axios.get(
      `https://api.notion.com/v1/pages/${pageId}`,
      HEADERS_WITH_SECRET
    );
    return res.data;
  } catch (err) {
    console.error("Error getting page metadata:", err.response?.data || err.message);
  }
}