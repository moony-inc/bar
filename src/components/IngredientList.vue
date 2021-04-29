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
            <input
              class="checkbox"
              type="checkbox"
              :checked="ingredient.availability"
              @change="setIngredientAvailability({
                ingredientId: ingredient.id,
                value: $event.target.checked,
              })"
            >
            <span>{{ ingredient.name }}</span>
          </label>
          <button
            class="delete-button"
            type="button"
            :disabled="usedIngredientInRecipeById(ingredient.id)"
            :title="usedIngredientInRecipeById(ingredient.id) ? 'ингредиент используется' : ''"
            @click="deleteIngredient(ingredient.id)"
          ></button>
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
      'usedIngredientInRecipeById',
    ]),
    categoriesToShow() {
      return this.categories
        .filter(category => this.ingredients
          .some(ingredient => ingredient.category === category.value));
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
      opacity: 0;
      transition: opacity 0.3s;

      &::before,
      &::after {
        content: '';
        display: block;
        position: absolute;
        top: 1px;
        right: 8px;
        width: 1px;
        height: 15px;
        background-color: $black;
      }

      &::before {
        transform: rotate(45deg);
      }

      &::after {
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
  }
</style>
