<template>
  <div class="recipe-list">
    <div
        v-for="recipe in recipes"
        :key="recipe.id"
     >
      {{ recipe.name }}
      <button
        type="button"
        @click="deleteRecipe(recipe)"
      >X</button>
        <div
          v-for="ingredient in recipe.ingredients"
          :key="ingredient.id"
        >
          {{ ingredients.find(item => item.id === ingredient.id).name }}
          {{ ingredient.amount }}
        </div>
      {{ recipe.method }}
      {{ recipe.glass }}
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState([
      'recipes',
      'ingredients',
    ]),
  },
};
</script>
