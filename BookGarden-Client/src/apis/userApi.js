import axiosClient from "./axiosClient";

const userApi = {
  login(email, password) {
    const url = "/auth/login";
    return axiosClient
      .post(url, {
        email,
        password,
      })
      .then((response) => {
        console.log(response);
        if (response) {
          localStorage.setItem("client", response.token);
          localStorage.setItem("user", JSON.stringify(response.user));
        }
        return response;
      });
  },

  logout(data) {
    const url = "/user/logout";
    return axiosClient.get(url);
  },
};
export default userApi;
