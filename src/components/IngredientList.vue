<template>
  <div class="ingredient-list">
    <div
      v-for="category in categoriesToShow"
      :key="category.value"
    >
      <h2 class="category-title">{{ category.name }}</h2>
      <div
        class="ingredient"
        v-for="ingredient in ingredientsByCategory(category)"
        :key="ingredient.id"
      >
        <label>
          <span>{{ ingredient.name }}</span>
          <input
            type="checkbox"
            :checked="ingredient.availability"
            @change="setIngredientAvailability({
              ingredientId: ingredient.id,
              value: $event.target.checked,
            })"
          >
        </label>
        <button
          class="delete-button"
          type="button"
          :disabled="usingIngredientInRecipesById(ingredient.id)"
          :title="usingIngredientInRecipesById(ingredient.id) ? 'ингредиент используется' : ''"
          @click="deleteIngredient(ingredient.id)"
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
      'setIngredientAvailability',
      'deleteIngredient',
    ]),
  },
};
</script>

<style lang="scss">
  .ingredient-list {
    .category-title {
      font-size: 18px;
      margin-bottom: 8px;
    }

    .ingredient {
      position: relative;
      width: 150px;
      padding: 8px;
      margin-bottom: 5px;
      background-color: rgba(199, 128, 240, 0.2);
    }

    .delete-button {
      position: absolute;
      top: 6px;
      right: 5px;
      padding: 0 3px;
    }
  }
</style>
