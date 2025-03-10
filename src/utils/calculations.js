// src/utils/calculations.js

import { getBusinessObjectByName } from "./helpers";

export function calculateBudget(
  businessParams,
  selectedTaskOptions,
  tasks,
  businesses,
  months,
  assortment,
  regions
) {
  // Проверяем заполненность
  if (
    !businessParams.businessSphere ||
    !businessParams.region ||
    !businessParams.assortment ||
    !businessParams.months
  ) {
    return null;
  }

  // Коэффициенты
  const regionCoeff = parseFloat(regions[businessParams.region].replace(",", "."));
  const assortmentCoeff = parseFloat(assortment[businessParams.assortment].replace(",", "."));
  const monthsCoeff = parseFloat(months[businessParams.months].replace(",", "."));

  // Сумма коэффициентов выбранных опций задач
  let tasksCoeff = 0;
  const services = [];

  for (const taskName in selectedTaskOptions) {
    selectedTaskOptions[taskName].forEach((opt) => {
      tasksCoeff += opt.cost; 
      services.push(opt.optionName); 
    });
  }

  // Определяем сферу/направление
  const selectedName =
    !businessParams.businessDirection || businessParams.businessDirection === "-"
      ? businessParams.businessSphere
      : businessParams.businessDirection;

  const businessObj = getBusinessObjectByName(selectedName, businesses);
  if (!businessObj) return null;

  // 1) Бюджет
  const budgetOn1000 = parseFloat(businessObj.cost[1]);
  let budget = budgetOn1000 * regionCoeff * assortmentCoeff * tasksCoeff * monthsCoeff;
  let budgetRub = Math.floor(budget);

  // Ограничение сверху (max cap)
  if (businessParams.region === "Москва" && budgetRub > 300000) {
    budgetRub = 300000;
  } else if (
    (businessParams.region === "Малые города" || businessParams.region === "Крупные города") &&
    budgetRub > 200000
  ) {
    budgetRub = 200000;
  } else if (businessParams.region === "Вся Россия" && budgetRub > 450000) {
    budgetRub = 450000;
  }

  // Новое требование: если после всех расчётов < 26000 → ставим 26000
  if (budgetRub < 26000) {
    budgetRub = 26000;
  }

  // 2) Цена клика
  const baseCpc = parseFloat(businessObj.cost[0]);
  const clickPriceNum = baseCpc * regionCoeff * monthsCoeff;
  const clickPriceStr = "От ₽" + clickPriceNum.toFixed(2);

  // 3) Цена лида
  const baseCpl = parseFloat(businessObj.cost[3]);
  const leadPriceNum = baseCpl * regionCoeff * monthsCoeff;
  const leadPriceStr = "От ₽" + Math.floor(leadPriceNum);

  return {
    budget: `От ₽${budgetRub} в месяц`,
    clickPrice: clickPriceStr,
    leadPrice: leadPriceStr,
    services,
  };
}
