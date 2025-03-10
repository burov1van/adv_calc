// src/components/TasksStep2.jsx
import React, { useState } from 'react';
import { tasks } from '../data';

const TasksStep2 = ({
  selectedTasks,
  onBack,
  onCalculate,
  selectedTaskOptions: initialSelectedOptions,
  setSelectedTaskOptions
}) => {
  // Локальное состояние для опций (но синхронизируем через setSelectedTaskOptions)
  const [localOptions, setLocalOptions] = useState(initialSelectedOptions || {});

  const handleOptionChange = (taskName, optionName, cost, isChecked) => {
    let updated = { ...localOptions };
    if (isChecked) {
      // Добавляем выбранную опцию
      updated[taskName] = updated[taskName]
        ? [...updated[taskName], { optionName, cost }]
        : [{ optionName, cost }];
    } else {
      // Удаляем опцию
      updated[taskName] = updated[taskName]?.filter((opt) => opt.optionName !== optionName) || [];
    }
    setLocalOptions(updated);
    setSelectedTaskOptions(updated); // обновляем состояние «выбранных» в App
  };

  const handleCalculate = () => {
    // Проверяем, что для каждой задачи с опциями выбрано хотя бы что-то
    for (const taskName of selectedTasks) {
      const task = tasks.find((t) => t.name === taskName);
      if (task?.options?.length > 0) {
        if (!localOptions[taskName] || localOptions[taskName].length === 0) {
          alert(`Выберите хотя бы одну опцию для задачи "${taskName}"`);
          return;
        }
      }
    }
    onCalculate();
  };

  return (
    <div id="tasksStep2" className="group">
      <h2>3. Выберите опции для выбранных задач:</h2>
      <div id="tasksOptionsContainer">
        {selectedTasks.map((taskName) => {
          const task = tasks.find((t) => t.name === taskName);
          if (!task) return null;

          return (
            <div key={taskName} className="group">
              <h3>{taskName}</h3>
              {task.options && task.options.length > 0 ? (
                task.options.map((opt, index) => {
                  const costVal = opt.cost.replace(',', '.');
                  const isChecked =
                    localOptions[taskName]?.some((o) => o.optionName === opt.name) || false;

                  return (
                    <label key={index}>
                      <input
                        type="checkbox"
                        onChange={(e) =>
                          handleOptionChange(taskName, opt.name, parseFloat(costVal), e.target.checked)
                        }
                        checked={isChecked}
                      />
                      {opt.name} (коэфф. {costVal})
                    </label>
                  );
                })
              ) : (
                // Если у задачи нет опций — используем коэфф. самой задачи (task.cost)
                <div>
                  Нет дополнительных опций. Будет использован коэффициент:{' '}
                  {task.cost ? parseFloat(task.cost.replace(',', '.')) : 0}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <button onClick={onBack}>Назад</button>
      <button onClick={handleCalculate}>Рассчитать</button>
    </div>
  );
};

export default TasksStep2;
