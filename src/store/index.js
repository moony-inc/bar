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
    newIngredientId: state => (state.ingredients.length
      ? state.ingredients[state.ingredients.length - 1].id + 1
      : 0),
  },
  mutations: {
    setCategories(state, categories) {
      state.categories = categories;
    },
    setIngredients(state, ingredients) {
      state.ingredients = ingredients;
    },
    addIngredient(state, ingredient) {
      state.ingredients.push(ingredient);
    },
    deleteIngredient(state, ingredient) {
      state.ingredients = state.ingredients.filter(item => item.id !== ingredient.id);
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
