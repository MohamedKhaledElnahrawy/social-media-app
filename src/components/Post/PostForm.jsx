
import { Button, Textarea, Avatar } from "@heroui/react";
import React, { useState, useContext } from "react";
import { createPostAPI } from "../../services/PostServices";
import { AuthContext } from "../../components/context/AuthContext";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

  {/* **************************************************************************/}

export default function PostForm() {
  const { userData } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [body, setBody] = useState("");
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const queryClient = useQueryClient(); 

  {/* **************************************************************************/}

  function handleImage(e) {
    if (e?.target.files[0]) {
      setImage(e.target.files[0]);
      setImageUrl(URL.createObjectURL(e.target.files[0]));
    } else {
      setImage(null);
      setImageUrl("");
    }
  }

{/* **************************************************************************/}

  async function createPost(e) {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData();
    if (body) formData.append("body", body);
    if (image) formData.append("image", image);

    try {
      const response = await createPostAPI(formData);

      if (response.message === "success" || response.success) {
        queryClient.invalidateQueries({ queryKey: ["posts"] });
        queryClient.invalidateQueries({ queryKey: ["myPosts"] });
        queryClient.invalidateQueries({ queryKey: ["posts", 'mine'] });

        setBody(""); 
        setImage(null); 
        setImageUrl("");
        
        toast.success("Post Created!"); 
      }
    } catch (error) {
       console.error(error);
    } finally {
      setLoading(false);
    }
  }

  {/* **************************************************************************/}

  return (
    <div className="p-4 rounded-xl shadow-sm border bg-white mb-6">
      <form onSubmit={createPost}>

        <div className="flex items-center gap-3 mb-4">
          <Avatar
            src={userData?.photo}
            name={userData?.name}
            className="w-10 h-10 border border-gray-100"
          />
          <div className="flex flex-col">
            <span className="font-bold text-gray-800 text-sm md:text-base">
              {userData?.name}
            </span>
            <span className="text-gray-500 text-xs">Public</span>
          </div>
        </div>

{/* **************************************************************************/}

        <div className="w-full">
          <Textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder={`What's on your mind, ${userData?.name?.split(" ")[0]}?`}
            className="w-full"
            variant="underlined"
            minRows={3}
            classNames={{
              input: "text-lg py-2",
              inputWrapper: "border-none after:bg-transparent",
            }}
          />
        </div>
{/* **************************************************************************/}
        {imageUrl && (
          <div className="relative mt-4 rounded-lg overflow-hidden border bg-gray-50">
            <button
              type="button"
              onClick={() => {
                setImage(null);
                setImageUrl("");
              }}
              className="absolute top-2 right-2 z-10 bg-black/60 text-white p-1 rounded-full hover:bg-black transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <img
              src={imageUrl}
              alt="preview"
              className="w-full h-auto max-h-96 object-contain"
            />
          </div>
        )}

{/* **************************************************************************/}

        <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100">
          <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors text-gray-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 text-green-500"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
              />
            </svg>
            <span className="text-sm font-medium">Photo/video</span>
            <input
              onChange={handleImage}
              type="file"
              accept="image/*"
              className="hidden"
            />
          </label>

          <Button
          disabled={loading || !(body.trim() || image)}
            isLoading={loading}
            type="submit"
            color="primary"
            className="px-8 font-bold rounded-lg shadow-md"
          >
            Post
          </Button>
        </div>
      </form>
    </div>
  );
}
