<template>
  <form
    class="recipe-form"
    @submit.prevent="addRecipe"
  >
    <label>
      <span class="label-text">название</span>
      <input
        class="input"
        type="text"
        v-model="recipeName"
        required
      >
    </label>
    <div class="ingredient-section">
      <div class="ingredient-list">{{ "ингредиенты:" }}
        <span
          v-for="ingredient in recipeIngredients"
          :key="ingredient.id"
        >
          {{ ingredientNameById(ingredient.id) }} {{ ingredient.amount + '; ' }}
        </span>
      </div>
      <div class="ingredient-form">
        <label>
          <span class="label-text">что</span>
          <input
            class="ingredient-input"
            :value="ingredientName"
            @input="updateIngredientName"
          >
        </label>
        <label>
          <span class="label-text">сколько</span>
          <input
            class="ingredient-input"
            type="text"
            v-model="ingredientAmount"
          >
        </label>
        <button
          class="add-ingredient-button"
          @click.stop.prevent="addIngredientToRecipe"
        >+</button>
      </div>
      <div
        class="promt-area"
        v-for="ingredient in suitableIngredients"
        :key="ingredient.id"
      >
        <button @click="setIngredient(ingredient)">{{ ingredient.name }}</button>
      </div>
      <div
        class="add-ingredient-form"
        v-show="isNewIngredient"
      >
        <select
          v-model="selectedCategory"
          required
        >
          <option
            v-for="category in categories"
            :value="category.value"
            :key="category.value"
          >
            {{ category.name }}
          </option>
        </select>
      </div>
    </div>
    <label>
      <span class="label-text">метод</span>
      <textarea
        class="input"
        v-model="method"
        required
      >
      </textarea>
    </label>
    <label>
      <span class="label-text">посуда</span>
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
      :disabled="!recipeIngredients.length"
    >добавить рецепт</button>
  </form>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';

export default {
  data: () => ({
    recipeName: '',
    ingredientName: '',
    selectedCategory: '',
    ingredientId: '',
    ingredientAmount: '',
    recipeIngredients: [],
    method: '',
    drinkware: '',
  }),
  computed: {
    ...mapState([
      'recipes',
      'ingredients',
      'categories',
    ]),
    ...mapGetters([
      'newRecipeId',
      'ingredientNameById',
      'newIngredientId',
    ]),
    suitableIngredients() {
      let suitableIngredients = [];

      if (this.ingredientName.length >= 2) {
        suitableIngredients = this.ingredients
          .filter(item => item.name.includes(this.ingredientName));
      }

      return suitableIngredients;
    },
    isNewIngredient() {
      let isNewIngredient = false;

      if (this.ingredientName.length > 0 && this.suitableIngredients.length === 0) {
        isNewIngredient = true;
      }

      return isNewIngredient;
    },
  },
  methods: {
    ...mapActions({
      addRecipeStore: 'addRecipe',
      addIngredient: 'addIngredient',
    }),
    updateIngredientName(event) {
      this.ingredientName = event.target.value;
    },
    setIngredient(ingredient) {
      this.ingredientName = ingredient.name;
      this.ingredientId = ingredient.id;
    },
    addIngredientToRecipe() {
      if (this.isNewIngredient) {
        const newId = this.newIngredientId;
        this.addIngredient({
          name: this.ingredientName,
          category: this.selectedCategory,
          availability: true,
          id: newId,
        });
        this.ingredientId = newId;
      }

      this.recipeIngredients.push({
        id: this.ingredientId,
        amount: this.ingredientAmount,
      });

      this.ingredientName = '';
      this.ingredientAmount = '';
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
    width: 350px;
    padding: 10px;
    background-color: rgba(114, 221, 198, 0.2);

    .ingredient-section {
      background-color: rgba(114, 221, 198, 0.4);
    }

    .ingredient-list {
      padding: 5px;
    }

    .ingredient-form {
      display: flex;
      padding: 5px;
    }

    .ingredient-input {
      width: 120px;
      margin-bottom: 10px;
      margin-right: 10px;
    }

    .add-ingredient-button {
      align-self: center;
    }

    .promt-area {
      height: 20px;
      padding: 5px;
      margin-bottom: 10px;
    }

    .label-text {
      display: block;
      margin-bottom: 5px;
    }

    .input {
      width: 200px;
      margin-bottom: 10px;
    }

    .add-recipe-button {
      align-self: center;
      padding: 8px;
    }
  }
</style>
