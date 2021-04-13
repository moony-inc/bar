<template>
  <div class="recipe-list">
    <div
      class="recipe"
      v-for="recipe in recipes"
      :key="recipe.id"
    >
      <h2 class="recipe-title">{{ recipe.name }}</h2>
      <span
        v-for="ingredient in recipe.ingredients"
        :key="ingredient.id"
      >
        {{ ingredientNameById(ingredient.id) }} {{ ingredient.amount+'; ' }}
      </span>
      <div>
        {{"метод: "}}{{ recipe.method }}
        {{"посуда: "}}{{ recipe.drinkware }}
      </div>
      <button
        class="delete-recipe-button"
        type="button"
        @click="deleteRecipe(recipe.id)"
      >X</button>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';

export default {
  computed: {
    ...mapState([
      'recipes',
      'ingredients',
    ]),
    ...mapGetters([
      'ingredientNameById',
    ]),
  },
  methods: {
    ...mapActions([
      'deleteRecipe',
    ]),
  },
};
</script>

<style lang="scss">
  .recipe-list {

    .recipe {
      position: relative;
      padding: 15px;
      margin-bottom: 20px;
      background-color: rgba(114, 221, 198, 0.3);
    }

    .recipe-title {
      font-size: 18px;
      margin: 0;
      margin-bottom: 5px;
    }

    .delete-recipe-button {
      position: absolute;
      top: 10px;
      right: 10px;
      padding: 0 3px;
    }
  }
</style>
