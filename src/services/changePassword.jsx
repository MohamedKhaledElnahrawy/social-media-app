import axios from "axios";
import React from "react";
export async function changePasswordApi(newPassword) {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const { data } = await axios.patch(
      "https://route-posts.routemisr.com/users/change-password",
      newPassword,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type' : 'application/json'
        },
      },
    );
    console.log("🚀 ~ changePasswordApi ~ data:", data)
    return data;
  } catch (err) {
    console.log("🚀 ~ changePasswordApi ~ err:", err)
    return err.response?.data;
  }
}
