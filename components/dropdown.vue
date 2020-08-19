<template>
  <div class="mx-auto">
    <div
      class="border-t border-green-300 cursor-pointer py-2 px-4"
      @click="active = !active"
    >
      <div class="flex justify-between">
        <span class="text-lg"><slot name="question"></slot></span>
        <span v-show="active == true" class="text-green-600">&#x25B2;</span>
        <span v-show="active == false">&#x25BC;</span>
      </div>
      <p v-show="active" class="mt-8 text-gray-600">
        <slot name="answer"></slot>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return { active: false };
  }
};
</script>

<style></style>
