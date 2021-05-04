<template>
  <Home />
</template>

<script>
import Home from '@/views/Home.vue';
import { mapActions, mapMutations } from 'vuex';

export default {
  components: { Home },
  created() {
    if (localStorage.getItem('hideTestData')) {
      this.hideTestData(true);
    } else {
      this.hideTestData(false);
    }

    this.fetchCategories().then(() => {
      this.setupIngredients();
      this.setupRecipes();
    });
  },
  methods: {
    ...mapMutations([
      'hideTestData',
    ]),
    ...mapActions([
      'fetchCategories',
      'setupIngredients',
      'setupRecipes',
    ]),
  },
};
</script>
