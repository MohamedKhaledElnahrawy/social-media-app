import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import PostCard from "../components/Post/PostCard";
import { getPostApi } from "../services/PostServices";
import LoadingScreen from "../components/LoadingScreen";

export default function SinglePostsPage() {
  const { id } = useParams();
  console.log("🚀 ~ SinglePostsPage ~ id:", id)

  const {
    data: post,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["post", id],
    queryFn: () => getPostApi(id),
    select: (response) => response.data.post,
    enabled: !!id,
  });

  // *************************************************************************

  if (isError) {
    return (
      <div className="my-20 flex flex-col items-center justify-center gap-4">
        <div className="bg-red-100 text-red-700 p-4 rounded-lg border border-red-200 shadow-sm">
          <p className="font-bold text-lg">Oops! Something went wrong.</p>
          <p className="text-sm">
            {error.message || "Failed to load the post."}
          </p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="bg-primary text-white px-6 py-2 rounded-full hover:bg-primary/90 transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  // *************************************************************************

  return (
    <div className="my-20">
      {isLoading ? (
        <LoadingScreen />
      ) : post ? (
        <PostCard post={post} />
      ) : (
        <p className="text-center">Post not found</p>
      )}
    </div>
  );
}
