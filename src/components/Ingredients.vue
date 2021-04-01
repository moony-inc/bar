<template>
  <div class="ingredients">
    <IngredientList />
    <form @submit.prevent="addIngredient">
      <input type="text" v-model="ingredientName">
      <select required v-model="selectedCategory">
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
import { mapState, mapGetters, mapMutations } from 'vuex';

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
    ...mapMutations({
      addIngredientStore: 'addIngredient',
    }),
    getIngredientData() {
      return {
        name: this.ingredientName,
        category: this.selectedCategory,
        availability: true,
        id: this.newIdByCategory(this.selectedCategory),
      };
    },
    addIngredient() {
      this.addIngredientStore(this.getIngredientData());
      this.ingredientName = '';
    },
  },
};
</script>

<style lang="scss">
</style>
