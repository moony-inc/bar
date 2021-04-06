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
    ingredientListByCategory: state => categoryValue => state.ingredients
      .find(item => item.category.value === categoryValue).ingredientList,
    newIdByCategory: (state, getters) => categoryValue => {
      const targetList = getters.ingredientListByCategory(categoryValue);
      const newId = targetList.length
        ? targetList.reduce((result, item) => {
          if (item.id > result) {
            result = item.id; // eslint-disable-line
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

      state.ingredients
        .find(item => item.category.value === ingredient.category).ingredientList = ingredientList
          .filter(item => item.id !== ingredient.id);
    },
  },
  actions: {
    fetchCategories({ commit }) {
      return axios.get('/categories.json').then(({ data }) => {
        commit('setCategories', data);
        commit('setCategoriesInIngredients');
      });
    },
    checkLocalIngredients({ commit }) {
      const localIngredients = localStorage.getItem('ingredients');

      if (localIngredients) {
        commit('setIngredients', JSON.parse(localIngredients));
      }
    },
    saveIngredientsLocalStorage({ state }) {
      localStorage.setItem('ingredients', JSON.stringify(state.ingredients));
    },
    addIngredient({ commit, dispatch }, ingredient) {
      commit('addIngredient', ingredient);
      dispatch('saveIngredientsLocalStorage');
    },
    deleteIngredient({ commit, dispatch }, ingredient) {
      commit('deleteIngredient', ingredient);
      dispatch('saveIngredientsLocalStorage');
    },
  },
  modules: {
  },
});
