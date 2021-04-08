<template>
  <div class="ingredients">
    <IngredientList />
    <form @submit.prevent="addIngredient">
      <input
        type="text"
        v-model="ingredientName"
      >
      <select
        required
        v-model="selectedCategory"
      >
        <option
          v-for="(category, index) in categories"
          :value="category.value"
          :key="index"
        >
          {{ category.caption }}
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
      'newIdByCategory',
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
        id: this.newIdByCategory(this.selectedCategory),
      });
      this.ingredientName = '';
    },
  },
};
</script>
