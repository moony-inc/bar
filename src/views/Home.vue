<template>
  <div class="home">
    <div class="ingredients-el">
      <Ingredients />
    </div>
    <div class="recipes-el">
      <Recipes />
    </div>
  </div>
</template>

<script>
import Ingredients from '@/components/Ingredients.vue';
import Recipes from '@/components/Recipes.vue';

export default {
  components: { Ingredients, Recipes },
};
</script>

<style lang="scss">
  .home {
    display: flex;
    justify-content: flex-start;

    .ingredients {
      margin: 20px;
      padding: 20px;
    }

    .recipes {
      margin: 20px;
      padding: 20px;
    }
  }
</style>
