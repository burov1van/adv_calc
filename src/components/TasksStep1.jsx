import React, { useState } from 'react';
import { tasks } from '../data';

const TasksStep1 = ({ onNext, onBack, selectedTasks: initialSelectedTasks }) => {
  const [selectedTasks, setSelectedTasks] = useState(initialSelectedTasks || []);

  const handleCheckboxChange = (e) => {
    const value = e.target.value;
    if (e.target.checked) {
      setSelectedTasks([...selectedTasks, value]);
    } else {
      setSelectedTasks(selectedTasks.filter((task) => task !== value));
    }
  };

  const handleNext = () => {
    if (selectedTasks.length === 0) {
      alert('Пожалуйста, выберите хотя бы одну задачу.');
      return;
    }
    onNext(selectedTasks);
  };

  return (
    <div id="tasksStep1" className="group">
      <h2>2. Выберите задачи, которые нужно решить:</h2>
      <div id="tasksParentContainer">
        {tasks.map((task, index) => (
          <label key={index}>
            <input
              type="checkbox"
              value={task.name}
              onChange={handleCheckboxChange}
              checked={selectedTasks.includes(task.name)}
            />
            {task.options && task.options.length > 0
              ? task.name
              : `${task.name} (коэфф. ${task.cost || '0'})`}
          </label>
        ))}
      </div>
      <div className="button-group">
        <button onClick={onBack}>Назад</button>
        <button onClick={handleNext} disabled={selectedTasks.length === 0}>
          Далее
        </button>
      </div>
    </div>
  );
};

export default TasksStep1;
