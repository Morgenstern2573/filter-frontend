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
      <svg
        class="close-icon"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        aria-hidden="true"
        focusable="false"
        width="1em"
        height="1em"
        style="vertical-align: -0.125em;-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); transform: rotate(360deg);"
        preserveAspectRatio="xMidYMid meet"
        viewBox="0 0 24 24"
      >
        <path
          d="M12 2c5.53 0 10 4.47 10 10s-4.47 10-10 10S2 17.53 2 12S6.47 2 12 2m3.59 5L12 10.59L8.41 7L7 8.41L10.59 12L7 15.59L8.41 17L12 13.41L15.59 17L17 15.59L13.41 12L17 8.41L15.59 7z"
          fill="#fff"
        />
      </svg>
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
