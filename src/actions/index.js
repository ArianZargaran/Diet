import { dietsRef, foodsRef, mealsRef, similarsRef, routerRef } from '../firebase';

const setRouter = payload => ({
  type: 'SET_ROUTER',
  payload,
});

const fetchDiet = () => async (dispatch) => {
  dietsRef.on('value', (snapshot) => {
    dispatch({
      type: 'FETCH_DIET',
      payload: snapshot.val(),
    });
  });
};

const fetchFoods = () => async (dispatch) => {
  foodsRef.on('value', (snapshot) => {
    dispatch({
      type: 'FETCH_FOODS',
      payload: snapshot.val(),
    });
  });
};

const fetchMeals = () => async (dispatch) => {
  mealsRef.on('value', (snapshot) => {
    dispatch({
      type: 'FETCH_MEALS',
      payload: snapshot.val(),
    });
  });
};

const fetchSimilars = () => async (dispatch) => {
  similarsRef.on('value', (snapshot) => {
    dispatch({
      type: 'FETCH_SIMILARS',
      payload: snapshot.val(),
    });
  });
};

const fetchRouter = () => async (dispatch) => {
  routerRef.on('value', (snapshot) => {
    dispatch({
      type: 'FETCH_ROUTER',
      payload: snapshot.val(),
    });
  });
};

export {fetchDiet, fetchFoods, fetchMeals, fetchSimilars, fetchRouter, setRouter};