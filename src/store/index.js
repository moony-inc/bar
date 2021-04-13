import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    recipes: [],
    ingredients: [],
    categories: [],
  },
  getters: {
    newIngredientId: state => (state.ingredients.length
      ? state.ingredients[state.ingredients.length - 1].id + 1
      : 0),
    newRecipeId: state => (state.recipes.length
      ? state.recipes[state.recipes.length - 1].id + 1
      : 0),
    ingredientNameById: state => id => state.ingredients.find(item => item.id === id).name,
    usingIngredientInRecipesById: state => id => {
      let ingredientIsUsed = false;

      state.recipes.forEach(item => item.ingredients.forEach(element => {
        if (element.id === id) {
          ingredientIsUsed = true;
        }
      }));

      return ingredientIsUsed;
    },
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
    deleteIngredient(state, ingredientId) {
      state.ingredients = state.ingredients.filter(item => item.id !== ingredientId);
    },
    setRecipes(state, recipes) {
      state.recipes = recipes;
    },
    addRecipe(state, recipe) {
      state.recipes.push(recipe);
    },
    deleteRecipe(state, recipeId) {
      state.recipes = state.recipes.filter(item => item.id !== recipeId);
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
    deleteIngredient({ commit, dispatch }, ingredientId) {
      commit('deleteIngredient', ingredientId);
      dispatch('saveIngredientsLocalStorage');
    },
    setupRecipes({ commit }) {
      const localRecipes = localStorage.getItem('recipes');

      if (localRecipes) {
        commit('setRecipes', JSON.parse(localRecipes));
      }
    },
    addRecipe({ commit, dispatch }, recipe) {
      commit('addRecipe', recipe);
      dispatch('saveRecipesLocalStorage');
    },
    deleteRecipe({ commit, dispatch }, recipeId) {
      commit('deleteRecipe', recipeId);
      dispatch('saveRecipesLocalStorage');
    },
    // local storage methods
    saveIngredientsLocalStorage({ state }) {
      localStorage.setItem('ingredients', JSON.stringify(state.ingredients));
    },
    saveRecipesLocalStorage({ state }) {
      localStorage.setItem('recipes', JSON.stringify(state.recipes));
    },
  },
});
