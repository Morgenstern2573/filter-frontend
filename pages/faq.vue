<template>
  <div class="flex justify-center items-start min-h-screen">
    <div class="w-4/5 mt-16 rounded shadow-md bg-white py-4 px-8 mx-auto">
      <h1 class="font-bold text-2xl my-4">Frequently Asked Questions</h1>
      <div class=" w-4/5 mx-auto border-b border-green-300">
        <dropdown v-for="(item, index) in content" :key="index">
          <template #question>
            {{ item.question }}
          </template>
          <template #answer>
            {{ item.answer }}
          </template>
        </dropdown>
      </div>
      <div class="flex w-full justify-center items-center mt-8">
        <p class="btn btn-green">
          <nuxt-link to="/">Back Home</nuxt-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import dropdown from "~/components/dropdown.vue";
export default {
  components: {
    dropdown
  },

  data() {
    return {
      content: [
        {
          question: "How do I use this thing in the first place?",
          answer: `Type in the course codes of the courses you're offering in the input field, one at a time.
                    Use the add button or the enter key to add that course to the course list.
                    You'll see the courses you've set so far added in the course list. The reset button empties the course list,
                    and delete last deletes the last course you entered. When you've added all the courses you want, hit the generate button.`
        },
        {
          question: "Why isn't my course code in the database?",
          answer: `The codes in the database come from the official timetable,
          and the school recently changed those.If you're sure the code is correct, try the other version.
           To illustrate, if PHS 216 doesn't exist, try the old code, PHS 206, and vice versa.
           The version on the official timetable is what will exist in the database.`
        },
        {
          question:
            "Why can i only input codes one at a time, and why can't I edit the course list manually?",
          answer: `It makes the data (much)easier to process`
        },
        {
          question: "I've noticed a bug. Where can I complain?",
          answer: "Shoot me an email at p.akinyemi@yahoo.com"
        },
        {
          question: "Why only Faculty of Science?",
          answer:
            "Sorry 'bout that. I'm still working on including other faculties into the database"
        }
      ]
    };
  }
};
</script>

<style scoped>
.btn {
  @apply py-1 px-2 rounded shadow text-white text-center mx-2 cursor-pointer;
}

.btn-green {
  @apply bg-green-600;
}
</style>
