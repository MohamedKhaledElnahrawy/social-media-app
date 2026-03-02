import axios from "axios";

const getHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export async function getUserProfileApi(userId) {
  const { data } = await axios.get(
    `https://route-posts.routemisr.com/users/${userId}/posts`,
        { headers: getHeaders() },

  );
  return data;
}
export async function getUserProfiledataApi(userId) {
  const { data } = await axios.get(
    `https://route-posts.routemisr.com/users/${userId}/profile`,
        { headers: getHeaders() },

  );
  return data;
}


