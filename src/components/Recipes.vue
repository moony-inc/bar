<template>
  <div class="recipes">
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
