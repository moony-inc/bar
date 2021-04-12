<template>
  <div class="ingredient-list">
    <div
      v-for="category in categoriesToShow"
      :key="category.value"
    >
      <h2>{{ category.name }}</h2>
      <div
        class="ingredient"
        v-for="ingredient in ingredientsByCategory(category)"
        :key="ingredient.id"
      >
        {{ ingredient.name }}
        <button
          type="button"
          :disabled="usingIngredientInRecipesById(ingredient.id)"
          :title="usingIngredientInRecipesById(ingredient.id) ? 'ингредиент используется' : ''"
          @click="deleteIngredient(ingredient)"
        >x</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';

export default {
  computed: {
    ...mapState([
      'ingredients',
      'categories',
    ]),
    ...mapGetters([
      'usingIngredientInRecipesById',
    ]),
    categoriesToShow() {
      return this.categories
        .filter(category => this.ingredients
          .find(ingredient => ingredient.category === category.value));
    },
    ingredientsByCategory() {
      return category => this.ingredients.filter(item => item.category === category.value);
    },
  },
  methods: {
    ...mapActions([
      'deleteIngredient',
    ]),
  },
};
</script>

<style lang="scss">
  .ingredient-list {

    h2 {
      margin: 5px 0;
      font-size: 18px;
    }

    .ingredient {
      margin-left: 15px;
    }

    button {
      padding: 0 3px;
    }

  }
</style>
