import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button, Input, Avatar, Spinner } from "@heroui/react";
import { MessageSquare, Send, ThumbsUp, Share2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import PostHeader from "./PostHeader";
import PostBody from "./PostBody";
import PostComment from "./PostComment";
import { toggleLikeApi } from "../../services/PostServices";
import {
  createCommentAPI,
  getPostCommentsAPI,
  updateCommentAPI,
} from "../../services/CommentService";
import { AuthContext } from "../context/AuthContext";

// *************************************************************************************

export default function PostCard({ post, commentsLimit = 1 }) {
  const { userData } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const [localIsLiked, setLocalIsLiked] = useState(false);
  const [localLikesCount, setLocalLikesCount] = useState(post.likesCount || 0);

  useEffect(() => {
    setLocalIsLiked(
      post.likes?.some((user) => (user._id || user) === userData?._id),
    );
    setLocalLikesCount(post.likesCount || 0);
  }, [post.likes, post.likesCount, userData?._id]);

  // --- Comments---
  const [commentContent, setCommentContent] = useState("");
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isDeletingPost, setIsDeletingPost] = useState(false);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [showSection, setShowSection] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const displayedComments = showAll
    ? comments
    : comments.slice(0, commentsLimit);

  // --- Mutation Like---
  const { mutate: handleLike } = useMutation({
    mutationFn: () => toggleLikeApi(post._id),
    onMutate: async () => {
      const newLikedStatus = !localIsLiked;
      setLocalIsLiked(newLikedStatus);
      setLocalLikesCount((prev) =>
        newLikedStatus ? prev + 1 : Math.max(0, prev - 1),
      );
    },
    onError: () => {
      setLocalIsLiked(
        post.likes?.some((user) => (user._id || user) === userData?._id),
      );
      setLocalLikesCount(post.likesCount || 0);
    },
    onSettled: () => {
      // queryClient.invalidateQueries({ queryKey: ["getPosts"] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["myPosts"] });
    },
  });

  // get comments
  async function getComments(showLoading = true) {
    try {
      if (showLoading) setCommentsLoading(true);
      const response = await getPostCommentsAPI(post._id || post.id);
      if (response.success && response.data?.comments) {
        setComments([...response.data.comments].reverse());
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setCommentsLoading(false);
    }
  }

  async function handleCommentSubmit(e) {
    e.preventDefault();
    if (!commentContent.trim()) return;
    setLoading(true);

    let response;
    if (editingCommentId) {
      response = await updateCommentAPI(
        commentContent,
        post._id || post.id,
        editingCommentId,
      );
    } else {
      response = await createCommentAPI(commentContent, post._id || post.id);
    }

    if (response.success) {
      await getComments(false);
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["myPosts"] });
      setCommentContent("");
      setEditingCommentId(null);
    }
    setLoading(false);
  }

  const toggleCommentSection = () => {
    if (!showSection) getComments();
    setShowSection(!showSection);
  };

  return (
    <div className="w-full max-w-xl relative mx-auto my-5">
      {isDeletingPost && (
        <div className="bg-white/80 z-20 absolute inset-0 rounded-md flex justify-center items-center">
          <Spinner />
        </div>
      )}
      {/* *********************************************************************************** */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="p-4 pb-2">
          <PostHeader
            photo={post.user.photo}
            name={post.user.name}
            date={post.createdAt}
            userId={post.user._id}
            postId={post._id}
            setIsDeletingPost={setIsDeletingPost}
            body={post.body}
          />
        </div>

        {/* *********************************************************************************** */}

        {/* Body */}
        <Link
          to={`/single-post/${post._id || post.id}`}
          className="px-4 block cursor-pointer"
        >
          <PostBody body={post.body} image={post.image} />
        </Link>

        {/* *********************************************************************************** */}

        {/* Likes ,  Comments ,view details */}
        <div className="px-4 py-2 flex justify-between items-center text-xs text-gray-500 border-b border-gray-50">
          <div className="flex gap-1 items-center">
            <span className="bg-blue-500 rounded-full p-0.5">
              <ThumbsUp size={10} className="text-white" fill="currentColor" />
            </span>
            <span className="font-medium text-gray-700">
              {localLikesCount} likes
            </span>
          </div>
          <div className="flex gap-3 items-center">
            <span>{comments.length || post.commentsCount || 0} comments</span>
            <Link
              to={`/single-post/${post._id || post.id}`}
              className="text-blue-600 font-bold hover:underline"
            >
              View details
            </Link>
          </div>
        </div>

        {/* *********************************************************************************** */}

        {/*  Buttons */}
        <div className="px-2 py-1 flex items-center justify-between border-b border-gray-50">
          <Button
            variant="light"
            onPress={() => handleLike()}
            className={`flex-1 gap-2 font-bold transition-all ${
              localIsLiked
                ? "text-blue-600 bg-blue-50"
                : "text-gray-600 hover:bg-gray-100"
            }`}
            size="sm"
          >
            <ThumbsUp
              size={18}
              fill={localIsLiked ? "currentColor" : "none"}
              className={localIsLiked ? "text-blue-600" : "text-gray-600"}
            />
            Like
          </Button>

          <Button
            onPress={toggleCommentSection}
            variant="light"
            className={`flex-1 gap-2 font-semibold ${showSection ? "text-blue-600 bg-blue-50" : "text-gray-600"}`}
            size="sm"
          >
            <MessageSquare size={18} /> Comment
          </Button>

          <Button
            variant="light"
            className="flex-1 gap-2 text-gray-600 font-semibold"
            size="sm"
          >
            <Share2 size={18} /> Share
          </Button>
        </div>

        {/* *********************************************************************************** */}

        {/* Comments Section */}
        {showSection && (
          <div className="p-4 bg-gray-50/40 transition-all border-t border-gray-50">
            <div className="flex flex-col gap-3">
              {commentsLoading ? (
                <div className="flex justify-center p-4">
                  <Spinner size="sm" />
                </div>
              ) : comments.length > 0 ? (
                <>
                  <div className="flex justify-between items-center mb-1 px-1">
                    <span className="text-xs font-bold text-gray-700">
                      Comments
                    </span>
                  </div>
                  {displayedComments.map((comment) => (
                    <PostComment
                      key={comment._id}
                      comment={comment}
                      setCommentContent={setCommentContent}
                      setEditingCommentId={setEditingCommentId}
                      postId={post._id || post.id}
                      getComments={getComments}
                    />
                  ))}
                  {comments.length > commentsLimit && (
                    <button
                      onClick={() => setShowAll(!showAll)}
                      className="text-xs font-bold text-blue-600 hover:underline px-1 mt-1"
                    >
                      {showAll
                        ? "Show less"
                        : `View all ${comments.length} comments`}
                    </button>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                  <MessageSquare size={24} className="text-blue-400 mb-2" />
                  <p className="font-bold text-gray-800 text-sm">
                    No comments yet
                  </p>
                </div>
              )}
            </div>

            {/* *********************************************************************************** */}

            {/* Comment Form */}
            <form
              onSubmit={handleCommentSubmit}
              className="mt-6 flex gap-2 items-center"
            >
              <Avatar src={userData?.photo} size="sm" />
              <div className="relative flex-1">
                <Input
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  placeholder={
                    editingCommentId
                      ? "Update comment..."
                      : "Write a comment..."
                  }
                  variant="flat"
                  radius="full"
                  size="sm"
                />
                <Button
                  isIconOnly
                  size="sm"
                  type="submit"
                  isLoading={loading}
                  className={`absolute right-0 top-1/2 -translate-y-1/2 ${editingCommentId ? "bg-green-500 text-white w-14" : "text-blue-500 bg-transparent"}`}
                >
                  {editingCommentId ? "Update" : <Send size={16} />}
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
