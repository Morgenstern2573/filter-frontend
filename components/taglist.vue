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
  },

  methods: {
    handleRemoveReq(content) {
      this.$emit("remove-req", content);
    }
  }
};
</script>

<template>
  <div class="flex flex-wrap">
    <tag
      v-for="(i, idx) in tagList"
      :key="'tag' + idx"
      :content="i"
      @remove-req="handleRemoveReq"
    ></tag>
  </div>
</template>

<style></style>
