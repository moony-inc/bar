<template>
  <div class="ingredients-list">
    <div
      v-for="item in ingredients"
      v-show="item.ingredientList.length"
      :key="item.category.value"
    >
      {{ item.category.caption }}
      <div
        v-for="ingredient in item.ingredientList"
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
