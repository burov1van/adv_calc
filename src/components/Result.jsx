// src/components/Result.jsx
import React, { useState } from 'react';
import './Result.css'; // Подключаем стили

const Result = ({
  result,
  businessParams,
  selectedTasks,
  selectedTaskOptions,
  onBack,
  onHome
}) => {
  if (!result) return null;

  const {
    businessSphere,
    businessDirection,
    region,
    assortment,
    months
  } = businessParams;

  // --- Функция для извлечения числа из строки вида "От ₽627900..."
  const parsePrice = (str) => {
    const cleaned = str.replace(/[^\d.]/g, "");
    return parseFloat(cleaned) || 0;
  };

  // --- Функция для форматирования числа с разделением тысяч пробелами
  const formatNumber = (num) => {
    if (!num && num !== 0) return '';
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };

  // Исходные числовые значения из результата
  const originalBudget = parsePrice(result.budget);
  const clickPriceNumber = parsePrice(result.clickPrice);
  const leadPriceNumber = parsePrice(result.leadPrice);

  // Локальное состояние для изменяемого бюджета через бегунок
  const [adjustedBudget, setAdjustedBudget] = useState(originalBudget);

  // Пересчёт прогнозируемых кликов и лидов по новому бюджету
  const predictedClicks =
    clickPriceNumber > 0 ? Math.floor(adjustedBudget / clickPriceNumber) : 0;
  const predictedLeads =
    leadPriceNumber > 0 ? Math.floor(adjustedBudget / leadPriceNumber) : 0;

  // Обработчик изменения бегунка
  const handleSliderChange = (e) => {
    setAdjustedBudget(Number(e.target.value));
  };

  return (
    <div className="result-container">
      <h2 className="result-title">Калькулятор рекламного бюджета</h2>

      {/* Таблица с выбранными параметрами */}
      <table className="result-table">
        <thead>
          <tr>
            <th>Параметр</th>
            <th>Выбранное значение</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Сфера бизнеса</td>
            <td>{businessSphere || '—'}</td>
          </tr>
          <tr>
            <td>Направление</td>
            <td>{businessDirection && businessDirection !== '-' ? businessDirection : '—'}</td>
          </tr>
          <tr>
            <td>Регион</td>
            <td>{region || '—'}</td>
          </tr>
          <tr>
            <td>Ассортимент</td>
            <td>{assortment || '—'}</td>
          </tr>
          <tr>
            <td>Срок</td>
            <td>{months || '—'}</td>
          </tr>
        </tbody>
      </table>

      {/* Карточка с основными результатами */}
      <div className="card result-values">
        <div className="values-grid">
          <div className="value-item">
            <span className="value-label">Рекламный бюджет (примерный):</span>
            <span className="value-text">
              От ₽{formatNumber(adjustedBudget)} в месяц
            </span>
          </div>
          <div className="value-item">
            <span className="value-label">Цена клика:</span>
            <span className="value-text">
              {/* Т.к. в result.clickPrice у нас строка вида "От ₽6279...", 
                  то для красоты можно тоже подставить отформатированное число, 
                  но нужно вырезать из неё чисто число и снова завернуть в ₽. */}
              От ₽{formatNumber(clickPriceNumber)}
            </span>
          </div>
          <div className="value-item">
            <span className="value-label">Цена лида:</span>
            <span className="value-text">От ₽{formatNumber(leadPriceNumber)}</span>
          </div>
          <div className="value-item">
            <span className="value-label">Прогноз кликов:</span>
            <span className="value-text">{formatNumber(predictedClicks)}</span>
          </div>
          <div className="value-item">
            <span className="value-label">Прогноз лидов:</span>
            <span className="value-text">{formatNumber(predictedLeads)}</span>
          </div>
        </div>
      </div>

      {/* Бегунок для регулировки бюджета */}
      <div className="slider-container card">
        <label htmlFor="budgetSlider">
          <strong>Настройте объем бюджета:</strong>
        </label>
        <input
          type="range"
          id="budgetSlider"
          min="26000"
          max={originalBudget}
          value={adjustedBudget}
          onChange={handleSliderChange}
        />
        <div className="slider-labels">
          <span>{formatNumber(26000)} ₽</span>
          <span>{formatNumber(originalBudget)} ₽</span>
        </div>
      </div>

      {/* Блок с выбранными задачами и опциями */}
      {(selectedTasks.length > 0 || (result.services && result.services.length > 0)) && (
        <div className="card tasks-services-section">
          <h3>Выбранные задачи и опции</h3>
          <table className="result-table tasks-services-table">
            <thead>
              <tr>
                <th>Задачи и опции</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  {selectedTasks.length > 0 ? (
                    <ul>
                      {selectedTasks.map((taskName) => {
                        const options = selectedTaskOptions[taskName];
                        return (
                          <li key={taskName} className="task-item">
                            <strong>{taskName}</strong>
                            {options && options.length > 0 && (
                              <ul className="options-list">
                                {options.map((opt, idx) => (
                                  <li key={idx}>{opt.optionName}</li>
                                ))}
                              </ul>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <em className="no-options">Задачи не выбраны</em>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Кнопки навигации */}
      <div className="result-buttons">
        <button onClick={onBack}>Назад</button>
        <button onClick={onHome}>На главную</button>
      </div>
    </div>
  );
};

export default Result;
