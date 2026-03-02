import axios from "axios";

const getHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

// ******************************************************************

export async function getPosts(limit = 15, page = 1) {
  const { data } = await axios.get("https://route-posts.routemisr.com/posts", {
    headers: getHeaders(),
    params: {
      limit: limit,
      page: page,
      sort: "-createdAt",
    },
  });
  return data;
}

// ******************************************************************
export async function createPostAPI(formData) {
  const { data } = await axios.post(
    "https://route-posts.routemisr.com/posts",
    formData,
    { headers: getHeaders() },
  );
  return data;
}

// ******************************************************************
export async function updatePostAPI(postId, formData) {
  const { data } = await axios.put(
    `https://route-posts.routemisr.com/posts/${postId}`,
    formData,
    { headers: getHeaders() },
  );
  return data;
}

// ******************************************************************
export async function deletePostAPI(postId) {
  const { data } = await axios.delete(
    `https://route-posts.routemisr.com/posts/${postId}`,
    { headers: getHeaders() },
  );
  return data;
}

// ******************************************************************

export async function getPostApi(postId) {
  const { data } = await axios.get(
    `https://route-posts.routemisr.com/posts/${postId}`,
    { headers: getHeaders() },
  );
  return data;
}

// ******************************************************************

  export async function getMyOwnPostsApi(MyId) {
    const { data } = await axios.get(
      `https://route-posts.routemisr.com/users/${MyId}/posts`,
      {
        headers: getHeaders(),
      },
    );
    return data;
  }
export async function getMyPostApi(limit = 15, page = 1) {
  const { data } = await axios.get(
    "https://route-posts.routemisr.com/posts/feed",
    {
      headers: getHeaders(),
      params: {
        limit: limit,
        page: page,
      },
    },
  );
  return data;
}

// ******************************************************************

export async function toggleLikeApi(postId) {
  const { data } = await axios.put(
    `https://route-posts.routemisr.com/posts/${postId}/like`,
    {},
    { headers: getHeaders() },
  );
  return data;
}

// ******************************************************************

export const getFollowSuggestions = async (limit = 5, page = 1) => {
  const { data } = await axios.get(
    `https://route-posts.routemisr.com/users/suggestions?limit=${limit}&page=${page}`,
    { headers: getHeaders() },
  );
  return data;
};

// ******************************************************************

export async function sendFollowApi(userId) {
  const { data } = await axios.put(
    `https://route-posts.routemisr.com/users/${userId}/follow`,
    {},
    { headers: getHeaders() },
  );
  return data;
}
