import axios from "axios";
import React from "react";

export async function sendRegisterData(values) {
  try {
    const { data } = await axios.post(
      "https://route-posts.routemisr.com/users/signup",
      values,{
        headers:{
          'Content-Type' : 'application/json'
        }
      }
    );

    console.log("🚀 ~ sendRegisterData ~ data:", data)
    return data;
  } catch (err) {
    return err.response.data;
  }
}
