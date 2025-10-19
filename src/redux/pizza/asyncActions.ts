import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { Pizza } from './types';

export const fetchPizzas = createAsyncThunk<
  { items: Pizza[]; totalCount: number }, // ✅ тип возвращаемого значения
  Record<string, string | number | undefined>
>(
  'pizza/fetchPizzasStatus',
  async (params) => {
    const { category, sortBy, order, search, currentPage } = params;
    console.log(params, 4444);
    
    const { data } = await axios.get(
      `https://vue-pizza-fb041-default-rtdb.firebaseio.com/pizzas.json`
    );
    
    console.log('✅ Received data:', data);
    
    const pizzas = Object.values(data || {}) as Pizza[];
    
    // 🔍 Фильтрация
    let filtered = pizzas;
    
    if (category !== '' && category !== undefined) {
      filtered = filtered.filter((p: any) => Number(p.category) === Number(category));
    }
    
    if (search) {
      filtered = filtered.filter((p: any) =>
        String(p.title).toLowerCase().includes(String(search).toLowerCase())
      );
    }
    
    // 🔽 Сортировка
    filtered.sort((a: any, b: any) => {
      const key = sortBy as keyof typeof a;
      if (order === 'asc') return a[key] > b[key] ? 1 : -1;
      return a[key] < b[key] ? 1 : -1;
    });
    
    // 🔢 Пагинация
    const limit = 4;
    const start = (Number(currentPage) - 1) * limit;
    const paginated = filtered.slice(start, start + limit);
    
    // ✅ Возвращаем объект с items и totalCount
    return {
      items: paginated,
      totalCount: filtered.length,
    };
  }
);
