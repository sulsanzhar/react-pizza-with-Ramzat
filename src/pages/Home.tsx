import React from 'react';
import qs from 'qs';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Categories, Sort, PizzaBlock, Skeleton, Pagination } from '../components';
import { sortList } from '../components/Sort';
import { useAppDispatch } from '../redux/store';
import { selectFilter } from '../redux/filter/selectors';
import { selectPizzaData } from '../redux/pizza/selectors';
import { setCategoryId, setCurrentPage, setFilters } from '../redux/filter/slice';
import { fetchPizzas } from '../redux/pizza/asyncActions';
import { SearchPizzaParams } from '../redux/pizza/types';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isMounted = React.useRef(false);
  
  const { items, status, totalCount } = useSelector(selectPizzaData);
  const { categoryId, sort, currentPage, searchValue } = useSelector(selectFilter);
  
  const onChangeCategory = React.useCallback((idx: number) => {
    dispatch(setCategoryId(idx));
  }, [dispatch]);
  
  const onChangePage = (page: number) => {
    dispatch(setCurrentPage(page));
  };
  
  const getPizzas = React.useCallback(() => {
    console.log('🔥 Fetching pizzas...');
    const sortBy = sort.sortProperty.replace('-', '');
    const order = sort.sortProperty.includes('-') ? 'asc' : 'desc';
    const category = categoryId > 0 ? String(categoryId) : '';
    const search = searchValue;
    
    console.log({ sortBy, order, category, search, currentPage });
    
    
    dispatch(
      fetchPizzas({
        sortBy,
        order,
        category,
        search,
        currentPage: String(currentPage),
      }),
    );
    
    window.scrollTo(0, 0);
  }, [categoryId, sort.sortProperty, searchValue, currentPage, dispatch]);
  
  // ✅ Восстанавливаем фильтры при первом рендере
  React.useEffect(() => {
    if (window.location.search) {
      const params = qs.parse(window.location.search.substring(1)) as unknown as SearchPizzaParams;
      const sortObj = sortList.find((obj) => obj.sortProperty === params.sortBy);
      
      dispatch(
        setFilters({
          searchValue: params.search || '',
          categoryId: Number(params.category) || 0,
          currentPage: Number(params.currentPage) || 1,
          sort: sortObj || sortList[0],
        }),
      );
    }
    isMounted.current = true;
  }, [dispatch]);
  
  // ✅ Записываем параметры в URL и запрашиваем пиццы
  React.useEffect(() => {
    if (isMounted.current) {
      const params = {
        sortProperty: sort.sortProperty,
        categoryId: categoryId > 0 ? categoryId : undefined,
        currentPage,
      };
      
      const queryString = qs.stringify(params, { skipNulls: true });
      navigate(`/?${queryString}`);
      
      getPizzas();
    }
  }, [categoryId, sort.sortProperty, searchValue, currentPage, navigate, getPizzas]);
  
  const pizzas = items.map((obj: any) => <PizzaBlock key={obj.id} {...obj} />);
  const skeletons = [...new Array(6)].map((_, index) => <Skeleton key={index} />);
  
  return (
    <div className="container">
      <div className="content__top">
        <Categories value={categoryId} onChangeCategory={onChangeCategory} />
        <Sort value={sort} />
      </div>
      <h2 className="content__title">Все пиццы</h2>
      {status === 'error' ? (
        <div className="content__error-info">
          <h2>Произошла ошибка 😕</h2>
          <p>К сожалению, не удалось получить пиццы. Попробуйте повторить попытку позже.</p>
        </div>
      ) : (
        <div className="content__items">{status === 'loading' ? skeletons : pizzas}</div>
      )}
      <Pagination currentPage={currentPage} onChangePage={onChangePage} pageCount={Math.ceil(totalCount / 4)}/>
    </div>
  );
};

export default Home;
