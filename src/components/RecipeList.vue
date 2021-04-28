<template>
  <div
    class="recipe-list"
    @click="hideSidebar"
  >
    <h1 class="title">рецепты</h1>
    <div class="display-modes">
      <label
        class="mode-button"
        :class="{ active: displayMode === mode.value }"
        v-for="mode in displayModes"
        :key="mode.value"
      >
        <span>{{ mode.title }}</span>
        <input
          class="radio-button"
          type="radio"
          :value="mode.value"
          v-model="displayMode"
        >
      </label>
    </div>
    <masonry
      :cols="{default: 4, 1280: 3, 900: 2, 500: 1}"
      :gutter="30"
    >
      <div
        class="recipe"
        v-for="recipe in recipesToShow"
        :key="recipe.id"
      >
        <h2 class="recipe-title">{{ recipe.name }}</h2>
        <div class="ingredients-container">
          <div
            class="ingredient"
            :class="{ absent: ingredient.absence }"
            v-for="ingredient in recipe.ingredients"
            :key="ingredient.id"
          >
            {{ ingredientNameById(ingredient.id) + ' - ' }} {{ ingredient.amount }}
          </div>
        </div>
        <div class="method"><span class="semibold">{{"метод: "}}</span>{{ recipe.method }}</div>
        <div><span class="semibold">{{"посуда: "}}</span>{{ recipe.drinkware }}</div>
        <button
          class="edit-button"
          type="button"
          @click.stop="editRecipe(recipe.id)"
        >edit</button>
        <button
          class="delete-button"
          type="button"
          @click="deleteRecipe(recipe.id)"
        >X</button>
      </div>
    </masonry>
  </div>
</template>

<script>
import Vue from 'vue';
import VueMasonry from 'vue-masonry-css';
import {
  mapState,
  mapGetters,
  mapMutations,
  mapActions,
} from 'vuex';

Vue.use(VueMasonry);

const RECIPE_INGREDIENTS_CHECKPOINT = 5;
const LOWER_CHECKPOINT_COEFFICIENT = 0.5;
const HIGHER_CHECKPOINT_COEFFICIENT = 0.4;

export default {
  data: () => ({
    displayModes: [
      {
        title: 'все',
        value: 'recipes',
      },
      {
        title: 'могу сделать',
        value: 'can-do',
      },
      {
        title: 'чего-то не хватает',
        value: 'almost-can-do',
      },
    ],
    displayMode: 'recipes',
  }),
  computed: {
    ...mapState([
      'recipes',
      'ingredients',
    ]),
    ...mapGetters([
      'ingredientNameById',
    ]),
    recipesToShow() {
      let recipesToShow = [];

      switch (this.displayMode) {
        case 'can-do':
          recipesToShow = this.recipes
            .filter(recipe => !this.ingredients
              .some(ingredient => (
                recipe.ingredients.some(item => item.id === ingredient.id)
                && !ingredient.availability
              )));
          break;
        case 'almost-can-do': {
          const filteredRecipes = this.recipes.filter(recipe => {
            let limit = 0;
            const absentIngredients = recipe.ingredients.reduce((sum, item) => (
              this.checkIngredientAvailability(item.id) ? sum : sum + 1),
            0);

            if (absentIngredients) {
              limit = recipe.ingredients.length * (
                absentIngredients < RECIPE_INGREDIENTS_CHECKPOINT
                  ? LOWER_CHECKPOINT_COEFFICIENT
                  : HIGHER_CHECKPOINT_COEFFICIENT
              );
            }

            return absentIngredients && absentIngredients <= limit;
          });

          recipesToShow = filteredRecipes.map(recipe => {
            const modifiedIngredients = recipe.ingredients.map(item => ({
              ...item,
              absence: !this.checkIngredientAvailability(item.id),
            }));

            return {
              ...recipe,
              ingredients: modifiedIngredients,
            };
          });
          break;
        }
        default:
          recipesToShow = this.recipes;
      }

      return recipesToShow;
    },
  },
  methods: {
    ...mapMutations([
      'showSidebar',
      'hideSidebar',
      'setRecipeIdForEditing',
    ]),
    ...mapActions([
      'deleteRecipe',
    ]),
    checkIngredientAvailability(ingredientId) {
      return this.ingredients.find(item => item.id === ingredientId).availability;
    },
    editRecipe(recipeId) {
      this.setRecipeIdForEditing(recipeId);
      this.showSidebar('recipe-form');
    },
  },
};
</script>

<style lang="scss">
  .recipe-list {
    width: 100%;
    max-width: 1300px;
    margin-left: auto;
    margin-right: auto;
    padding: 30px;
    overflow: auto;

    .title {
      margin-bottom: 20px;
      font-size: 22px;
      letter-spacing: 0.5px;
    }

    .display-modes {
      display: flex;
      margin-bottom: 20px;
    }

    .radio-button {
      position: absolute;
      z-index: -1;
      opacity: 0;
    }

    .mode-button {
      display: block;
      margin-right: 10px;
      padding: 5px 10px;
      border: none;
      background-color: $main-2;
      cursor: pointer;
      transition-duration: 0.2s;

      &:hover {
        background-color: $main-2-light;
      }

      &.active {
        background-color: $secondary;
      }
    }

    .recipe {
      display: flex;
      flex-direction: column;
      position: relative;
      margin-bottom: 30px;
      padding: 25px;
      padding-top: 20px;

      &::before {
        content: '';
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        z-index: -1;
        width: 100%;
        height: 100%;
        background-color: $main-1;
        transition: transform 0.3s;
      }

      &:hover {
        .edit-button,
        .delete-button
          {
          opacity: 1;
        }

        &::before {
          transform: scale(1.05);
        }
      }
    }

    .recipe-title {
      margin-bottom: 15px;
      font-size: 18px;
    }

    .ingredients-container {
      align-self: center;
      width: 105%;
      margin-bottom: 15px;
      padding: 5px;
      background-color: $main-1-light;
    }

    .ingredient {
      width: fit-content;
      padding: 3px 4px;

      &.absent {
        background-color: $secondary-highlight;
      }
    }

    .method {
      margin-bottom: 15px;
      line-height: 1.4;
    }

    .edit-button {
      position: absolute;
      top: 15px;
      right: 35px;
      padding: 5px;
      border: none;
      opacity: 0;
      background-color: transparent;
      cursor: pointer;
      transition: opacity 0.3s;
    }

    .delete-button {
      position: absolute;
      top: 20px;
      right: 10px;
      width: 20px;
      height: 20px;
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
        top: 1px;
        right: 8px;
        width: 1px;
        height: 15px;
        background-color: $black;
        transform: rotate(45deg);
      }

      &::after {
        content: '';
        display: block;
        position: absolute;
        top: 1px;
        right: 8px;
        width: 1px;
        height: 15px;
        background-color: $black;
        transform: rotate(-45deg);
      }
    }
  }
</style>
