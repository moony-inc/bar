<template>
  <div class="ingredients-list">
     <div
        v-for="category in categories"
        v-show="ingredients.find(item => item.category === category.value)"
        :key="category.value"
    >
      {{ category.name }}
      <div
        v-for="ingredient in ingredients.filter(item => item.category === category.value)"
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
  },
  methods: {
    ...mapActions([
      'deleteIngredient',
    ]),
  },
};
</script>
