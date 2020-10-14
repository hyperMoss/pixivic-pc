<template>
  <img
    :src="computerSrc"
    alt=""
    :style="{width:width+'px',height:width+'px',objectFit:'cover'}"
  >
</template>

<script>
import pathJSON from '@/assets/sticker/path.json'
export default {
 name: 'Sticker',
  components: {},
  props:{
    code: {
      required:true,
      type: String,
      default: ''
    },
    width:{
      type: [Number,String],
      default: 20
    }
  },
  data() {
    return {

    }
  },
  computed:{
    computerSrc(){
      return require('@/assets/'+pathJSON[this.$props.code])
    }
  },
  mounted() {},
  methods: {

  },
}
</script>
