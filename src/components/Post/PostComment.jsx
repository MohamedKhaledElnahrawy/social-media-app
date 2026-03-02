import React, { useContext, useState } from "react";
import placeHolderImage from "../../assets/default-avatar-photo-placeholder-profile-icon-vector.jpg";
import { AuthContext } from "../context/AuthContext";
import { deleteCommentAPI } from "../../services/CommentService";
import { Spinner } from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";

export default function PostComment({
  comment,
  setCommentContent,
  setEditingCommentId,
  postId,
  getComments,
}) {
  const { userData } = useContext(AuthContext);
  const [isDeleting, setIsDeleting] = useState(false);
  const queryClient = useQueryClient();

  function updateComment() {
    setEditingCommentId(comment._id);
    console.log(comment._id);
    setCommentContent(comment.content);
  }

  async function deleteComment() {
    try {
      setIsDeleting(true);
      const data = await deleteCommentAPI(postId, comment._id);

      if (data.success) {
        console.log("Deleted:", data.message);
        await getComments(false);
        queryClient.invalidateQueries({ queryKey: ["posts"] });
        queryClient.invalidateQueries({ queryKey: ["myPosts"] });
      } else {
        console.log("Error:", data.message);
      }
    } catch (error) {
      console.log("🚀 ~ deleteComment ~ error:", error);
    } finally {
      setIsDeleting(false);
    }
  }
  // my id = user comment id
  const isMyComment = userData?._id === comment.commentCreator?._id;

  return (
    <div>
      <div className="flex items-center space-x-2 p-4 text-md ">
        <div className="flex self-start cursor-pointer">
          <img
            onError={(e) => (e.target.src = placeHolderImage)}
            src={comment.commentCreator.photo}
            alt={comment.commentCreator.name}
            className="h-8 w-8 object-fill rounded-full"
          />
        </div>
        <div className="flex items-center justify-center space-x-2">
          <div className="block ">
            <div className="bg-gray-100 w-auto rounded-xl px-2 pb-2">
              <div className="font-medium">
                <h2 className="text-gray-800">{comment.commentCreator.name}</h2>
              </div>
              <div className="">{comment.content}</div>
            </div>

            <div className="flex justify-start items-center text-xs w-full">
              <div className="font-semibold text-gray-700 px-2 flex items-center justify-center space-x-1">
                {/*edit my comment*/}

                {isMyComment && (
                  <>
                    {/* remove delete button during deleting */}
                    {!isDeleting && (
                      <button
                        onClick={() => updateComment()}
                        className="hover:underline text-blue-600 cursor-pointer"
                      >
                        update
                      </button>
                    )}

                    {!isDeleting && <small className="self-center">.</small>}

                    {/* delete loader*/}
                    {isDeleting ? (
                      <div className="flex items-center gap-1 text-danger py-2">
                        <Spinner size="sm" color="danger" />
                        <small className="animate-pulse">Deleting...</small>
                      </div>
                    ) : (
                      <button
                        onClick={() => deleteComment()}
                        className="hover:underline text-danger cursor-pointer"
                      >
                        delete
                      </button>
                    )}

                    {!isDeleting && <small className="self-center">.</small>}
                  </>
                )}
                <span className="text-gray-500 font-normal">
                  {comment.createdAt.split(".", 1)[0].replace("T", " ")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
