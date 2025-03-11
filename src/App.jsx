import React, { useState } from 'react';
import BusinessParams from './components/BusinessParams';
import TasksStep1 from './components/TasksStep1';
import TasksStep2 from './components/TasksStep2';
import Result from './components/Result';
import { calculateBudget } from './utils/calculations';
import { businesses, tasks, months, assortment, regions } from './data';

function App() {
  // Шаги: 1 – BusinessParams, 2 – TasksStep1, 3 – TasksStep2, 4 – Результат
  const [currentStep, setCurrentStep] = useState(1);

  // Параметры, введённые пользователем (шаг 1)
  const [businessParams, setBusinessParams] = useState({});

  // Список выбранных задач (шаг 2)
  const [selectedTasks, setSelectedTasks] = useState([]);

  // Выбранные опции для каждой задачи (шаг 3)
  // Формат: { [taskName]: [{ optionName, cost }, ...], ... }
  const [selectedTaskOptions, setSelectedTaskOptions] = useState({});

  // Результат расчёта (бюджет, цена клика, цена лида, и т.д.)
  const [result, setResult] = useState(null);

  // Переход от шага 1 к шагу 2
  const handleNextFromBusinessParams = (params) => {
    setBusinessParams(params);
    setCurrentStep(2);
  };

  // Переход от шага 2 к шагу 3
  const handleNextFromTasksStep1 = (tasks) => {
    setSelectedTasks(tasks);
    setCurrentStep(3);
  };

  // Функция возврата с шага 2 (TasksStep1) на шаг 1 (BusinessParams)
  const handleBackFromTasksStep1 = () => {
    setCurrentStep(1);
  };

  // Функция возврата с шага 3 (TasksStep2) на шаг 2 (TasksStep1)
  const handleBackFromTasksStep2 = () => {
    setCurrentStep(2);
  };

  // Нажатие «Рассчитать»
  const handleCalculate = () => {
    const calcResult = calculateBudget(
      businessParams,
      selectedTaskOptions,
      tasks,
      businesses,
      months,
      assortment,
      regions
    );
    if (calcResult) {
      setResult(calcResult);
      setCurrentStep(4);
    } else {
      alert('Не удалось определить выбранную сферу или направление для расчёта.');
    }
  };

  // Кнопка «Назад» из результата – переход на шаг 3
  const handleResultBack = () => {
    setCurrentStep(3);
  };

  // Кнопка «На главную» – переход к шагу 1 (опционально можно сбросить состояние)
  const handleResultHome = () => {
    setCurrentStep(1);
  };

  return (
    <div id="calculator">
      <h1>Калькулятор рекламного бюджета</h1>

      {currentStep === 1 && (
        <BusinessParams
          onNext={handleNextFromBusinessParams}
          initialParams={businessParams}
        />
      )}

      {currentStep === 2 && (
        <TasksStep1
          onNext={handleNextFromTasksStep1}
          onBack={handleBackFromTasksStep1}
          selectedTasks={selectedTasks}
        />
      )}

      {currentStep === 3 && (
        <TasksStep2
          selectedTasks={selectedTasks}
          onBack={handleBackFromTasksStep2}
          onCalculate={handleCalculate}
          selectedTaskOptions={selectedTaskOptions}
          setSelectedTaskOptions={setSelectedTaskOptions}
        />
      )}

      {currentStep === 4 && (
        <Result
          result={result}
          businessParams={businessParams}
          selectedTasks={selectedTasks}
          selectedTaskOptions={selectedTaskOptions}
          onBack={handleResultBack}
          onHome={handleResultHome}
        />
      )}
    </div>
  );
}

export default App;
