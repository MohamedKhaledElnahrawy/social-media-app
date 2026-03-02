import axios from "axios";
import React from "react";

export async function getLoggedUserData() {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const { data } = await axios.get(
      "https://route-posts.routemisr.com/users/profile-data", 
      {
         headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return data;
  } catch (err) {
    console.log("🚀 ~ getLoggedUserData ~ err:", err)
    return err.response?.data;
  }
}


export async function sendLoginData(values) {
  try {
    const { data } = await axios.post(
      "https://route-posts.routemisr.com/users/signin",
      values,{
        headers:{
          'Content-Type' : 'application/json'
        }
      }
    );
    return data;
  } catch (err) {
    return err.response.data;
  }
}

