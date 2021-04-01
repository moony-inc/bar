<template>
  <div>
    <div
      v-for="category in categories"
      v-show="ingredients[category.value].length"
      :key="category.value"
    >
      {{ category.caption }}
      <div
        v-for="ingredient in ingredients[category.value]"
        :key="ingredient.id"
      >
        {{ ingredient.name }}
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState([
      'ingredients',
      'categories',
    ]),
    categoriesWithIngredients() {
      return this.categories.filter(category => this.ingredients[category.value].length);
    },
    // cats() {
    //   return this.categories.map(category => {
    //     const result = { ...category };
    //     result.list = this.ingredients[category.value];
    //     result.isShown = result.list.length;
    //     console.log(result.list.length);

    //     return result;
    //   });
    // },
  },
};
</script>
