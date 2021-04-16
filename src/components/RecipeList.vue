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
        <span
          v-for="ingredient in recipe.ingredients"
          :key="ingredient.id"
        >
          {{ ingredientNameById(ingredient.id) }} {{ ingredient.amount + '; ' }}
        </span>
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
        title: 'почти могу сделать',
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
        case 'almost-can-do':
          break;
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
  }
</style>
