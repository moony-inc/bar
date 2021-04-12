<template>
  <div class="recipes">
    <h1>рецепты</h1>
    <RecipeList />
    <RecipeForm />
  </div>
</template>

<script>
import RecipeList from '@/components/RecipeList.vue';
import RecipeForm from '@/components/RecipeForm.vue';

export default {
  components: { RecipeList, RecipeForm },
};
</script>

<style lang="scss">
  .recipes {

    h1 {
      margin-top: 0;
      font-size: 22px;
    }

  }
</style>
