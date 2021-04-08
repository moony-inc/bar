import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    ingredients: [],
    categories: [],
  },
  getters: {
    ingredientListByCategory: state => category => state.ingredients
      .find(item => item.category.value === category).ingredientList,
    newIdByCategory: (state, getters) => category => {
      const targetList = getters.ingredientListByCategory(category);
      const newId = targetList.length
        ? targetList.reduce((result, item) => {
          if (item.id > result) {
            result = item.id; // eslint-disable-line no-param-reassign
          }

          return result;
        }, 0) + 1
        : 0;

      return newId;
    },
  },
  mutations: {
    setCategories(state, categories) {
      state.categories = categories;
    },
    setCategoriesInIngredients(state) {
      state.ingredients = state.categories.map(category => ({
        category,
        ingredientList: [],
      }));
    },
    setIngredients(state, ingredients) {
      state.ingredients = ingredients;
    },
    addIngredient(state, ingredient) {
      state.ingredients
        .find(item => item.category.value === ingredient.category).ingredientList
        .push(ingredient);
    },
    deleteIngredient(state, ingredient) {
      const { ingredientList } = state.ingredients
        .find(item => item.category.value === ingredient.category);
      const filteredIngredientList = ingredientList.filter(item => item.id !== ingredient.id);

      state.ingredients.find(item => item.category.value === ingredient.category)
        .ingredientList = filteredIngredientList;
    },
  },
  actions: {
    fetchCategories({ commit }) {
      return axios.get('/categories.json').then(({ data }) => {
        commit('setCategories', data);
      });
    },
    setupIngredients({ commit }) {
      const localIngredients = localStorage.getItem('ingredients');

      if (localIngredients) {
        commit('setIngredients', JSON.parse(localIngredients));
      } else {
        commit('setCategoriesInIngredients');
      }
    },
    addIngredient({ commit, dispatch }, ingredient) {
      commit('addIngredient', ingredient);
      dispatch('saveIngredientsLocalStorage');
    },
    deleteIngredient({ commit, dispatch }, ingredient) {
      commit('deleteIngredient', ingredient);
      dispatch('saveIngredientsLocalStorage');
    },
    // local storage methods
    saveIngredientsLocalStorage({ state }) {
      localStorage.setItem('ingredients', JSON.stringify(state.ingredients));
    },
  },
});
