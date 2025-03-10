import React from 'react';
import './Result.css';

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

  // Парсим строки вида "От ₽62.40" в число, чтобы вычислить клики/лиды
  const parsePrice = (str) => {
    const cleaned = str.replace(/[^\d.]/g, "");
    return parseFloat(cleaned) || 0;
  };

  const budgetNum = parsePrice(result.budget);
  const clickNum = parsePrice(result.clickPrice);
  const leadNum = parsePrice(result.leadPrice);

  // Количество кликов/лидов
  const possibleClicks = (clickNum > 0 && budgetNum > 0)
    ? Math.floor(budgetNum / clickNum)
    : 0;
  const possibleLeads = (leadNum > 0 && budgetNum > 0)
    ? Math.floor(budgetNum / leadNum)
    : 0;

  return (
    <div className="result-container">
      {/* Заголовок: Калькулятор по центру */}
      <h2 className="result-title">Калькулятор рекламного бюджета</h2>

      {/* Карточка с основными параметрами */}
      <div className="card">
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
      </div>

      {/* Карточка с результатами: бюджет, клик, лид и т.д. */}
      <div className="card result-values">
        <div className="values-grid">
          <div className="value-item">
            <span className="value-label">Рекламный бюджет (примерный):</span>
            <span className="value-text">{result.budget}</span>
          </div>
          <div className="value-item">
            <span className="value-label">Цена клика:</span>
            <span className="value-text">{result.clickPrice}</span>
          </div>
          <div className="value-item">
            <span className="value-label">Цена лида:</span>
            <span className="value-text">{result.leadPrice}</span>
          </div>
          <div className="value-item">
            <span className="value-label">Прогноз кликов:</span>
            <span className="value-text">{possibleClicks}</span>
          </div>
          <div className="value-item">
            <span className="value-label">Прогноз лидов:</span>
            <span className="value-text">{possibleLeads}</span>
          </div>
        </div>
      </div>

      {/* Единый блок: задачи и услуги */}
      {(selectedTasks.length > 0 || (result.services && result.services.length > 0)) && (
        <div className="card tasks-services-section">
          <h3>Выбранные задачи и услуги</h3>
          <table className="result-table tasks-services-table">
            <thead>
              <tr>
                <th>Задачи и опции</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                {/* Одна колонка: задачи и опции */}
                <td>
                  {selectedTasks.length > 0 ? (
                    <ul>
                      {selectedTasks.map((taskName) => {
                        const options = selectedTaskOptions[taskName];
                        return (
                          <li key={taskName} style={{ marginBottom: '8px' }}>
                            <strong>{taskName}</strong>
                            {options && options.length > 0 && (
                              <ul style={{ marginTop: '4px', marginLeft: '20px' }}>
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

      {/* Кнопки */}
      <div className="result-buttons">
        <button onClick={onBack}>Назад</button>
        <button onClick={onHome}>На главную</button>
      </div>
    </div>
  );
};

export default Result;
