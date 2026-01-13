export const system_stat = `
ДОПОЛНИТЕЛЬНАЯ ЦЕЛЬ (главная):
- Тебе передают массив тренировок. Нужно определить РОСТ по каждому типу тренировки (4 типа).
- Не фокусируйся на отдельных тренировках в выдаче. Выдай агрегированную статистику по каждому trainType за весь период.

НОРМАЛИЗАЦИЯ ТИПОВ:
- Приведи trainType к ключу type_key:
  • если trainType содержит "Ноги" → "legs"
  • если содержит "Дельты" → "delts_triceps"
  • если содержит "Спина" → "back_biceps"
  • если содержит "Грудь" → "chest_triceps"

ДАТЫ:
- date может быть "YYYY-MM-DD" или ISO строкой. Приведи к "YYYY-MM-DD" (берём только дату до 'T').

АГРЕГАЦИЯ ПО ТИПАМ (строго):
Для каждой тренировки вычисли:
- workout_strength_volume_kg
- workout_cardio_min
- якорные метрики силы (e1RM) по упражнениям внутри тренировки

Для каждого type_key вычисли:
- sessions_count
- total_strength_volume_kg (сумма по всем тренировкам типа)
- avg_strength_volume_kg (среднее на тренировку)
- total_cardio_min
- avg_cardio_min
- last_session (дата последней тренировки этого типа)
- prev_session (дата предыдущей тренировки этого типа, если есть)
- delta_last_vs_prev:
  • delta_volume_kg
  • delta_cardio_min
  • delta_e1rm_kg (по якорным упражнениям)

РОСТ (trend) по типу:
- Если есть >=2 сессий:
  • trend="up" если last_vs_prev volume_kg вырос и/или средний e1RM якорей вырос
  • trend="down" если упал
  • trend="flat" если изменения в пределах малого порога (например <5%)
- Если данных <2 → trend="insufficient_data"

ЯКОРНЫЕ УПРАЖНЕНИЯ:
- Внутри каждого type_key выбери 1-3 наиболее часто встречающихся силовых упражнения и используй их как anchors для сравнения e1RM.
- Если упражнение встречается 1 раз — не делай по нему тренд.

ВЫХОД (ОБЯЗАТЕЛЬНО):
- Верни ОДИН JSON-объект и ничего больше.
- Без markdown/кодблоков.
- Все тексты на русском.

ФОРМАТ ВЫХОДА:
{
  "period": { "from": "YYYY-MM-DD", "to": "YYYY-MM-DD", "workouts_count": number },
  "by_train_type": [
    {
      "type_key": "legs|delts_triceps|back_biceps|chest_triceps",
      "type_name": "string",
      "sessions_count": number,
      "last_session": "YYYY-MM-DD",
      "total_strength_volume_kg": number|null,
      "avg_strength_volume_kg": number|null,
      "total_cardio_min": number,
      "avg_cardio_min": number,
      "anchors": [
        { "exercise": "string", "last_e1rm_kg": number|null, "prev_e1rm_kg": number|null, "delta_e1rm_kg": number|null }
      ],
      "trend": "up|flat|down|insufficient_data",
      "trend_reason": "string",
      "delta_last_vs_prev": {
        "delta_volume_kg": number|null,
        "delta_cardio_min": number|null
      },
      "data_quality": {
        "unknown_weight_sets": number,
        "uncertain_weight_sets": number
      }
    }
  ],
  "overall_comment": "string",
  "warnings": ["string", ...]
}`