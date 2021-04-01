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
    addIngredient(state, ingredient) {
      state.ingredients
        .find(item => item.category.value === ingredient.category).ingredientList
        .push(ingredient);
    },
    setCategories(state, categories) {
      state.categories = categories;
    },
    setCategoriesInIngredients(state) {
      state.ingredients = state.categories.map(category => ({
        category,
        ingredientList: [],
      }));
    },
  },
  actions: {
    fetchCategories({ commit }) {
      return axios.get('/categories.json').then(({ data }) => {
        commit('setCategories', data);
        commit('setCategoriesInIngredients');
      });
    },
  },
  modules: {
  },
});
