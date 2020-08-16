
<template>
  <div class="img-tags">
    <div>
      <li class="tags-containe">
        <ul v-for="item of tagslist" :key="item.name" class="tag-item" @click="clickTag(item)">
          <el-image
            :src="item.illustration.imageUrls[0].medium | replaceSmall"
            fit="cover"
            style="height:180px;width:180px"
          />
          <span class="tag-name">{{ item.name }}</span>
          <span class="tran-text">{{ item.translatedName }}</span>
        </ul>
      </li>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ImgTags',
  components: {},
  props: {
    tagslist: {
      required: true,
      type: Array
    }
  },
  data() {
    return {};
  },
  computed: {},
  watch: {},
  mounted() {},
  methods: {
    clickTag(item) {
      this.$emit('on-click', item);
    }
  }
};
</script>

<style scoped lang="less">
.img-tags {
  height: 550px;
  width: 560px;
  .tags-containe {
    list-style: none;
    display: grid;
    flex-wrap: wrap;
    grid-template-columns: repeat(auto-fit, 180px);
    -webkit-box-pack: center;
    justify-content: flex-start;
    margin: 0px;
    gap: 8px;
    padding: 0px;
    .tag-item {
      height: 180px;
      width: 180px;
      padding-inline-start: 0px;
      margin-block-start: 0;
      margin-block-end: 0;
      position: relative;
      .tag-name {
        position: absolute;
        bottom: 30px;
        right: 10px;
        text-shadow: #fff 1px 0 0, #fff 0 1px 0, #fff -1px 0 0, #fff 0 -1px 0;
      }
      .tran-text {
        position: absolute;
        bottom: 10px;
        right: 10px;
        text-shadow: #fff 1px 0 0, #fff 0 1px 0, #fff -1px 0 0, #fff 0 -1px 0;
      }
    }
  }
}
</style>
