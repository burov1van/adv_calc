// src/components/Result.jsx
import React from 'react';
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

  // Парсим строки вида "От ₽62.40" в число с плавающей точкой, чтобы считать клики/лиды
  const parsePrice = (str) => {
    const cleaned = str.replace(/[^\d.]/g, "");
    return parseFloat(cleaned) || 0;
  };

  const budgetNum = parsePrice(result.budget);
  const clickNum = parsePrice(result.clickPrice);
  const leadNum = parsePrice(result.leadPrice);

  // Кол-во кликов/лидов
  const possibleClicks = (clickNum > 0 && budgetNum > 0)
    ? Math.floor(budgetNum / clickNum)
    : 0;
  const possibleLeads = (leadNum > 0 && budgetNum > 0)
    ? Math.floor(budgetNum / leadNum)
    : 0;

  // Формируем таблицы под задачи и под услуги
  // 1) Таблица с выбранными задачами/опциями
  const tasksTable = selectedTasks.length === 0 ? null : (
    <table className="result-table tasks-table">
      <thead>
        <tr>
          <th style={{ width: '30%' }}>Задача</th>
          <th>Выбранные опции</th>
        </tr>
      </thead>
      <tbody>
        {selectedTasks.map((taskName) => {
          const options = selectedTaskOptions[taskName];
          return (
            <tr key={taskName}>
              <td><strong>{taskName}</strong></td>
              <td>
                {options && options.length > 0 ? (
                  <ul style={{ margin: 0, paddingLeft: '20px' }}>
                    {options.map((opt, idx) => (
                      <li key={idx}>{opt.optionName}</li>
                    ))}
                  </ul>
                ) : (
                  <em style={{ color: '#888' }}>Нет выбранных опций</em>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );

  // 2) Таблица с «услугами», которые записаны в result.services
  const servicesTable = result.services && result.services.length > 0 ? (
    <table className="result-table services-table">
      <thead>
        <tr>
          <th>Услуги</th>
        </tr>
      </thead>
      <tbody>
        {result.services.map((service, index) => (
          <tr key={index}>
            <td>{service}</td>
          </tr>
        ))}
      </tbody>
    </table>
  ) : null;

  return (
    <div className="result-container">
      <h2 className="result-title">Результаты расчёта</h2>

      {/* Таблица с основными параметрами */}
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

      {/* Блок результатов чисел: бюджет, клик, лид */}
      <div className="result-values">
        <p>
          <strong>Рекламный бюджет (примерный):</strong>{' '}
          <span>{result.budget}</span>
        </p>
        <p>
          <strong>Цена клика:</strong>{' '}
          <span>{result.clickPrice}</span>
        </p>
        <p>
          <strong>Цена лида:</strong>{' '}
          <span>{result.leadPrice}</span>
        </p>
        <p>
          <strong>Прогноз кликов:</strong> {possibleClicks}
        </p>
        <p>
          <strong>Прогноз лидов:</strong> {possibleLeads}
        </p>
      </div>

      {/* Таблица с выбранными задачами (если есть) */}
      {selectedTasks.length > 0 && (
        <div className="tasks-section">
          <h3>Выбранные задачи:</h3>
          {tasksTable}
        </div>
      )}

      {/* Таблица с услугами (если есть) */}
      {servicesTable && (
        <div className="services-section">
          <h3>Услуги:</h3>
          {servicesTable}
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
