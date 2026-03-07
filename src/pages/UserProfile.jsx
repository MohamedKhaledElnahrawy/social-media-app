import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getUserProfileApi,
  getUserProfiledataApi,
} from "../services/userProfile";
import { sendFollowApi } from "../services/PostServices";
import { Spinner, Avatar, Card, CardBody, Button } from "@heroui/react";
import PostCard from "../components/Post/PostCard";
import { UserPlus, UserCheck, UserMinus } from "lucide-react";
import { useState } from "react";

// *************************************************************************

export default function UserProfile() {
  const [isUpdating, setIsUpdating] = useState(false);
  const { userId } = useParams();
  const queryClient = useQueryClient();

  // *************************************************************************

  // get posts
  const { data: postsData, isLoading: postsLoading } = useQuery({
    queryKey: ["userProfile", userId],
    queryFn: () => getUserProfileApi(userId),
  });

  const {
    data: userData,
    isLoading: userLoading,
    isError,
  } = useQuery({
    queryKey: ["userData", userId],
    queryFn: () => getUserProfiledataApi(userId),
  });

  // *************************************************************************

  // follow & unfollow
  const { mutate: toggleFollow } = useMutation({
    mutationFn: () => sendFollowApi(userId),
    onMutate: () => {
      setIsUpdating(true);
    },

    // *************************************************************************

    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["userData", userId] });
      setIsUpdating(false);
      console.log("follow status updated");
    },

    // *************************************************************************

    onError: (error) => {
      console.error("Follow Action Failed:", error);
      setIsUpdating(false);
    },
  });

  // *************************************************************************

  if (postsLoading || userLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner label="Loading Profile..." color="primary" />
      </div>
    );

  // *************************************************************************

  if (isError)
    return (
      <div className="text-center text-red-500 py-10">
        Error loading profile.
      </div>
    );

  // *************************************************************************

  const userInfo = userData?.data?.user;
  const isFollowing = userData?.data?.isFollowing;
  const posts = postsData?.data?.posts || [];

  return (
    <div className="max-w-7xl mx-auto p-4">
      <Card className="mb-8 overflow-hidden shadow-md border-none">
        <div className="h-40 w-full bg-linear-to-r from-slate-900 to-slate-700"></div>

        <CardBody className="px-10 pb-10">
          <div className=" flex flex-col md:flex-row items-start md:items-center gap-4 -mt-15 md:-mt-12">
            <Avatar
              src={userInfo?.photo}
              className="w-32 h-32 mt-15 border-4 border-white shadow-lg bg-white"
              isBordered
              color="primary"
            />

            <div className="flex-1 flex flex-col md:flex-row justify-between items-start md:items-end w-full mt-2">
              <div className="text-left">
                <h1 className="text-2xl font-bold text-zinc-800 dark:text-white">
                  {userInfo?.name || "User Profile"}
                </h1>
                <p className="text-zinc-500 font-medium">
                  @{userInfo?.username}
                </p>
              </div>

              {/* fllow button */}

              <div className="mt-4 md:mt-0 flex gap-2">
                <Button
                  color={isFollowing ? "default" : "primary"}
                  variant={isFollowing ? "bordered" : "solid"}
                  radius="full"
                  startContent={
                    isFollowing ? (
                      <UserCheck size={18} />
                    ) : (
                      <UserPlus size={18} />
                    )
                  }
                  className="font-semibold min-w-30"
                  isLoading={isUpdating}
                  onPress={() => toggleFollow()}
                >
                  {isFollowing ? "Following" : "Follow"}
                </Button>
              </div>
            </div>
          </div>

          <div className="flex gap-6 mt-6 justify-start  border-t pt-4 border-zinc-100 dark:border-zinc-700">
            <div className="flex gap-1 items-baseline">
              <span className="font-bold text-lg">{posts.length}</span>
              <span className="text-zinc-400 text-small">Posts</span>
            </div>
            <div className="flex gap-1 items-baseline">
              <span className="font-bold text-lg">
                {userInfo?.followersCount}
              </span>
              <span className="text-zinc-400 text-small">Followers</span>
            </div>
            <div className="flex gap-1 items-baseline">
              <span className="font-bold text-lg">
                {userInfo?.followingCount}
              </span>
              <span className="text-zinc-400 text-small">Following</span>
            </div>
          </div>
        </CardBody>
      </Card>

      {/*  posts*/}
      <div className="flex flex-col gap-6">
        {posts.length > 0 ? (
          posts.map((post) => <PostCard key={post._id} post={post} />)
        ) : (
          <div className="text-center py-20 bg-zinc-50 dark:bg-zinc-900 rounded-xl border-2 border-dashed border-zinc-200 dark:border-zinc-800">
            <p className="text-zinc-400">
              This user hasn't posted anything yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
