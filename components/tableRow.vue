<template>
  <div class="flex bg-gray-200 justify-between py-1 border-b border-black">
    <span class="w-1/3 px-2 border-l border-r border-black">
      <slot name="time"></slot> </span
    ><span class="w-1/3 px-2 border-r border-black"
      ><slot name="code"></slot></span
    ><span class="w-1/3 px-2 border-r border-black"
      ><slot name="venue"></slot
    ></span>
  </div>
</template>

<script>
export default {};
</script>

<style></style>
