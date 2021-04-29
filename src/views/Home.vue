<template>
  <div class="home">
    <RecipeList
      class="main-content"
      :class="{ parallax: sidebar.isShown }"
    />
    <Sidebar />
  </div>
</template>

<script>
import Sidebar from '@/components/Sidebar.vue';
import RecipeList from '@/components/RecipeList.vue';
import { mapState } from 'vuex';

export default {
  components: { Sidebar, RecipeList },
  computed: {
    ...mapState([
      'sidebar',
    ]),
  },
};
</script>

<style lang="scss">
  .home {
    .main-content {
      transition: transform 0.8s;
    }

    .parallax {
      transform: translateX(-20px);
    }
  }
</style>
