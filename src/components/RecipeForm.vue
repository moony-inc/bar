<template>
  <form
    class="recipe-form"
    @submit.prevent="addRecipe"
  >
    <label>
      <span>название</span><br>
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
        <select
          class="resipe-ingredient-input"
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
        <span>сколько</span>
        <input
          class="resipe-ingredient-input"
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
      <span>метод</span><br>
      <textarea
        v-model="method"
        required
      >
      </textarea>
    </label>
    <label>
      <span>посуда</span><br>
      <input
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

    .recipe-ingredients {
      padding: 5px;
      margin-bottom: 15px;
      background-color: rgba(114, 221, 198, 0.4);
    }

    .recipe-ingredients-list {
      margin-bottom: 5px;
    }

    .resipe-ingredient-input {
      width: 100px;
      margin-bottom: 8px;
    }

    span,
    select {
      margin-right: 5px;
    }

    input,
    textarea {
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
