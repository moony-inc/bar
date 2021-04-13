<template>
  <form
    class="recipe-form"
    @submit.prevent="addRecipe"
  >
    <label>
      <span>название</span><br>
      <input
        class="input"
        type="text"
        v-model="recipeName"
        required
      >
    </label>
    <div class="ingredient-form">
      <div class="ingredient-list">{{ "ингредиенты:" }}
        <span
          v-for="ingredient in recipeIngredients"
          :key="ingredient.id"
        >
          {{ ingredientNameById(ingredient.id) }} {{ ingredient.amount + '; ' }}
        </span>
      </div>
      <label>
        <span class="ingredient-label">что</span>
        <select
          class="ingredient-input"
          v-model="selectedIngredient"
        >
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
        <span class="ingredient-label">сколько</span>
        <input
          class="ingredient-input"
          type="text"
          v-model="selectedAmount"
        >
      </label>
      <button
        @click="addIngredientToRecipe"
      >добавить ингредиент</button>
    </div>
    <label>
      <span>метод</span><br>
      <textarea
        class="input"
        v-model="method"
        required
      >
      </textarea>
    </label>
    <label>
      <span>посуда</span><br>
      <input
        class="input"
        type="text"
        v-model="drinkware"
        required
      >
    </label>
    <button
      class="add-recipe-button"
      type="submit"
    >добавить рецепт</button>
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
    width: 400px;
    padding: 10px;
    background-color: rgba(114, 221, 198, 0.2);

    .ingredient-form {
      padding: 5px;
      margin-bottom: 15px;
      background-color: rgba(114, 221, 198, 0.4);
    }

    .ingredient-list {
      margin-bottom: 5px;
    }

    .ingredient-input {
      width: 100px;
      margin-bottom: 8px;
      margin-right: 5px;
    }

    .ingredient-label {
      margin-right: 5px;
    }

    .input {
      width: 200px;
      margin-top: 5px;
      margin-bottom: 20px;
    }

    .add-recipe-button {
      align-self: center;
      padding: 8px;
    }
  }
</style>
