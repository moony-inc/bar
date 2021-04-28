<template>
  <div
    class="sidebar"
    :class="{ 'show': sidebar.isShown }"
  >
    <div class="buttons-container">
      <button
        class="ingredients-button"
        :class="{ 'active': sidebar.mode === 'ingredients' }"
        @click="showSidebar('ingredients')"
      >ингредиенты</button>
      <button
        class="recipe-form-button"
        :class="{ 'active': sidebar.mode === 'recipe-form' }"
        @click="openAddRecipeForm"
      >рецепт</button>
    </div>
    <div class="sidebar-content">
      <transition name="delay">
        <div v-if="sidebar.mode === 'recipe-form'">
          <RecipeForm />
        </div>
        <div v-else-if="sidebar.mode === 'ingredients'">
          <Ingredients />
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import RecipeForm from '@/components/RecipeForm.vue';
import Ingredients from '@/components/Ingredients.vue';
import { mapState, mapMutations } from 'vuex';

export default {
  components: { RecipeForm, Ingredients },
  computed: {
    ...mapState([
      'sidebar',
    ]),
  },
  methods: {
    ...mapMutations([
      'showSidebar',
      'setRecipeIdForEditing',
    ]),
    openAddRecipeForm() {
      this.showSidebar('recipe-form');
      if (this.recipeIdForEditing !== null) {
        this.setRecipeIdForEditing(null);
      }
    },
  },
};
</script>

<style lang="scss">
  .sidebar {
    position: fixed;
    top: 0;
    right: 0;
    width: 420px;
    overflow: visible;
    transform: translateX(420px);
    transition: transform 0.5s;

    &.show {
        transform: translateX(0);
    }

    .buttons-container {
      position: absolute;
      top: 50px;
      left: 0;
      transform-origin: right bottom;
      transform: translateX(-100%) rotate(-90deg);
    }

    .recipe-form-button,
    .ingredients-button {
      padding: 5px 10px;
      border: none;
      background-color: $main-2;
      cursor: pointer;
      transition-duration: 0.3s;

      &.active {
        border: none;
        background-color: $secondary;
      }
    }

    .recipe-form-button {
      margin-left: 20px;
    }

    .sidebar-content {
      height: 100vh;
      padding: 40px 30px 100px;
      overflow: auto;
      background-color: $main-2;
    }

    .delay-leave {
      opacity: 1;
    }

    .delay-leave-active {
      transition: opacity 0.5s;
    }
  }
</style>
