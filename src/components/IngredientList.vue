<template>
  <div class="ingredient-list">
    <h1 class="title">ингредиенты</h1>
    <div
      v-for="category in categoriesToShow"
      :key="category.value"
    >
      <h2 class="category-title">{{ category.name }}</h2>
      <transition-group name="fade">
        <div
          class="ingredient"
          v-for="ingredient in ingredientsByCategory(category)"
          :key="ingredient.id"
        >
          <label class="availability-button">
            <span>{{ ingredient.name }}</span>
            <input
              class="checkbox"
              type="checkbox"
              :checked="ingredient.availability"
              @change="setIngredientAvailability({
                ingredientId: ingredient.id,
                value: $event.target.checked,
              })"
            >
          </label>
          <button
            class="delete-button"
            type="button"
            :disabled="usingIngredientInRecipesById(ingredient.id)"
            :title="usingIngredientInRecipesById(ingredient.id) ? 'ингредиент используется' : ''"
            @click="deleteIngredient(ingredient.id)"
          >x</button>
        </div>
      </transition-group>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';

export default {
  computed: {
    ...mapState([
      'ingredients',
      'categories',
    ]),
    ...mapGetters([
      'usingIngredientInRecipesById',
    ]),
    categoriesToShow() {
      return this.categories
        .filter(category => this.ingredients
          .find(ingredient => ingredient.category === category.value));
    },
    ingredientsByCategory() {
      return category => this.ingredients.filter(item => item.category === category.value);
    },
  },
  methods: {
    ...mapActions([
      'setIngredientAvailability',
      'deleteIngredient',
    ]),
  },
};
</script>

<style lang="scss">
  .ingredient-list {
    margin-bottom: 70px;

    .title {
      margin-bottom: 10px;
      text-align: center;
      font-size: 22px;
      letter-spacing: 0.5px;
    }

    .category-title {
      margin-bottom: 10px;
      padding: 5px;
      padding-top: 10px;
      border-bottom: 1px solid $black;
      font-size: 18px;
      font-weight: normal;
    }

    .ingredient {
      position: relative;
      width: 250px;
      padding: 10px;

      &:hover {
        .delete-button {
          opacity: 1;
        }
      }
    }

    .availability-button {
      display: flex;
      flex-direction: row-reverse;
      justify-content: flex-end;
      align-items: center;
    }

    .checkbox {
      margin-right: 8px;
      cursor: pointer;
    }

    .delete-button {
      position: absolute;
      top: 10px;
      right: 10px;
      width: 20px;
      height: 20px;
      border: none;
      opacity: 0;
      background-color: transparent;
      color: transparent;
      cursor: pointer;
      transition: opacity 0.3s;

      &::before {
        content: '';
        display: block;
        position: absolute;
        top: 1px;
        right: 8px;
        width: 1px;
        height: 15px;
        background-color: $black;
        transform: rotate(45deg);
      }

      &::after {
        content: '';
        display: block;
        position: absolute;
        top: 1px;
        right: 8px;
        width: 1px;
        height: 15px;
        background-color: $black;
        transform: rotate(-45deg);
      }

      &:disabled {
        cursor: default;

        &::before,
        &::after {
          background-color: $gray-dark;
        }
      }
    }

    .fade-enter-active,
    .fade-leave-active {
      transition: opacity 0.3s;
    }

    .fade-enter,
    .fade-leave-to {
      opacity: 0;
    }
  }
</style>
