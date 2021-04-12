<template>
  <form
    class="recipe-form"
    @submit.prevent="addRecipe"
  >
    <label>
      <span>название</span>
      <input
        type="text"
        v-model="recipeName"
        required
      >
    </label>
    <div class="recipe-ingredients">
      <div class="recipe-ingredients-list">{{ "ингредиенты:" }}
        <span
          v-for="ingredient in recipeIngredients"
          :key="ingredient.id"
        >
          {{ ingredientNameById(ingredient.id) }} {{ ingredient.amount+'; ' }}
        </span>
      </div>
      <label>
        <span>что</span>
        <select v-model="selectedIngredient">
          <option
            v-for="ingredient in ingredients"
            :value="ingredient.id"
            :key="ingredient.id"
          >
            {{ ingredient.name }}
          </option>
        </select>
      </label>
      <label>
        <span>сколько</span>
        <input
          type="text"
          v-model="selectedAmount"
        >
      </label>
      <button
        class="add-ingredient-to-recipe-button"
        @click="addIngredientToRecipe"
      >добавить ингредиент</button>
    </div>
    <label>
      <span>метод</span>
      <textarea
        v-model="method"
        required
      >
      </textarea>
    </label>
    <label>
      <span>посуда</span>
      <input
        type="text"
        v-model="drinkware"
        required
      >
    </label>
    <div>
      <button
        class="add-recipe-button"
        type="submit"
      >добавить рецепт</button>
    </div>
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
    drinkware: '',
  }),
  computed: {
    ...mapState([
      'recipes',
      'ingredients',
    ]),
    ...mapGetters([
      'newRecipeId',
      'ingredientNameById',
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
        drinkware: this.drinkware,
        id: this.newRecipeId,
      });
      this.recipeName = '';
      this.recipeIngredients = [];
      this.method = '';
      this.drinkware = '';
    },
  },
};
</script>

<style lang="scss">
  .recipe-form {
    display: flex;
    flex-direction: column;

    label,
    .recipe-ingredients {
      margin-bottom: 20px;
    }

    span {
      padding: 5px;
      padding-left: 0;
    }

    .add-recipe-button {
      padding: 8px;
      margin-left: 60px;
    }

  }
</style>
