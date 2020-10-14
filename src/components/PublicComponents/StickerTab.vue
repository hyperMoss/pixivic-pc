<template>
  <div class="StickerTab">
    <el-tabs type="border-card">
      <el-tab-pane
        v-for="item of stickerList"
        :key="item.name"
        :label="item.name"
      >
        <div class="sticker-list">
          <el-scrollbar
            style="height:100%"
          >
            <Sticker
              v-for="code of item.ids"
              :key="code"
              :code="`[${item.name}_${code}]`"
              width="80"
              @click.native="chooseSticker(`[${item.name}_${code}]`)"
            />
          </el-scrollbar>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import stickerJSON from '@/assets/sticker/sticker.json'
import Sticker from 'components/PublicComponents/Sticker';
export default {
 name: 'StickerTab',
  components: {Sticker},
  computed:{
    stickerList(){
      return  Object.keys(stickerJSON).map(e=> {return {name:e,ids:stickerJSON[e]}})
    }
  },
  methods: {
    chooseSticker(e){
      this.$emit('submit',e);
    }
  },
}
</script>

<style scoped lang="less">

.StickerTab{
  .sticker-list{
    //display: grid;
    //grid-template-rows: repeat(4, 80px);
    //grid-template-columns: repeat(6, 80px);
    //overflow-y: scroll;
    height: 340px;
    width: 410px;
    /deep/.el-scrollbar__wrap{
      overflow-x: hidden;
    }
  }
}
</style>
