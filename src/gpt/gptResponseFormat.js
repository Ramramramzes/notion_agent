export function gptResponseFormat(data) {
  const lines = [];

  const p = data.period;
  lines.push(
    `📊 Отчёт по прогрессу (по типам тренировок)`,
    `Период: ${p.from} — ${p.to}`,
    `Всего тренировок: ${p.workouts_count}`,
    ``
  );

  // сортировка типов в привычном порядке
  const order = ["legs", "back_biceps", "chest_triceps", "delts_triceps"];
  const types = [...(data.by_train_type ?? [])].sort((a, b) => {
    const ai = order.indexOf(a.type_key);
    const bi = order.indexOf(b.type_key);
    return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
  });

  for (const t of types) {
    const trendIcon = trendToIcon(t.trend);
    const vol = numOrNA(t.avg_strength_volume_kg, true);
    const cardio = numOrNA(t.avg_cardio_min, true);

    lines.push(
      `━━━━━━━━━━━━━━━`,
      `${trendIcon} ${t.type_name}`,
      `Сессий: ${t.sessions_count} | Последняя: ${t.last_session}`,
      `Средний тоннаж/тренировку: ${vol} кг`,
      `Среднее кардио/тренировку: ${cardio} мин`,
      ``
    );

    // Δ last vs prev
    if (t.delta_last_vs_prev) {
      const dv = numOrNA(t.delta_last_vs_prev.delta_volume_kg, true);
      const dc = numOrNA(t.delta_last_vs_prev.delta_cardio_min, true);
      lines.push(
        `Δ последняя vs предыдущая: тоннаж ${signed(dv)} кг, кардио ${signed(dc)} мин`
      );
    } else {
      lines.push(`Δ последняя vs предыдущая: нет данных`);
    }

    // anchors
    if (t.anchors?.length) {
      lines.push(`Якоря силы (e1RM):`);
      for (const a of t.anchors) {
        const last = numOrNA(a.last_e1rm_kg, true);
        const prev = numOrNA(a.prev_e1rm_kg, true);
        const de = a.delta_e1rm_kg == null ? "н/д" : signed(numOrNA(a.delta_e1rm_kg, true));
        lines.push(`• ${capitalize(a.exercise)}: ${last} → ${prev} (Δ ${de})`);
      }
    }

    // reason
    if (t.trend_reason) {
      lines.push(`Вывод: ${t.trend_reason}`);
    }

    // data quality
    if (t.data_quality) {
      const uq = t.data_quality.unknown_weight_sets ?? 0;
      const un = t.data_quality.uncertain_weight_sets ?? 0;
      if (uq || un) {
        lines.push(`Качество данных: неизвестный вес — ${uq}, неточный вес — ${un}`);
      }
    }

    lines.push(``);
  }

  if (data.overall_comment) {
    lines.push(`━━━━━━━━━━━━━━━`, `🧠 Общий вывод`, data.overall_comment, ``);
  }

  if (data.warnings?.length) {
    lines.push(`⚠️ Предупреждения:`, ...data.warnings.map(w => `- ${w}`));
  }

  return lines.join("\n");
}

function trendToIcon(trend) {
  switch (trend) {
    case "up": return "📈";
    case "down": return "📉";
    case "flat": return "➖";
    case "insufficient_data": return "❓";
    default: return "ℹ️";
  }
}

function numOrNA(n, round1 = false) {
  if (n === null || n === undefined || Number.isNaN(n)) return "н/д";
  const x = Number(n);
  return round1 ? Math.round(x * 10) / 10 : x;
}

function signed(x) {
  if (x === "н/д") return x;
  const n = Number(x);
  if (Number.isNaN(n)) return "н/д";
  return (n > 0 ? `+${n}` : `${n}`);
}

function capitalize(s) {
  const str = String(s ?? "").trim();
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}