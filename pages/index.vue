<script>
import domtoimage from "dom-to-image";
import { getCodeList, getCourseData } from "~/lib/api.js";
import tableHeader from "~/components/tableHeader.vue";
import tableRow from "~/components/tableRow.vue";
import taglist from "~/components/taglist.vue";

// local storage object
const myStorage = window.localStorage;
const STORAGE_KEY = "generate-tt-course-code-list";

//The callback function used to sort courses based on their time
function compareTimes(timeOne, timeTwo) {
  if (!timeOne || !timeTwo) {
    return;
  }

  if (!Array.isArray(timeOne) || !Array.isArray(timeTwo)) {
    throw new Error("One argument passed to compareTimes is not an array");
  }

  let val1 = Number(timeOne[1].split("-")[0]);
  let val2 = Number(timeTwo[1].split("-")[0]);

  if (val1 < val2) {
    return -1;
  } else if (val1 == val2) {
    return 0;
  } else {
    return 1;
  }
}

export default {
  name: "IndexPage",

  components: {
    taglist
  },

  async asyncData() {
    let codeList = await getCodeList();
    let courseList = myStorage.getItem(STORAGE_KEY);
    if (!courseList) {
      courseList = "";
    }
    return { codeList, courseList };
  },

  data: function() {
    return {
      courseList: "",
      courseCode: "",
      notFound: [],
      isInputErr: false,
      inputErr: "",
      monCourses: [],
      tueCourses: [],
      wedCourses: [],
      thurCourses: [],
      friCourses: [],
      coursesGotten: false,
      isLoading: false,
      imgURL: ""
    };
  },

  components: {
    "table-header": tableHeader,
    "table-row": tableRow
  },

  methods: {
    validateCourseCode() {
      if (!this.courseCode) {
        return { status: "fail" };
      }

      // check if course code is comprised of whitespace only
      if (this.courseCode.trim() == "") {
        return { status: "fail" };
      }

      // check if course code has already been inputted
      if (this.courseList.includes(this.courseCode.toUpperCase())) {
        this.isInputErr = true;
        this.inputErr = "You've already added this course code!";
        return { status: "fail" };
      }

      // guard against excess whitespace in the middle
      let val = this.courseCode.trim().split(" ");
      val = val.filter(item => {
        return item != "";
      });

      // if the code wasn't spaced
      if (val.length < 2) {
        this.isInputErr = true;
        this.inputErr =
          "Put a space between the numbers and the letters. Eg: ABC 123";
        return { status: "fail" };
      }
      // if there's more than one code
      else if (val.length > 2) {
        this.isInputErr = true;
        this.inputErr = "Only input one course code at a time";
        return { status: "fail" };
      }
      // if it's not a code in the first place
      else if (
        !Number.isInteger(Number(val[1])) ||
        !val[0].match(/[a-zA-z]/g)
      ) {
        this.isInputErr = true;
        this.inputErr = "Input value must be a course code";
        return { status: "fail" };
      } else {
        return { status: "pass", val };
      }
    },

    storeCourseList() {
      // store list in local storage
      myStorage.setItem(STORAGE_KEY, this.courseList);
    },

    appendCourseCode() {
      let res = this.validateCourseCode();
      if (res.status == "fail") {
        return;
      } else {
        let val = res["val"];
        val = val[0].toUpperCase() + " " + val[1] + ",";
        this.courseList += val;
        this.courseCode = "";
        this.isInputErr = false;
        this.inputErr = "";

        this.storeCourseList();
      }
    },

    createTimetableImg(self) {
      domtoimage
        .toJpeg(document.getElementById("timetable"), { quality: 0.95 })
        .then(function(dataUrl) {
          self.imgURL = dataUrl;
        });
    },

    async generateTimeTable() {
      if (this.courseList != "") {
        //request for time table data
        this.isLoading = true;
        let data = await getCourseData(this.courseList);
        this.isLoading = false;

        if (data != undefined) {
          this.coursesGotten = true;
          //populate list of courses not found in the database
          this.notFound = data["not_found"];

          let codes = data["codes"],
            loctimes = data["times"];

          // group the returned courses by day of the week
          for (let i = 0; i < loctimes.length; i++) {
            for (let j = 0; j < loctimes[i].length; j++) {
              let item = loctimes[i][j];

              if (item[0] == "monday") {
                this.monCourses.push([codes[i], item[1], item[2]]);
              } else if (item[0] == "tuesday") {
                this.tueCourses.push([codes[i], item[1], item[2]]);
              } else if (item[0] == "wednesday") {
                this.wedCourses.push([codes[i], item[1], item[2]]);
              } else if (item[0] == "thursday") {
                this.thurCourses.push([codes[i], item[1], item[2]]);
              } else {
                this.friCourses.push([codes[i], item[1], item[2]]);
              }
            }
          }

          // sort grouped courses in ascending order by time
          this.monCourses.sort(compareTimes);
          this.tueCourses.sort(compareTimes);
          this.wedCourses.sort(compareTimes);
          this.thurCourses.sort(compareTimes);
          this.friCourses.sort(compareTimes);
        }

        setTimeout(() => {
          this.createTimetableImg(this);
        }, 500);
        // this.createTimetableImg();
      } else {
        return;
      }
    },

    resetTimetable() {
      this.coursesGotten = false;
      this.monCourses = [];
      this.tueCourses = [];
      this.wedCourses = [];
      this.thurCourses = [];
      this.friCourses = [];
      this.notFound = [];
    },

    handleRemoveReq(content) {
      let pos = this.courseList.indexOf(content);
      if (pos !== -1) {
        let pre = this.courseList.slice(0, pos),
          post = "";
        if (pos + content.length + 1 < this.courseList.length) {
          post = this.courseList.slice(pos + content.length + 1);
        }

        this.courseList = pre + post;
      }

      this.storeCourseList();
    },

    clearCourseList() {
      this.courseList = "";
      this.storeCourseList();
    },

    addLaggingZerosToTime(timeStr = "") {
      if (!timeStr) {
        return;
      }

      if (typeof timeStr !== "string") {
        return;
      }

      let [start, end] = timeStr.split("-");

      start = start + ":00";
      end = end + ":00";

      return [start, end].join(" - ");
    }
  },

  computed: {
    filteredData() {
      if (!this.codeList) {
        return;
      }

      if (this.codeList === []) {
        return;
      }

      if (!Array.isArray(this.codeList)) {
        return;
      }

      return this.codeList.filter(elem => {
        return elem.startsWith(this.courseCode.toUpperCase());
      });
    }
  }
};
</script>

