<template>
  <div class="ingredients">
    <h1 class="title">ингредиенты</h1>
    <IngredientList />
    <form
      class="add-form"
      @submit.prevent="addIngredient"
    >
      <input
        type="text"
        v-model="ingredientName"
      >
      <select
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
      <button type="submit">добавить</button>
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
        availability: true,
        id: this.newIngredientId,
      });
      this.ingredientName = '';
    },
  },
};
</script>

<style lang="scss">
  .ingredients {
    width: 250px;
    padding: 30px;

    .title {
      margin-top: 0;
      font-size: 22px;
    }

    .add-form {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      width: 150px;
      height: 80px;
      margin-top: 40px;
    }
  }
</style>
