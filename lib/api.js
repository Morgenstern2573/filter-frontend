import axios from "axios";

const axiosInstance = axios.create({
  // baseURL: "http://127.0.0.1:5000",
  baseURL: "https://lit-citadel-58061.herokuapp.com",
  withCredentials: false
});

// request for the data used for the timetable from the server
export async function getCourseData(courseList = "") {
  if (!courseList) {
    return;
  }

  if (typeof courseList !== "string") {
    throw new Error("Argument passed is not a string");
  }

  try {
    // make the request and store the result
    let response = await axiosInstance.get("/", {
      params: {
        course_list: courseList
      }
    });

    if (response.data.status === "ok") {
      return Object.assign({}, response["data"]);
    } else {
      console.log(response.data.status, response.data.message);
    }
  } catch (error) {
    alert("Server side error");
    console.log("Something went wrong server side", error);
  }
}

export async function getCodeList() {
  try {
    let response = await axiosInstance.get("/list");

    if (response.data.status === "ok") {
      return Object.assign([], response.data.list);
    } else {
      console.log(response.data.status, response.data.message);
    }
  } catch (error) {
    alert("Server side error");
    console.log("Something went wrong server side", error);
  }
}
