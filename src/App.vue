<template>
  <Home />
</template>

<script>
import Home from '@/views/Home.vue';
import { mapActions } from 'vuex';

export default {
  components: { Home },
  created() {
    this.fetchCategories().then(() => {
      this.setupIngredients();
    });
  },
  methods: {
    ...mapActions([
      'fetchCategories',
      'setupIngredients',
    ]),
  },
};
</script>
