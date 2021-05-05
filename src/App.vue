<template>
  <Home />
</template>

<script>
import Home from '@/views/Home.vue';
import { mapActions, mapMutations } from 'vuex';

export default {
  components: { Home },
  created() {
    if (!localStorage.getItem('hiddenTestData')) {
      this.switchTestDataMessage(true);
    }

    this.fetchCategories().then(() => {
      this.setupIngredients();
      this.setupRecipes();
    });
  },
  methods: {
    ...mapMutations([
      'switchTestDataMessage',
    ]),
    ...mapActions([
      'fetchCategories',
      'setupIngredients',
      'setupRecipes',
    ]),
  },
};
</script>
