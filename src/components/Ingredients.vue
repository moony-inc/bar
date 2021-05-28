<template>
  <div class="ingredients">
    <IngredientList />
    <form
      class="add-form"
      @submit.prevent="addIngredient"
    >
      <h2 class="form-title">новый игредиент</h2>
      <label class="label-container-ingredient">
        <span class="label-text">ингредиент</span>
        <input
          class="input-name"
          type="text"
          v-model="ingredientName"
        >
      </label>
      <div class="form-block">
        <label class="label-container-category">
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
      </div>
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
    width: 70%;
    margin-left: auto;
    margin-right: auto;

    .add-form {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
    }

    .form-title {
      margin-bottom: 15px;
      text-align: center;
      font-size: 18px;
    }

    .form-block,
    .label-container-ingredient {
      width: 90%;
    }

    .label-container-category {
      width: 85%;
    }

    .form-block {
      display: flex;
      justify-content: space-between;
    }

    .label-text {
      display: block;
      font-size: 13px;
    }

    .input-name,
    .select-category {
      width: 100%;
      margin-bottom: 15px;
      padding: 10px 5px 3px;
      border-bottom: 1px solid $black;
    }

    .select-category {
      appearance: none;
      cursor: pointer;
    }

    .select-container {
      position: relative;
      width: 100%;

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
      position: relative;
      align-self: center;
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

  @media screen and (max-width: $display-breakpoint-xs) {
    .ingredients {
      width: 80%;
    }
  }
</style>
