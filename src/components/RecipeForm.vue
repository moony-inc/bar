<template>
  <form
    class="recipe-form"
    @submit.prevent="addRecipe"
  >
    <h1 class="title">{{ recipeIdForEditing === null ? 'новый рецепт' : 'редактирование' }}</h1>
    <label class="label-container">
      <span class="label-text">название</span>
      <input
        class="input"
        type="text"
        v-model="recipeName"
        required
      >
    </label>
    <RecipeIngredientsSection v-model="recipeIngredients"/>
    <label class="label-container">
      <span class="label-text">метод</span>
      <textarea
        class="input"
        rows="2"
        v-model="method"
        required
      >
      </textarea>
    </label>
    <label class="label-container">
      <span class="label-text">посуда</span>
      <input
        class="input"
        type="text"
        v-model="drinkware"
        required
      >
    </label>
    <button
      class="add-recipe-button"
      type="submit"
      :disabled="!recipeIngredients.length"
    >{{ recipeIdForEditing === null ? 'добавить рецепт' : 'сохранить' }}</button>
  </form>
</template>

<script>
import RecipeIngredientsSection from '@/components/RecipeIngredientsSection.vue';
import {
  mapState,
  mapGetters,
  mapMutations,
  mapActions,
} from 'vuex';

export default {
  components: { RecipeIngredientsSection },
  data: () => ({
    recipeName: '',
    recipeIngredients: [],
    method: '',
    drinkware: '',
  }),
  computed: {
    ...mapState([
      'recipes',
      'recipeIdForEditing',
    ]),
    ...mapGetters([
      'newRecipeId',
      'recipeById',
    ]),
    isNewRecipe() {
      return this.recipeIdForEditing === null;
    },
  },
  watch: {
    recipeIdForEditing: {
      handler: function recipeIdForEdittindHandler() {
        this.setRecipeForEditing();
      },
      immediate: true,
    },
  },
  methods: {
    ...mapMutations([
      'hideSidebar',
    ]),
    ...mapActions({
      addRecipeStore: 'addRecipe',
      updateRecipe: 'updateRecipe',
    }),
    clearForm() {
      this.recipeName = '';
      this.recipeIngredients = [];
      this.method = '';
      this.drinkware = '';
    },
    addRecipe() {
      this[this.isNewRecipe ? 'addRecipeStore' : 'updateRecipe']({
        name: this.recipeName,
        ingredients: this.recipeIngredients,
        method: this.method,
        drinkware: this.drinkware,
        id: this.isNewRecipe ? this.newRecipeId : this.recipeIdForEditing,
      });

      this.clearForm();

      if (!this.isNewRecipe) {
        this.hideSidebar();
      }
    },
    setRecipeForEditing() {
      if (this.isNewRecipe) {
        this.clearForm();
      } else {
        const recipeToEdit = JSON.parse(JSON.stringify(this.recipeById(this.recipeIdForEditing)));

        this.recipeName = recipeToEdit.name;
        this.recipeIngredients = recipeToEdit.ingredients;
        this.method = recipeToEdit.method;
        this.drinkware = recipeToEdit.drinkware;
      }
    },
  },
};
</script>

<style lang="scss">
  .recipe-form {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;

    .title {
      margin-bottom: 20px;
      text-align: center;
      font-size: 22px;
      letter-spacing: 0.5px;
    }

    .label-container {
      width: 65%;
    }

    .label-text {
      display: block;
      margin-bottom: 5px;
      font-size: 13px;
    }

    .input {
      width: 100%;
      margin-bottom: 20px;
      padding: 5px 5px 3px;
      border-bottom: 1px solid $black;
    }

    .add-recipe-button {
      padding: 8px;
      border: 1px solid $black;
      background-color: $color-main-2-light;

      &:disabled {
        border: 1px solid $gray-light;
        color: $gray-light;
        cursor: default;
      }
    }
  }
</style>
