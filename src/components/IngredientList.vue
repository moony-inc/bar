<template>
  <div class="ingredients-list">
     <div
        v-for="category in categoriesToShow"
        :key="category.value"
    >
      {{ category.name }}
      <div
        v-for="ingredient in ingredientsToShow(category)"
        :key="ingredient.id"
      >
        {{ ingredient.name }}
        <button
          type="button"
          @click="deleteIngredient(ingredient)"
        >x</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  computed: {
    ...mapState([
      'ingredients',
      'categories',
    ]),
    categoriesToShow() {
      return this.categories
        .filter(category => this.ingredients
          .find(ingredient => ingredient.category === category.value));
    },
    ingredientsToShow() {
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
