<template>
  <form
    class="recipe-form"
    @submit.prevent="addRecipe"
  >
    <label>
      название
      <input
        type="text"
        v-model="recipeName"
        required
      >
    </label>
    <div>
      {{ "ингредиенты:" }}
      <div
        v-for="ingredient in recipeIngredients"
        :key="ingredient.id"
      >
        {{ ingredients.find(item => item.id === ingredient.id).name }} {{ ingredient.amount }}
      </div>
      <select  v-model="selectedIngredient">
        <option
          v-for="ingredient in ingredients"
          :value="ingredient.id"
          :key="ingredient.id"
        >
          {{ ingredient.name }}
        </option>
      </select>
      <label>
        сколько
        <input
          type="text"
          v-model="selectedAmount"
        >
      </label>
      <button @click="addIngredientToRecipe">добавить ингредиент</button>
    </div>
    <label>
      метод
      <textarea
        v-model="method"
        required
      >
      </textarea>
    </label>
    <label>
      посуда
      <input
        type="text"
        v-model="glass"
        required
      >
    </label>
    <button type="submit">добавить рецепт</button>
  </form>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';

export default {
  data: () => ({
    recipeName: '',
    selectedIngredient: '',
    selectedAmount: '',
    recipeIngredients: [],
    method: '',
    glass: '',
  }),
  computed: {
    ...mapState([
      'recipes',
      'ingredients',
    ]),
    ...mapGetters([
      'newRecipeId',
    ]),
  },
  methods: {
    ...mapActions({
      addRecipeStore: 'addRecipe',
    }),
    addIngredientToRecipe() {
      this.recipeIngredients.push({
        id: this.selectedIngredient,
        amount: this.selectedAmount,
      });
      this.selectedIngredient = '';
      this.selectedAmount = '';
    },
    addRecipe() {
      this.addRecipeStore({
        name: this.recipeName,
        ingredients: this.recipeIngredients,
        method: this.method,
        glass: this.glass,
        id: this.newRecipeId,
      });
      this.recipeName = '';
      this.recipeIngredients = [];
      this.method = '';
      this.glass = '';
    },
  },
};
</script>
