<script>
export default {
  name: "TagComponent",
  props: {
    content: {
      type: String,
      required: true
    }
  },
  methods: {
    handleRemoveReq() {
      this.$emit("remove-req", this.content);
    }
  }
};
</script>

<template>
  <div class="tagBody flex items-center">
    <p class="mr-2">
      {{ content }}
    </p>
    <span class="cursor-pointer" @click="handleRemoveReq">
      <span
        class="iconify close-icon"
        data-icon="mdi-close-circle"
        data-inline="true"
      ></span>
    </span>
  </div>
</template>

<style>
.tagBody {
  @apply px-2 py-1 m-2 shadow-sm rounded text-white bg-green-800;
  /* background-color: #abd1c6; */
}

.close-icon {
  width: 20px;
  height: 20px;
}
</style>
