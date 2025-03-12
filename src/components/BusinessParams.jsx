// src/components/BusinessParams.jsx

import React, { useState } from 'react';
import { businesses } from '../data';

const BusinessParams = ({ onNext, initialParams }) => {
  const [params, setParams] = useState(
    initialParams || {
      businessSphere: '',
      businessDirection: '',
      region: '',
      assortment: '',
      months: ''
    }
  );

  const selectedSphere = businesses.find((b) => b.name === params.businessSphere);
  const hasDirections = selectedSphere && selectedSphere.options && selectedSphere.options.length > 0;

  const handleChange = (e) => {
    setParams({ ...params, [e.target.name]: e.target.value });
  };

  const handleNext = () => {
    if (!params.businessSphere || !params.region || !params.assortment || !params.months) {
      alert('Пожалуйста, заполните все обязательные поля.');
      return;
    }
    onNext(params);
  };

  return (
    <div id="businessParams">
      <h2>1. Выберите параметры бизнеса</h2>

      <label>К какой сфере относится ваш бизнес:</label>
      <select name="businessSphere" value={params.businessSphere} onChange={handleChange}>
        <option value="">Выберите сферу</option>
        {businesses.map((b, idx) => (
          <option key={idx} value={b.name}>
            {b.name}
          </option>
        ))}
      </select>

      {hasDirections && (
        <div id="directionContainer">
          <label>Какое направление:</label>
          <select name="businessDirection" value={params.businessDirection} onChange={handleChange}>
            <option value="-">Выбрать...</option>
            {selectedSphere.options.map((opt, idx) => (
              <option key={idx} value={opt.name}>
                {opt.name + ' (база: ' + opt.cost[1] + ')'}
              </option>
            ))}
          </select>
        </div>
      )}

      <label>В каких регионах вы работаете:</label>
      <div>
        <label>
          <input
            type="radio"
            name="region"
            value="Малые города"
            checked={params.region === 'Малые города'}
            onChange={handleChange}
          />
          Малые города (коэфф. 0.9)
        </label>
        <label>
          <input
            type="radio"
            name="region"
            value="Крупные города"
            checked={params.region === 'Крупные города'}
            onChange={handleChange}
          />
          Крупные города (коэфф. 1,1)
        </label>
        <label>
          <input
            type="radio"
            name="region"
            value="Города-миллионники"
            checked={params.region === 'Города-миллионники'}
            onChange={handleChange}
          />
          Города-миллионники (коэфф. 1.3)
        </label>
        <label>
          <input
            type="radio"
            name="region"
            value="Москва"
            checked={params.region === 'Москва'}
            onChange={handleChange}
          />
          Москва (коэфф. 1.5)
        </label>
        <label>
          <input
            type="radio"
            name="region"
            value="Вся Россия"
            checked={params.region === 'Вся Россия'}
            onChange={handleChange}
          />
          Вся Россия (коэфф. 1,7)
        </label>
      </div>

      <label>Какой ассортимент товаров/услуг вы хотите рекламировать:</label>
      <div>
        <label>
          <input
            type="radio"
            name="assortment"
            value="Минимальный ассортимент (1 категория товаров или небольшой сайт с несколькими услугами)"
            checked={
              params.assortment ===
              'Минимальный ассортимент (1 категория товаров или небольшой сайт с несколькими услугами)'
            }
            onChange={handleChange}
          />
          Минимальный ассортимент (коэфф. 0.8)
        </label>
        <label>
          <input
            type="radio"
            name="assortment"
            value="Небольшой ассортимент (до 10 товарных категорий)"
            checked={params.assortment === 'Небольшой ассортимент (до 10 товарных категорий)'}
            onChange={handleChange}
          />
          Небольшой ассортимент (до 10 товарных категорий) (коэфф. 1)
        </label>
        <label>
          <input
            type="radio"
            name="assortment"
            value="Средний ассортимент (до 50 товарных категорий)"
            checked={params.assortment === 'Средний ассортимент (до 50 товарных категорий)'}
            onChange={handleChange}
          />
          Средний ассортимент (до 50 товарных категорий) (коэфф. 1,1)
        </label>
        <label>
          <input
            type="radio"
            name="assortment"
            value="Большой ассортимент (тысячи позиций)"
            checked={params.assortment === 'Большой ассортимент (тысячи позиций)'}
            onChange={handleChange}
          />
          Большой ассортимент (тысячи позиций) (коэфф. 1.3)
        </label>
        <label>
          <input
            type="radio"
            name="assortment"
            value="Мегамаркет, агрегатор или маркетплейс"
            checked={params.assortment === 'Мегамаркет, агрегатор или маркетплейс'}
            onChange={handleChange}
          />
          Мегамаркет, агрегатор или маркетплейс (коэфф. 2)
        </label>
      </div>

      <label>За какой срок вы хотите достичь результата:</label>
      <div>
        <label>
          <input
            type="radio"
            name="months"
            value="1 месяц"
            checked={params.months === '1 месяц'}
            onChange={handleChange}
          />
          1 месяц (коэфф. 1,5)
        </label>
        <label>
          <input
            type="radio"
            name="months"
            value="3 месяца"
            checked={params.months === '3 месяца'}
            onChange={handleChange}
          />
          3 месяца (коэфф. 1.2)
        </label>
        <label>
          <input
            type="radio"
            name="months"
            value="6 месяцев"
            checked={params.months === '6 месяцев'}
            onChange={handleChange}
          />
          6 месяцев (коэфф. 1)
        </label>
        <label>
          <input
            type="radio"
            name="months"
            value="12 месяцев"
            checked={params.months === '12 месяцев'}
            onChange={handleChange}
          />
          12 месяцев (коэфф. 0.8)
        </label>
        <label>
          <input
            type="radio"
            name="months"
            value="Не имеет значения"
            checked={params.months === 'Не имеет значения'}
            onChange={handleChange}
          />
          Не имеет значения (коэфф. 1)
        </label>
      </div>

      <button onClick={handleNext}>Далее</button>
    </div>
  );
};

export default BusinessParams;
