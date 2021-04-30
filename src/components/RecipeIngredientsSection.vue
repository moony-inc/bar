<template>
  <div class="recipe-ingredients-section">
    <div class="list">
      <h2 class="list-title">ингредиенты</h2>
      <div
        class="ingredient"
        v-for="ingredient in recipeIngredients"
        :key="ingredient.id"
      >
        <div class="ingredient-name">
          {{ ingredientNameById(ingredient.id) }} - {{ ingredient.amount }}
        </div>
        <button
          class="delete-ingredient-button"
          type="button"
          @click="deleteIngredientFromRecipe(ingredient.id)"
        ></button>
      </div>
    </div>
    <form
      class="form"
      @submit.stop.prevent="addIngredientToRecipe"
    >
      <label>
        <span class="label-text">что</span>
        <input
          class="input-ingredient"
          type="text"
          :value="ingredient.name"
          @input="updateIngredientName"
          required
        >
      </label>
      <label>
        <span class="label-text">сколько</span>
        <input
          class="input-ingredient"
          type="text"
          v-model="ingredient.amount"
          ref="amountInput"
          required
        >
      </label>
      <button
        class="add-ingredient-button"
        type="submit"
      ></button>
      <transition name="fade" mode="out-in">
        <div
          class="suggestions-area"
          v-if="!isNewIngredientManual && suitableIngredients.length"
        >
          <div
            class="message"
            v-if="infoMessage"
          >{{ infoMessage }}</div>
          <button
            class="suggestion"
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
            <div class="message">выберите категорию для нового ингредиента</div>
            <select
              class="select-category"
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
      </transition>
    </form>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';
import { debounce } from '@/utils/utils';

const INGREDIENT_SUGGESTIONS_LIMIT = 4;
const INGREDIENT_SUGGESTIONS_DELAY = 300;

export default {
  model: {
    prop: 'recipeIngredients',
    event: 'change',
  },
  props: {
    recipeIngredients: Array,
  },
  data: () => ({
    recipeIngredientsLocal: [],
    ingredient: {
      name: '',
      amount: '',
      category: '',
      id: null,
    },
    isNewIngredientManual: false,
    suitableIngredients: [],
    infoMessage: '',
  }),
  computed: {
    ...mapState([
      'ingredients',
      'categories',
    ]),
    ...mapGetters([
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
  created() {
    this.recipeIngredientsLocal = this.recipeIngredients;
  },
  updated() {
    this.recipeIngredientsLocal = this.recipeIngredients;
  },
  methods: {
    ...mapActions([
      'addIngredient',
    ]),
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
      this.ingredient.category = '';
      this.isNewIngredientManual = false;
    },
    setIngredient(ingredient) {
      this.ingredient = {
        ...this.ingredient,
        ...{ name: ingredient.name, id: ingredient.id },
      };
      this.infoMessage = '';
      this.$refs.amountInput.focus();
    },
    addIngredientToRecipe() {
      const mustUseSuggestions = this.suitableIngredients
        .some(item => item.name === this.ingredient.name);
      const suggestionsDontFit = this.suitableIngredients.length && this.ingredient.id === null;

      if (this.isNewIngredientComputed) {
        const newId = this.newIngredientId;

        this.addIngredient({
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
        this.recipeIngredientsLocal.push({
          id: this.ingredient.id,
          amount: this.ingredient.amount,
        });
        this.$emit('change', this.recipeIngredientsLocal);

        this.ingredient.name = '';
        this.ingredient.id = null;
        this.ingredient.amount = '';
      }
    },
    deleteIngredientFromRecipe(ingredientId) {
      this.recipeIngredientsLocal = this.recipeIngredientsLocal
        .filter(item => item.id !== ingredientId);
      this.$emit('change', this.recipeIngredientsLocal);
    },
  },
};
</script>

<style lang="scss">
  .recipe-ingredients-section {
    width: 320px;
    margin-bottom: 20px;
    padding: 15px 10px 0 25px;
    background-color: $color-main-2-light;

    .list {
      padding: 5px;
    }

    .list-title {
      margin-bottom: 5px;
      font-size: 14px;
    }

    .ingredient {
      display: flex;
      align-items: center;
      padding: 3px;

      &:hover {
        .delete-ingredient-button {
          opacity: 1;
        }
      }
    }

    .ingredient-name {
      width: fit-content;
      margin-right: 8px;
    }

    .delete-ingredient-button {
      position: relative;
      width: 15px;
      height: 15px;
      opacity: 0;
      transition: opacity 0.3s;

      &::before,
      &::after {
        content: '';
        position: absolute;
        top: 3px;
        right: 6px;
        width: 1px;
        height: 10px;
        background-color: $black;
      }

      &::before {
        transform: rotate(45deg);
      }

      &::after {
        transform: rotate(-45deg);
      }
    }

    .form {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      padding: 5px;
    }

    .input-ingredient,
    .select-category {
      width: 110px;
      margin-bottom: 20px;
      padding: 5px 5px 3px;
      border-bottom: 1px solid $black;
    }

    .select-category {
      width: 180px;
    }

    .add-ingredient-button {
      display: inline-block;
      position: relative;
      align-self: center;
      width: 20px;
      height: 20px;

      &::before,
      &::after {
        content: '';
        position: absolute;
        top: 0;
        right: 50%;
        width: 1px;
        height: 15px;
        background-color: $black;
      }

      &::after {
        transform: rotate(90deg);
      }
    }

    .message {
      margin-bottom: 10px;
      font-size: 13px;
    }

    .suggestions-area {
      height: auto;
      padding: 5px;
    }

    .suggestion {
      margin-bottom: 10px;
      margin-right: 8px;
      padding: 5px;
      border: 1px solid $gray-dark;

      &:hover {
        background-color: $color-main-2;
      }

      &:focus {
        background-color: $color-secondary;
      }
    }
  }
</style>
