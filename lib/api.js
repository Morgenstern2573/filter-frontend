import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://lit-citadel-58061.herokuapp.com",
  withCredentials: false
});

// request for the data used for the timetable from the server
export async function getCourseData(courseList = []) {
  if (!courseList) {
    return;
  }

  if (typeof courseList !== Array) {
    throw new Error("Argument passed is not an array");
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
