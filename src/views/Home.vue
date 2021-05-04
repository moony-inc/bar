<template>
  <div class="home">
    <RecipeList
      class="main-content"
      :class="{ parallax: sidebar.isShown }"
    />
    <Sidebar />
    <div
      class="test-data"
      v-if="!testDataHidden"
    >
      <p><b>загрузить тестовые данные?</b></p>
      <div class="data-buttons-container">
        <button
        class="data-button"
        @click="fetchTestData"
        >загрузить</button>
        <button
        class="data-button"
        @click="hideTestData"
        >закрыть и больше не показывать</button>
      </div>
    </div>
  </div>
</template>

<script>
import Sidebar from '@/components/Sidebar.vue';
import RecipeList from '@/components/RecipeList.vue';
import { mapState, mapActions, mapMutations } from 'vuex';

export default {
  components: { Sidebar, RecipeList },
  computed: {
    ...mapState([
      'sidebar',
      'testDataHidden',
    ]),
  },
  methods: {
    ...mapMutations({
      hideTestDataStore: 'hideTestData',
    }),
    ...mapActions([
      'fetchTestData',
    ]),
    hideTestData() {
      localStorage.setItem('hideTestData', '1');
      this.hideTestDataStore(true);
    },
  },
};
</script>

<style lang="scss">
  .home {
    .main-content {
      transition: transform 0.8s;

      &.parallax {
        transform: translateX(-20px);
      }
    }

    .test-data {
      display: flex;
      flex-direction: column;
      align-items: center;
      position: absolute;
      bottom: 10%;
      left: 5%;
      width: 380px;
      height: 110px;
      padding: 5px;
      background-color: $color-main-1;
    }

    .data-buttons-container {
      display: flex;
      justify-content: space-between;
      width: 85%;
    }

    .data-button {
      width: 150px;
      height: 35px;
      font-size: 13px;
      background-color: $color-main-1-light;
      transition: background-color 0.3s;

      &:hover {
        background-color: $color-main-1;
      }
    }
  }
</style>
