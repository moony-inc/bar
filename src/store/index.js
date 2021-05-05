import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    recipes: [],
    ingredients: [],
    categories: [],
    sidebar: {
      isShown: false,
      mode: '',
    },
    recipeIdForEditing: null,
    testDataMessageStatus: false,
  },
  getters: {
    newIngredientId: state => (state.ingredients.length
      ? state.ingredients[state.ingredients.length - 1].id + 1
      : 0),
    newRecipeId: state => (state.recipes.length
      ? state.recipes[state.recipes.length - 1].id + 1
      : 0),
    ingredientNameById: state => id => state.ingredients.find(item => item.id === id).name,
    recipeById: state => id => state.recipes.find(item => item.id === id),
    usedIngredientInRecipeById: state => id => {
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
    switchTestDataMessage(state, value) {
      state.testDataMessageStatus = value;
    },
    setCategories(state, categories) {
      state.categories = categories;
    },
    setIngredients(state, ingredients) {
      state.ingredients = ingredients;
    },
    addIngredient(state, ingredient) {
      state.ingredients.push(ingredient);
    },
    setIngredientAvailability(state, { ingredientId, value }) {
      state.ingredients.find(item => item.id === ingredientId).availability = value;
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
    updateRecipe(state, recipe) {
      const index = state.recipes.findIndex(item => item.id === recipe.id);

      Vue.set(state.recipes, index, recipe);
    },
    deleteRecipe(state, recipeId) {
      state.recipes = state.recipes.filter(item => item.id !== recipeId);
    },
    showSidebar(state, mode) {
      state.sidebar.isShown = true;
      state.sidebar.mode = mode;
    },
    hideSidebar(state) {
      state.sidebar.isShown = false;
      state.sidebar.mode = '';
    },
    setRecipeIdForEditing(state, recipeId) {
      state.recipeIdForEditing = recipeId;
    },
  },
  actions: {
    fetchCategories({ commit }) {
      return axios.get('/categories.json').then(({ data }) => {
        commit('setCategories', data);
      });
    },
    addIngredient({ commit, dispatch }, ingredient) {
      commit('addIngredient', ingredient);
      dispatch('saveIngredientsLocalStorage');
    },
    setIngredientAvailability({ commit, dispatch }, { ingredientId, value }) {
      commit('setIngredientAvailability', { ingredientId, value });
      dispatch('saveIngredientsLocalStorage');
    },
    deleteIngredient({ commit, dispatch }, ingredientId) {
      commit('deleteIngredient', ingredientId);
      dispatch('saveIngredientsLocalStorage');
    },
    addRecipe({ commit, dispatch }, recipe) {
      commit('addRecipe', recipe);
      dispatch('saveRecipesLocalStorage');
    },
    updateRecipe({ commit, dispatch }, recipe) {
      commit('updateRecipe', recipe);
      dispatch('saveRecipesLocalStorage');
    },
    deleteRecipe({ commit, dispatch }, recipeId) {
      commit('deleteRecipe', recipeId);
      dispatch('saveRecipesLocalStorage');
    },
    // local storage methods
    hideTestDataMessage({ commit }) {
      commit('switchTestDataMessage', false);
      localStorage.setItem('hiddenTestData', true);
    },
    fetchTestData({ dispatch }) {
      return axios.get('/test_data.json').then(({ data }) => {
        localStorage.setItem('ingredients', JSON.stringify(data.ingredients));
        localStorage.setItem('recipes', JSON.stringify(data.recipes));

        dispatch('setupIngredients');
        dispatch('setupRecipes');
        dispatch('hideTestDataMessage');
      });
    },
    setupIngredients({ commit }) {
      const localIngredients = localStorage.getItem('ingredients');

      if (localIngredients) {
        commit('setIngredients', JSON.parse(localIngredients));
      }
    },
    setupRecipes({ commit }) {
      const localRecipes = localStorage.getItem('recipes');

      if (localRecipes) {
        commit('setRecipes', JSON.parse(localRecipes));
      }
    },
    saveIngredientsLocalStorage({ state }) {
      localStorage.setItem('ingredients', JSON.stringify(state.ingredients));
    },
    saveRecipesLocalStorage({ state }) {
      localStorage.setItem('recipes', JSON.stringify(state.recipes));
    },
  },
});
