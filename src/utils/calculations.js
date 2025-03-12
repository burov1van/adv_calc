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
  // Проверяем заполненность обязательных полей
  if (
    !businessParams.businessSphere ||
    !businessParams.region ||
    !businessParams.assortment ||
    !businessParams.months
  ) {
    return null;
  }

  // Получаем коэффициенты из данных (заменяем запятые на точки)
  const regionCoeff = parseFloat(regions[businessParams.region].replace(",", "."));
  const assortmentCoeff = parseFloat(assortment[businessParams.assortment].replace(",", "."));
  const monthsCoeff = parseFloat(months[businessParams.months].replace(",", "."));

  // Перебираем выбранные опции задач.
  // Для расчёта бюджета складываем коэффициенты, кроме опции "Пакет Напарник" (которая должна влиять только на цену лида).
  // Если выбрана опция "Пакет Напарник" в категории "Привлечь лиды", устанавливаем множитель для цены лида равным 2.
  let tasksCoeffForBudget = 0;
  let leadMultiplier = 1;
  const services = [];

  for (const taskName in selectedTaskOptions) {
    selectedTaskOptions[taskName].forEach((opt) => {
      if (taskName === "Привлечь лиды" && opt.optionName === "Пакет Напарник") {
        // Эта опция не добавляется в общий коэффициент для бюджета,
        // но удваивает цену лида.
        leadMultiplier *= 2;
      } else {
        tasksCoeffForBudget += opt.cost;
      }
      services.push(opt.optionName);
    });
  }

  // Определяем выбранную сферу или направление:
  const selectedName =
    !businessParams.businessDirection || businessParams.businessDirection === "-"
      ? businessParams.businessSphere
      : businessParams.businessDirection;

  // Находим соответствующий бизнес-объект по имени
  const businessObj = getBusinessObjectByName(selectedName, businesses);
  if (!businessObj) return null;

   // === Расчёт бюджета ===
  // cost[1] – базовый бюджет на 1000 кликов при «средних» условиях
  const budgetOn1000 = parseFloat(businessObj.cost[1]);
  let budget = budgetOn1000 * regionCoeff * assortmentCoeff * tasksCoeffForBudget * monthsCoeff;
  let budgetRub = Math.floor(budget);

  // Если опция "Пакет Напарник" выбрана в "Привлечь лиды", минимальный бюджет должен быть не ниже 64 000 ₽,
  // иначе – минимальный бюджет не ниже 26 000 ₽.
  let minBudget = 26000;
  if (selectedTaskOptions["Привлечь лиды"]) {
    const hasNaparnik = selectedTaskOptions["Привлечь лиды"].some(
      (opt) => opt.optionName === "Пакет Напарник"
    );
    if (hasNaparnik) {
      minBudget = 64000;
    }
  }
  if (budgetRub < minBudget) {
    budgetRub = minBudget;
  }

  // Ограничения бюджета (max cap) для разных регионов
  const budgetCaps = {
    "Москва": 450000,
    "Малые города": 200000,
    "Крупные города": 300000,
    "Города-миллионники": 400000,
    "Вся Россия": 550000,
  };

  if (budgetRub > budgetCaps[businessParams.region]) {
    budgetRub = budgetCaps[businessParams.region];
  }

  // === Цена клика ===
  // cost[0] — базовый CPC при «средних» условиях
  const baseCpc = parseFloat(businessObj.cost[0]);
  const clickPriceNum = baseCpc * regionCoeff * monthsCoeff;
  const clickPriceStr = "От ₽" + clickPriceNum.toFixed(2);

  // === Цена лида ===
  // cost[3] — базовая цена лида (CPL)
  const baseCpl = parseFloat(businessObj.cost[3]);
  const leadPriceNum = baseCpl * regionCoeff * monthsCoeff * leadMultiplier;
  const leadPriceStr = "От ₽" + Math.floor(leadPriceNum);

  return {
    budget: `От ₽${budgetRub} в месяц`,
    clickPrice: clickPriceStr,
    leadPrice: leadPriceStr,
    services,
  };
}
