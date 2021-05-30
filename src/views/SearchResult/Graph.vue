<template>
  <div class="graph">
    <VirtualList
      :list="pictureList"
      @infinite="infinite"
    />
  </div>
</template>

<script>
import VirtualList from '@/components/Virtual-List/VirtualList';

export default {
  name: 'Graph',
  components: {
    VirtualList,
  },
  data() {
    return {
      pictureList: [],
    };
  },
  methods: {
    infinite($state) {
      this.$api.search.searchByImg(this.$route.query.name)
        .then((res) => {
          const { data: { data } } = res;
          for (let i = 0; i < data.length; i++) {
            data[i].sanityLevel = 3;
          }
          this.pictureList = this.pictureList.concat(data) || [];
          $state.loaded();
          $state.complete();
        });
    },
  },
};
</script>

<style>
</style>