<template>
  <div class=" flex min-h-screen justify-center items-center">
    <div class="flex items-center flex-col">
      <!-- course selection box -->
      <div
        v-if="!coursesGotten"
        class="rounded bg-white bg-opacity-25 shadow-md p-12 py-4 container"
      >
        <h1 class=" text-center text-3xl font-bold">TimeTable Generator</h1>
        <h2
          class="text-center text-sm font-mono font-light mb-4 text-green-800"
        >
          For the Faculty of Science, Unilag
        </h2>

        <div
          class="flex justify-center items-center flex-wrap"
          @keyup.enter="appendCourseCode"
        >
          <b-autocomplete
            v-model="courseCode"
            :data="filteredData"
            placeholder="Course Code here..."
            autofocus
          >
            <template slot="empty">No results found</template>
          </b-autocomplete>

          <p @click="appendCourseCode" class="btn btn-orange my-4 py-2 w-32">
            Add
          </p>
        </div>

        <div
          class="text-center text-red-800 bg-red-300 p-4 rounded-md w-full"
          v-show="isInputErr"
        >
          <p>{{ inputErr }}</p>
        </div>

        <div v-if="courseList.length > 0">
          <div class="flex justify-center items-center mt-4 flex-col">
            <div class="flex justify-between items-center w-full px-8">
              <p class="mr-2">Added Courses:</p>
              <!-- <b-button class="btn btn-orange" @click="clearCourseList"
                >Clear All</b-button
              > -->
            </div>
            <div class="flex items-center flex-wrap">
              <taglist
                :tags="courseList"
                @remove-req="handleRemoveReq"
              ></taglist>
            </div>
          </div>

          <div class="flex justify-center items-center mt-8">
            <b-button
              @click="generateTimeTable"
              class="btn btn-orange"
              style="width: 12rem"
              :loading="isLoading"
            >
              Generate TimeTable
            </b-button>
          </div>
        </div>

        <span class="text-center text-sm w-full block mt-4"
          >Confused about something? The FAQs are
          <nuxt-link class="underline text-green-600" to="/faq"
            >over here</nuxt-link
          ></span
        >
      </div>

      <!-- courses not found -->
      <div
        v-if="notFound.length > 0"
        class="text-center text-red-800 bg-red-300 p-4"
      >
        <span
          >Warning!The following course(s) were not found on the official
          timetable:</span
        >
        <span v-for="(item, index) in notFound" :key="index" class="mx-1">
          {{ item }}
        </span>
      </div>
    </div>
    <!-- generated timetable -->
    <div class="flex flex-col w-4/5" v-if="coursesGotten">
      <div
        id="timetable"
        style="background-color: #f3eff7;
  background-image: url(data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 20.5V18H0v-2h20v-2H0v-2h20v-2H0V8h20V6H0V4h20V2H0V0h22v20h2V0h2v20h2V0h2v20h2V0h2v20h2V0h2v20h2v2H20v-1.5zM0 20h2v20H0V20zm4 0h2v20H4V20zm4 0h2v20H8V20zm4 0h2v20h-2V20zm4 0h2v20h-2V20zm4 4h20v2H20v-2zm0 4h20v2H20v-2zm0 4h20v2H20v-2zm0 4h20v2H20v-2z' fill='%2387ee6f' fill-opacity='0.14' fill-rule='evenodd'/%3E%3C/svg%3E);"
      >
        <div class="my-4">
          <p class=" font-semibold text-lg">Monday</p>
          <div v-if="monCourses.length > 0">
            <table-header></table-header>
            <table-row
              v-for="(course, index) in monCourses"
              :key="course[0] + index"
            >
              <template #time>
                {{ addLaggingZerosToTime(course[1]) }}
              </template>

              <template #code>
                {{ course[0] }}
              </template>

              <template #venue>
                {{ course[2] }}
              </template>
            </table-row>
          </div>
          <p v-else>No Courses found for this day</p>
        </div>

        <div class="my-4">
          <p class=" font-semibold text-lg">Tuesday</p>
          <div v-if="tueCourses.length > 0">
            <table-header></table-header>
            <table-row
              v-for="(course, index) in tueCourses"
              :key="course[0] + index"
            >
              <template #time>
                {{ addLaggingZerosToTime(course[1]) }}
              </template>

              <template #code>
                {{ course[0] }}
              </template>

              <template #venue>
                {{ course[2] }}
              </template>
            </table-row>
          </div>
          <p v-else>No Courses found for this day</p>
        </div>

        <div class="my-4">
          <p class=" font-semibold text-lg">Wednesday</p>
          <div v-if="wedCourses.length > 0">
            <table-header></table-header>
            <table-row
              v-for="(course, index) in wedCourses"
              :key="course[0] + index"
            >
              <template #time>
                {{ addLaggingZerosToTime(course[1]) }}
              </template>

              <template #code>
                {{ course[0] }}
              </template>

              <template #venue>
                {{ course[2] }}
              </template>
            </table-row>
          </div>
          <p v-else>No Courses found for this day</p>
        </div>

        <div class="my-4">
          <p class=" font-semibold text-lg">Thursday</p>
          <div v-if="thurCourses.length > 0">
            <table-header></table-header>
            <table-row
              v-for="(course, index) in thurCourses"
              :key="course[0] + index"
            >
              <template #time>
                {{ addLaggingZerosToTime(course[1]) }}
              </template>

              <template #code>
                {{ course[0] }}
              </template>

              <template #venue>
                {{ course[2] }}
              </template>
            </table-row>
          </div>
          <p v-else>No Courses found for this day</p>
        </div>

        <div class="my-4">
          <p class=" font-semibold text-lg">Friday</p>
          <div v-if="friCourses.length > 0">
            <table-header></table-header>
            <table-row
              v-for="(course, index) in friCourses"
              :key="course[0] + index"
            >
              <template #time>
                {{ addLaggingZerosToTime(course[1]) }}
              </template>

              <template #code>
                {{ course[0] }}
              </template>

              <template #venue>
                {{ course[2] }}
              </template>
            </table-row>
          </div>
          <p v-else>No Courses found for this day</p>
        </div>
      </div>

      <div class="flex w-full justify-center items-center mt-4 mb-8">
        <p @click="resetTimetable" class="btn btn-green px-4 px-2 w-32">Back</p>
        <a :href="imgURL" download class="btn btn-orange px-4 px-2"
          >Download Timetable</a
        >
      </div>
    </div>
  </div>
</template>

<style scoped>
.btn {
  @apply p-1 rounded shadow text-white text-center mx-2 cursor-pointer;
}

.btn-orange {
  @apply bg-custom-orange;
}

.btn-orange:hover {
  @apply bg-opacity-75;
}

.btn-green {
  @apply bg-green-800;
}
</style>
