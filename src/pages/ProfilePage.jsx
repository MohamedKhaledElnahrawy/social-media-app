import React, { useContext } from "react";
import { AuthContext } from "../components/context/AuthContext";
import { getMyOwnPostsApi } from "../services/PostServices";
import { useQuery } from "@tanstack/react-query";
import { Card, Avatar, Spinner, Button } from "@heroui/react";
import PostCard from "../components/Post/PostCard";
import {
  Mail,
  Calendar,
  UserCheck,
  FileText,
  Bookmark as BookmarkIcon,
} from "lucide-react";
import LoadingScreen from "../components/LoadingScreen";
import { InfoRow, StatCard } from "../components/ProfileComponent";

export default function ProfilePage() {
  const { userData } = useContext(AuthContext);

  // ************************************************************************************
  const {
    data: posts,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["myPosts", userData?._id],
    queryFn: () => getMyOwnPostsApi(userData._id),
    select: (response) => response.data?.posts || [],
    staleTime: 1000 * 60 * 5,
    enabled: !!userData?._id, //  don't call function without Id
  });

  // ***********************************************************************************

  if (!userData)
    return (
      <div className="flex justify-center items-center h-120">
        <LoadingScreen />
      </div>
    );

    // ***********************************************************************************

  return (
    <div className="bg-[#E9ECEF] min-h-screen pb-10 font-sans">
      <div className="container mx-auto max-w-6xl pt-8 px-4">
        <Card className="bg-white rounded-[40px] shadow-sm border-none overflow-hidden p-2">
          {/* Cover Blue Section */}
          <div className="h-56 bg-[#3A5A98] w-full rounded-t-[35px] relative"></div>

          <div className="px-10 pb-10">
            <div className="flex flex-col md:flex-row items-start md:items-center -mt-16 gap-6 relative z-10">
              <Avatar
                src={userData.photo}
                className="w-32 h-32 text-large border-4 border-white shadow-lg"
                isBordered
                color="primary"
              />

              <div className="mt-2 md:mt-16 flex-1 ">
                <h1 className="text-3xl font-bold text-[#1B2733]">
                  {userData.name}
                </h1>
                <p className="text-slate-400 text-lg">@{userData.username}</p>
                <div className="inline-flex items-center bg-[#F0F7FF] text-[#4A90E2] text-[11px] px-3 py-1 rounded-full mt-2 font-bold uppercase tracking-wider">
                  <UserCheck size={14} className="mr-1" />
                  AURA MEMBER
                </div>
              </div>

              <div className="flex flex-col md:flex-row md:w-fit gap-3 mt-6 md:mt-18 w-full">
                <StatCard
                  label="FOLLOWERS"
                  value={userData.followersCount ?? 0}
                />
                <StatCard
                  label="FOLLOWING"
                  value={userData.followingCount ?? 0}
                />
                <StatCard
                  label="BOOKMARKS"
                  value={userData.bookmarksCount ?? 0}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-12">
              <div className="md:col-span-7 bg-[#F8F9FA] rounded-[25px] p-8 border border-gray-50">
                <h3 className="text-[#1B2733] font-bold text-sm mb-6 uppercase tracking-widest">
                  About
                </h3>
                <div className="space-y-4 text-slate-500">
                  <div className="flex  items-start gap-3">
                    <Mail size={20} className="text-slate-400 " />
                    <span className="text-[15px] font-medium break-all">
                      {userData.email}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar size={18} className="text-slate-400 shrink-0" />
                    <span className="text-[15px] font-medium text-slate-600">
                      Active on Aura Posts
                    </span>
                  </div>
                </div>
              </div>

              <div className="md:col-span-5 space-y-4">
                <InfoRow
                  icon={<FileText className="text-blue-500" size={20} />}
                  label="MY POSTS"
                  value={posts?.length ?? 0}
                />
                <InfoRow
                  icon={<BookmarkIcon className="text-blue-500" size={20} />}
                  label="SAVED POSTS"
                  value={userData.bookmarksCount ?? 0}
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Buttons Section */}
        <div className="mt-8 flex justify-center md:justify-start gap-4">
          <Button className="bg-white text-blue-600 font-bold px-8 py-6 rounded-2xl shadow-sm border-2 border-blue-600 flex items-center gap-2">
            <FileText size={20} /> My Posts
          </Button>
          <Button className="bg-white text-slate-500 font-bold px-8 py-6 rounded-2xl shadow-sm border border-gray-200 flex items-center gap-2">
            <BookmarkIcon size={20} /> Saved
          </Button>
        </div>

        {/* Posts List */}
        <div className="mt-8 space-y-6 max-w-2xl mx-auto">
          {isLoading ? (
            <div className="flex justify-center py-20">
              <Spinner size="lg" />
            </div>
          ) : isError ? (
            <div className="bg-red-50 p-6 rounded-2xl text-center text-red-500">
              Failed to load your posts.
            </div>
          ) : posts?.length > 0 ? (
            posts.map((post) => <PostCard key={post._id} post={post} />)
          ) : (
            <div className="bg-white p-10 rounded-[30px] text-center text-slate-400">
              You haven't posted anything yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
