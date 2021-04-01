<template>
  <div>
    <Home />
  </div>
</template>

<script>
import Home from '@/views/Home.vue';
import { mapActions } from 'vuex';

export default {
  components: { Home },
  created() {
    this.fetchCategories();
  },
  methods: {
    ...mapActions([
      'fetchCategories',
    ]),
  },
};
</script>
