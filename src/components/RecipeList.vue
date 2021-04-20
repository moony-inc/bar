<template>
  <div class="recipe-list">
    <div class="display-modes">
      <label
        v-for="mode in displayModes"
        :key="mode.value"
      >
        <span>{{ mode.title }}</span>
        <input
          type="radio"
          :value="mode.value"
          v-model="displayMode"
        >
      </label>
    </div>
    <div>
      <div
        class="recipe"
        v-for="recipe in recipesToShow"
        :key="recipe.id"
      >
        <h2 class="recipe-title">{{ recipe.name }}</h2>
        <div
          v-for="ingredient in recipe.ingredients"
          :key="ingredient.id"
          :class="{ absent: ingredient.absence }"
        >
          {{ ingredientNameById(ingredient.id) }} {{ ingredient.amount + '; ' }}
        </div>
        <div>{{"метод: "}} {{ recipe.method }}</div>
        <div>{{"посуда: "}} {{ recipe.drinkware }}</div>
        <button
          class="delete-button"
          type="button"
          @click="deleteRecipe(recipe.id)"
        >X</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';

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
    ...mapActions([
      'deleteRecipe',
    ]),
    checkIngredientAvailability(ingredientId) {
      return this.ingredients.find(item => item.id === ingredientId).availability;
    },
  },
};
</script>

<style lang="scss">
  .recipe-list {
    .recipe {
      position: relative;
      padding: 15px;
      margin-bottom: 20px;
      background-color: rgba(114, 221, 198, 0.3);
    }

    .recipe-title {
      font-size: 18px;
      margin: 0;
      margin-bottom: 5px;
    }

    .delete-button {
      position: absolute;
      top: 10px;
      right: 10px;
      padding: 0 3px;
    }

    .absent {
      background-color: rgba(188, 224, 24, 0.281);
    }
  }
</style>
