import axios from "axios";
import React from "react";

export async function createCommentAPI(content, postId) {
  const token = localStorage.getItem("token");

  const formData = new FormData();
  formData.append("content", content);

  try {
    const { data } = await axios.post(
      `https://route-posts.routemisr.com/posts/${postId}/comments`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return data;
  } catch (error) {
    console.log("Error in createCommentAPI", error.response?.data);
    return error.response?.data;
  }
}

export async function updateCommentAPI(content, postId,commentId) {
  const token = localStorage.getItem("token");

  const formData = new FormData();
  formData.append("content", content);
  try {
    const { data } = await axios.put(
      `https://route-posts.routemisr.com/posts/${postId}/comments/${commentId}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return data;
  } catch (error) {
    console.log("Error in createCommentAPI", error.response?.data);
    return error.response?.data;
  }
}
export async function deleteCommentAPI( postId,commentId) {
  const token = localStorage.getItem("token");

  try {
    const { data } = await axios.delete(
      `https://route-posts.routemisr.com/posts/${postId}/comments/${commentId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return data;
  } catch (error) {
    console.log("Error in createCommentAPI", error.response?.data);
    return error.response?.data;
  }
}


export async function getPostCommentsAPI(postId) {
  const token = localStorage.getItem("token");
  try {
    const { data } = await axios.get(
      `https://route-posts.routemisr.com/posts/${postId}/comments?page=1&limit=10`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return data;
  } catch (error) {
    console.error("Error in getPostCommentsAPI", error.response?.data);
    return error.response?.data;
  }
}