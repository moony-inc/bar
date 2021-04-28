<template>
  <form
    class="recipe-form"
    @submit.prevent="addRecipe"
  >
    <h1 class="title">{{ recipeIdForEditing === null ? 'новый рецепт' : 'редактирование' }}</h1>
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
      <div class="ingredient-list">
        <h2 class="ingredient-list-title">{{ 'ингредиенты:' }}</h2>
        <transition-group name="fade">
          <div
            class="ingredient"
            v-for="ingredient in recipeIngredients"
            :key="ingredient.id"
          >
            <div class="ingredient-name">
              {{ ingredientNameById(ingredient.id) + ' - ' }}
              {{ ingredient.amount }}
            </div>
            <button
              class="delete-ingredient-button"
              type="button"
              @click="deleteIngredientFromRecipe(ingredient.id)"
            >x</button>
          </div>
        </transition-group>
      </div>
      <form
        class="ingredient-form"
        @submit.stop.prevent="addIngredientToRecipe"
      >
        <label>
          <span class="label-text">что</span>
          <input
            class="input ingredient-input"
            type="text"
            :value="ingredient.name"
            @input="updateIngredientName"
            required
          >
        </label>
        <label>
          <span class="label-text">сколько</span>
          <input
            class="input ingredient-input"
            type="text"
            v-model="ingredient.amount"
            ref="amountInput"
            required
          >
        </label>
        <button
          class="add-ingredient-button"
          type="submit"
        >+</button>
        <transition name="fade">
        <div
          class="suggestions-area"
          v-if="!isNewIngredientManual && suitableIngredients.length"
        >
          <div>{{ infoMessage }}</div>
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
              class="input ingredient-input"
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
    <label>
      <span class="label-text">метод</span>
      <textarea
        class="input"
        rows="1"
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
      :disabled="!recipeIngredients.length || ingredient.name.length > 0"
    >{{ recipeIdForEditing === null ? 'добавить рецепт' : 'сохранить' }}</button>
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
      'recipeIdForEditing',
    ]),
    ...mapGetters([
      'newRecipeId',
      'ingredientNameById',
      'newIngredientId',
      'recipeById',
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
    isNewRecipe() {
      return this.recipeIdForEditing === null;
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
    recipeIdForEditing: {
      handler: function a() {
        this.setRecipeForEditing();
      },
      immediate: true,
    },
  },
  methods: {
    ...mapActions({
      addRecipeStore: 'addRecipe',
      addIngredientStore: 'addIngredient',
      updateRecipe: 'updateRecipe',
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
      this[this.isNewRecipe ? 'addRecipeStore' : 'updateRecipe']({
        name: this.recipeName,
        ingredients: this.recipeIngredients,
        method: this.method,
        drinkware: this.drinkware,
        id: this.isNewRecipe ? this.newRecipeId : this.recipeIdForEditing,
      });

      this.recipeName = '';
      this.recipeIngredients = [];
      this.method = '';
      this.drinkware = '';
    },
    setRecipeForEditing() {
      if (this.isNewRecipe) {
        this.recipeName = '';
        this.recipeIngredients = [];
        this.method = '';
        this.drinkware = '';
      } else {
        const recipeToEdit = JSON.parse(JSON.stringify(this.recipeById(this.recipeIdForEditing)));

        this.recipeName = recipeToEdit.name;
        this.recipeIngredients = recipeToEdit.ingredients;
        this.method = recipeToEdit.method;
        this.drinkware = recipeToEdit.drinkware;
      }
    },
  },
};
</script>

<style lang="scss">
  .recipe-form {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 300px;
    margin-left: auto;
    margin-right: auto;

    .title {
      margin-bottom: 20px;
      text-align: center;
      font-size: 22px;
      letter-spacing: 0.5px;
    }

    .label-text {
      display: block;
      font-size: 13px;
    }

    .input {
      width: 250px;
      margin-bottom: 20px;
      padding: 10px 5px 3px;
      border: none;
      border-bottom: 1px solid $black;
      background-color: transparent;
      outline: none;
    }

    .ingredient-section {
      width: 320px;
      margin-bottom: 20px;
      padding: 15px 10px 0 25px;
      background-color: $main-2-light;
    }

    .ingredient-list {
      margin: 0;
      padding: 5px;
    }

    .ingredient-list-title {
      margin-bottom: 5px;
    }

    .ingredient {
      display: flex;
      align-items: center;
      padding: 5px;

      &:hover {
        .delete-ingredient-button {
          opacity: 1;
        }
      }
    }

    .ingredient-name {
      width: fit-content;
      margin-right: 10px;
    }

    .delete-ingredient-button {
      position: relative;
      width: 15px;
      height: 15px;
      border: none;
      opacity: 0;
      background-color: transparent;
      color: transparent;
      cursor: pointer;
      transition: opacity 0.3s;

      &::before {
        content: '';
        display: block;
        position: absolute;
        top: 3px;
        right: 6px;
        width: 1px;
        height: 10px;
        background-color: $black;
        transform: rotate(45deg);
      }

      &::after {
        content: '';
        display: block;
        position: absolute;
        top: 3px;
        right: 6px;
        width: 1px;
        height: 10px;
        background-color: $black;
        transform: rotate(-45deg);
      }
    }

    .ingredient-form {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      padding: 5px;
    }

    .ingredient-input {
      width: 110px;
      margin-bottom: 20px;
    }

    .add-ingredient-button {
      display: inline-block;
      position: relative;
      align-self: center;
      width: 20px;
      height: 20px;
      border: none;
      background-color: transparent;
      color: transparent;
      cursor: pointer;

      &::before {
        content: '';
        display: block;
        position: absolute;
        top: 0;
        right: 50%;
        width: 1px;
        height: 15px;
        background-color: $black;
      }

      &::after {
        content: '';
        display: block;
        position: absolute;
        top: 0;
        right: 50%;
        width: 1px;
        height: 15px;
        background-color: $black;
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
      margin-right: 5px;
      padding: 5px;
      border: 1px solid $gray-dark;
      background-color: transparent;
      cursor: pointer;

      &:hover {
        background-color: $main-2;
      }

      &:focus {
        background-color: $secondary;
      }
    }

    select.ingredient-input {
      width: 180px;
    }

    .add-recipe-button {
      align-self: center;
      padding: 8px;
      border: 1px solid $black;
      background-color: $main-2-light;
      cursor: pointer;

      &:disabled {
        border: 1px solid $gray-light;
        color: $gray-light;
        cursor: default;
      }
    }

    .fade-enter-active,
    .fade-leave-active {
      transition: opacity 0.3s;
    }

    .fade-enter,
    .fade-leave-to {
      opacity: 0;
    }
  }
</style>
