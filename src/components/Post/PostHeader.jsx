import React, { useContext } from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@heroui/react";
import { AuthContext } from "../context/AuthContext";
import { deletePostAPI, updatePostAPI } from "../../services/PostServices";
import Swal from "sweetalert2";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
{
  /* **************************************************************************/
}

export default function PostHeader({
  photo,
  name,
  date,
  userId,
  postId,
  body,
}) {
  const { userData } = useContext(AuthContext);
  const queryClient = useQueryClient();

  {
    /* **************************************************************************/
  }

  // 1. Mutation Update (Async)
  const { mutateAsync: updateMutate } = useMutation({
    mutationFn: ({ id, formData }) => updatePostAPI(id, formData),
  });

  {
    /* **************************************************************************/
  }

  // 2. Mutation Delete (Async)
  const { mutateAsync: deleteMutate } = useMutation({
    mutationFn: (id) => deletePostAPI(id),
  });

  {
    /* **************************************************************************/
  }
  // delete post
  async function deletePost() {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      showLoaderOnConfirm: true, 
      preConfirm: async () => {
        try {
          await deleteMutate(postId);


          await queryClient.invalidateQueries({ queryKey: ["posts"] });
          await queryClient.invalidateQueries({ queryKey: ["myPosts"] });
          await queryClient.invalidateQueries({ queryKey: ["post", postId] });

          return true;
        } catch (error) {
          Swal.showValidationMessage(`Delete failed: ${error.message}`);
        }
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "Your post has been removed from everywhere.",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    });
  }

  {
    /* **************************************************************************/
  }

  //update post
  async function updatePost() {
    Swal.fire({
      title: "Update Your Post",
      html: `
        <textarea id="swal-body" class="swal2-textarea" placeholder="What's on your mind?">${body || ""}</textarea>
        <div style="text-align: left; width: 100%; margin-top: 10px;">
          <input type="file" id="swal-image" class="swal-custom-file" accept="image/*" />
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "Update Now",
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        const newBody = document.getElementById("swal-body").value.trim();
        const newImage = document.getElementById("swal-image").files[0];

        if (!newBody && !newImage) {
          Swal.showValidationMessage(`Please provide text or an image.`);
          return false;
        }

        const formData = new FormData();
        if (newBody) formData.append("body", newBody);
        if (newImage) formData.append("image", newImage);

        try {
          await updateMutate({ id: postId, formData });

          await queryClient.invalidateQueries({ queryKey: ["posts"] });
          await queryClient.invalidateQueries({ queryKey: ["myPosts"] });
          await queryClient.invalidateQueries({ queryKey: ["post", postId] });

          return true;
        } catch (error) {
          Swal.showValidationMessage(`Update failed: ${error.message}`);
        }
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          icon: "success",
          title: "Updated!",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    });
  }

  {
    /* **************************************************************************/
  }

  return (
    <div className="w-full h-16 items-center flex justify-between">
      <div className="flex">
        <Link to={`/profile/${userId}`} className="hover:underline">
          <img className="rounded-full w-10 h-10 mr-3" src={photo} alt={name} />
        </Link>
        <div>
          <Link to={`/profile/${userId}`} className="hover:underline">
            <h3 className="text-md font-semibold">{name}</h3>
          </Link>
          <p className="text-xs text-gray-500">
            {date
              ? formatDistanceToNow(new Date(date), { addSuffix: true })
              : ""}
          </p>
        </div>
      </div>

      {userData?._id === userId && (
        <Dropdown>
          <DropdownTrigger>
            <Button variant="light" isIconOnly>
              <svg
                className="w-6 h-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#b0b0b0"
                strokeWidth={2}
              >
                <circle cx={12} cy={12} r={1} />
                <circle cx={19} cy={12} r={1} />
                <circle cx={5} cy={12} r={1} />
              </svg>
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            onAction={(key) => {
              if (key === "delete") deletePost();
              if (key === "edit") updatePost();
            }}
          >
            <DropdownItem key="edit">Update Post</DropdownItem>
            <DropdownItem key="delete" className="text-danger" color="danger">
              Delete Post
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      )}
    </div>
  );
}
