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
        <div
          v-for="ingredient in recipeIngredients"
          :key="ingredient.id"
        >
          {{ ingredientNameById(ingredient.id) }} {{ ingredient.amount + '; ' }}
          <button
            type="button"
            @click="deleteIngredientFromRecipe(ingredient.id)"
          >x</button>
        </div>
      </div>
      <form
        class="ingredient-form"
        @submit.stop.prevent="addIngredientToRecipe"
      >
        <label>
          <span class="label-text">что</span>
          <input
            class="ingredient-input"
            type="text"
            :value="ingredient.name"
            @input="updateIngredientName"
            required
          >
        </label>
        <label>
          <span class="label-text">сколько</span>
          <input
            class="ingredient-input"
            type="text"
            v-model="ingredient.amount"
            required
          >
        </label>
        <button
          class="add-ingredient-button"
          type="submit"
        >+</button>
        <div v-if="infoMessage">{{ infoMessage }}</div>
        <div
          class="suggestions-area"
          v-if="!this.isNewIngredientManual"
        >
          <button
            v-for="ingredient in suitableIngredients"
            :key="ingredient.id"
            @click.stop.prevent="setIngredient(ingredient)"
          >{{ ingredient.name }}</button>
        </div>
        <div
          class="categories-area"
          v-if="isNewIngredientComputed"
        >
          <label>
            <span>выберите категорию для нового ингредиента</span>
            <select
              v-model="ingredient.category"
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
          </label>
        </div>
      </form>
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
import { debounce } from '@/utils/utils';

const INGREDIENT_SUGGESTIONS_LIMIT = 4;
const INGREDIENT_SUGGESTIONS_DELAY = 300;

export default {
  data: () => ({
    recipeName: '',
    recipeIngredients: [],
    ingredient: {
      name: '',
      amount: '',
      category: '',
      id: null,
    },
    isNewIngredientManual: false,
    suitableIngredients: [],
    method: '',
    drinkware: '',
    infoMessage: '',
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
    isNewIngredientComputed() {
      const noMatchWithExistingIngredients = (
        this.ingredient.name.length > 0
        && this.suitableIngredients.length === 0
      );
      const ingredientIsNotSet = this.ingredient.id === null;
      let isNewIngredient = false;

      if (ingredientIsNotSet && (noMatchWithExistingIngredients || this.isNewIngredientManual)) {
        isNewIngredient = true;
      }

      return isNewIngredient;
    },
  },
  watch: {
    ingredients: {
      handler: function ingredientsHandler() {
        this.updateSuitableIngredientsDebounced();
      },
      deep: true,
    },
    ingredient: {
      handler: function ingredientHandler() {
        this.updateSuitableIngredientsDebounced();
      },
      deep: true,
    },
  },
  methods: {
    ...mapActions({
      addRecipeStore: 'addRecipe',
      addIngredientStore: 'addIngredient',
    }),
    updateSuitableIngredientsDebounced: debounce(function updateSuitableIngredients() {
      this.suitableIngredients = this.ingredient.name.length >= 2 && this.ingredient.id === null
        ? this.ingredients
          .filter(item => item.name.includes(this.ingredient.name))
          .slice(0, INGREDIENT_SUGGESTIONS_LIMIT)
        : [];
    }, INGREDIENT_SUGGESTIONS_DELAY),
    updateIngredientName(event) {
      this.ingredient.name = event.target.value;
      this.ingredient.id = null;
    },
    setIngredient(ingredient) {
      this.ingredient = {
        ...this.ingredient,
        ...{ name: ingredient.name, id: ingredient.id },
      };
      this.infoMessage = '';
    },
    addIngredientToRecipe() {
      const mustUseSuggestions = this.suitableIngredients
        .some(item => item.name === this.ingredient.name);
      const suggestionsDontFit = this.suitableIngredients.length && this.ingredient.id === null;

      if (this.isNewIngredientComputed) {
        const newId = this.newIngredientId;

        this.addIngredientStore({
          name: this.ingredient.name,
          category: this.ingredient.category,
          availability: false,
          id: newId,
        });
        this.ingredient.id = newId;
        this.ingredient.category = '';
      }

      if (mustUseSuggestions) {
        this.infoMessage = 'выберите из вариантов';
      } else if (suggestionsDontFit && !this.isNewIngredientManual) {
        this.isNewIngredientManual = true;
      } else {
        this.isNewIngredientManual = false;
        this.recipeIngredients.push({
          id: this.ingredient.id,
          amount: this.ingredient.amount,
        });

        this.ingredient.name = '';
        this.ingredient.id = null;
        this.ingredient.amount = '';
      }
    },
    deleteIngredientFromRecipe(ingredientId) {
      this.recipeIngredients = this.recipeIngredients.filter(item => item.id !== ingredientId);
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
      flex-wrap: wrap;
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

    .suggestions-area {
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
