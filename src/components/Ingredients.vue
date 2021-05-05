<template>
  <div class="ingredients">
    <IngredientList />
    <form
      class="add-form"
      @submit.prevent="addIngredient"
    >
      <h2 class="form-title">новый игредиент</h2>
      <label>
        <span class="label-text">ингредиент</span>
        <input
          class="input-name"
          type="text"
          v-model="ingredientName"
        >
      </label>
      <label>
        <span class="label-text">категория</span>
        <div class="select-container">
          <select
            class="select-category"
            v-model="selectedCategory"
            required
          >
            <option
              v-for="category in categories"
              :value="category.value"
              :key="category.value"
            >
              {{ category.name }}
            </option>
          </select>
        </div>
      </label>
      <button
        class="add-button"
        type="submit"
      ></button>
    </form>
  </div>
</template>

<script>
import IngredientList from '@/components/IngredientList.vue';
import { mapState, mapGetters, mapActions } from 'vuex';

export default {
  components: { IngredientList },
  data: () => ({
    ingredientName: '',
    selectedCategory: '',
  }),
  computed: {
    ...mapState([
      'categories',
    ]),
    ...mapGetters([
      'newIngredientId',
    ]),
  },
  methods: {
    ...mapActions({
      addIngredientStore: 'addIngredient',
    }),
    addIngredient() {
      this.addIngredientStore({
        name: this.ingredientName,
        category: this.selectedCategory,
        availability: false,
        id: this.newIngredientId,
      });
      this.ingredientName = '';
      this.selectedCategory = '';
    },
  },
};
</script>

<style lang="scss">
  .ingredients {
    width: 250px;
    margin-left: auto;
    margin-right: auto;

    .add-form {
      width: 230px;
      margin-left: auto;
      margin-right: auto;
    }

    .form-title {
      margin-bottom: 15px;
      text-align: center;
      font-size: 18px;
    }

    .label-text {
      display: block;
      font-size: 13px;
    }

    .input-name,
    .select-category {
      margin-bottom: 15px;
      padding: 10px 5px 3px;
      border-bottom: 1px solid $black;
    }

    .input-name {
      width: 230px;
    }

    .select-category {
      width: 200px;
      margin-right: 10px;
      appearance: none;
      cursor: pointer;
    }

    .select-container {
      display: inline-block;
      position: relative;
      width: auto;

      &::before {
        content: '';
        position: absolute;
        top: 10px;
        right: 18px;
        border-bottom: 1px solid $black;
        border-right: 1px solid $black;
        width: 10px;
        height: 10px;
        transform: rotate(45deg);
      }
    }

    .add-button {
      display: inline-block;
      position: relative;
      width: 20px;
      height: 20px;

      &::before,
      &::after {
        content: '';
        position: absolute;
        top: 0;
        right: 50%;
        width: 1px;
        height: 18px;
        background-color: $black;
      }

      &::after {
        transform: rotate(90deg);
      }
    }
  }
</style>
