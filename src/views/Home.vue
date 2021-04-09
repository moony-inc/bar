<template>
  <div class="home">
    <Ingredients />
    <Recipes />
  </div>
</template>

<script>
import Ingredients from '@/components/Ingredients.vue';
import Recipes from '@/components/Recipes.vue';

export default {
  components: { Ingredients, Recipes },
};
</script>
