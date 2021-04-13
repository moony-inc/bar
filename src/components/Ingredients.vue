<template>
  <div class="ingredients">
    <h1>ингредиенты</h1>
    <IngredientList />
    <form @submit.prevent="addIngredient">
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

    h1 {
      margin-top: 0;
      font-size: 22px;
    }

    form {
      display: flex;
      flex-direction: column;
      width: 150px;
      margin-top: 40px;
    }

    input,
    select,
    button {
      margin-bottom: 10px;
    }

  }
</style>
