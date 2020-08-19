import axios from "axios";

const myAxios = axios.create({
  baseURL: "https://lit-citadel-58061.herokuapp.com",
  withCredentials: false
});

export async function getCourseData(courseList) {
  try {
    let response = await myAxios.get("/", {
      params: {
        course_list: courseList
      }
    });
    if (response.data.status == "ok") {
      return Object.assign({}, response["data"]);
    } else {
      console.log(response.data.status, response.data.message);
    }
  } catch (error) {
    console.log("Something went wrong server side", error);
  }
}
