import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    ingredients: {},
    categories: [],
  },
  getters: {
    newIdByCategory: state => categoryValue => {
      const newId = state.ingredients[categoryValue].length
        ? state.ingredients[categoryValue].reduce((result, item) => {
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
      state.ingredients = {
        ...state.ingredients,
        [ingredient.category]: [
          ...state.ingredients[ingredient.category],
          ingredient,
        ],
      };
    },
    setCategories(state, categories) {
      state.categories = categories;
    },
    setCategoriesInIngredients(state) {
      state.categories.forEach(item => {
        state.ingredients[item.value] = [];
      });
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
