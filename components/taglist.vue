<script>
import tag from "~/components/tag";
export default {
  name: "TagList",

  components: {
    tag
  },

  props: {
    tags: {
      type: String,
      default: ""
    }
  },

  computed: {
    tagList() {
      let val = this.tags.split(",");
      val.splice(val.length - 1, 1);
      return val;
    }
  },

  data() {
    return {};
  }
};
</script>

<template>
  <div class="flex flex-wrap">
    <tag v-for="(i, idx) in tagList" :key="'tag' + idx" :content="i"></tag>
  </div>
</template>

<style></style>
