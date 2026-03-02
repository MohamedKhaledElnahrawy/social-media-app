
import React, { useState, useEffect } from "react";
import { useInfiniteQuery, useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer"; //observal scroll
import {
  getPosts,
  getMyPostApi,
  getFollowSuggestions,
  sendFollowApi,
} from "../services/PostServices";
import LoadingScreen from "../components/LoadingScreen";
import PostCard from "../components/Post/PostCard";
import PostForm from "../components/Post/PostForm";
import { Card, Button, Avatar, Spinner } from "@heroui/react";
import { Rss, User, Users, Search } from "lucide-react";
import { Link } from "react-router-dom";

// ***********************************************************************************

export default function FeedPage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // The Observer scroll)
  const { ref, inView } = useInView();
  // ***********************************************************************************


  const {
    data: postsData,
    isLoading: postsLoading,
    isError: postsError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["posts", activeTab],
    queryFn: ({ pageParam = 1 }) => {
      return activeTab === "all" ? getPosts(15, pageParam) : getMyPostApi(15, pageParam);
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
  const pagination = lastPage.meta?.pagination; 

  if (pagination && pagination.nextPage) {
    return pagination.nextPage;
  }

  // when get last page , no next page
  return undefined;
},
  });

  // ***********************************************************************************

  // when you scroll to the end of page
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // ***********************************************************************************

  //   collecting all posts from all pages in one array
  const allPosts = postsData?.pages.flatMap((page) => page.data.posts) || [];

  // (Follow Suggestions) 
  const { data: suggestions, isLoading: suggestionsLoading } = useQuery({
    queryKey: ["followSuggestions"],
    queryFn: () => getFollowSuggestions(5, 1),
    staleTime: 5 * 60 * 1000,
  });

  // ***********************************************************************************

  const { mutate: handleFollow, variables: activeId } = useMutation({
    mutationFn: (userId) => sendFollowApi(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["followSuggestions"] });
    },
  });

  const filteredSuggestions = suggestions?.data.suggestions.filter(
    (user) =>
      (user.name?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (user.username?.toLowerCase() || "").includes(searchQuery.toLowerCase())
  );

  // ***********************************************************************************

  if (postsLoading && !postsData) return <LoadingScreen />;

// ***********************************************************************************

  if (postsError) {
  return (
    <div className="flex flex-col items-center justify-center p-10 text-red-500">
      <p>Something went wrong: {error?.message}</p>
      <Button onPress={() => fetchNextPage()} color="primary" variant="flat" className="mt-4">
        Try Again
      </Button>
    </div>
  );
}

// ***********************************************************************************

  return (
    <div className="max-w-325 mx-auto px-4 py-6">
      <div className="grid grid-cols-12 gap-6">
        
        {/* Left Side */}
        <div className="hidden lg:block lg:col-span-3">
          <Card className="p-2 sticky top-24 shadow-sm border border-gray-100">
            <nav className="flex flex-col gap-1">
              <Button
                variant={activeTab === "all" ? "flat" : "light"}
                color={activeTab === "all" ? "primary" : "default"}
                onPress={() => setActiveTab("all")}
                className="justify-start gap-3 h-11 font-bold"
                startContent={<Rss size={20} />}
              >
                Community
              </Button>
              <Button
                variant={activeTab === "mine" ? "flat" : "light"}
                color={activeTab === "mine" ? "primary" : "default"}
                onPress={() => setActiveTab("mine")}
                className="justify-start gap-3 h-11 text-gray-600 font-medium hover:bg-gray-100"
                startContent={<User size={20} />}
              >
                Timeline 
              </Button>
            </nav>
          </Card>
        </div>

        {/* Middle - Feed */}
        <div className="col-span-12 md:col-span-8 lg:col-span-6 flex flex-col gap-6">
          <PostForm />
          
          <div className="flex flex-col gap-6">
            {allPosts.length > 0 ? (
              allPosts.map((post) => (
                <PostCard post={post} key={post._id} commentsLimit={1} />
              ))
            ) : (
              <Card className="p-10 text-center text-gray-500">No posts found.</Card>
            )}
          </div>

          {/*  العنصر المراقب (Target) */}
          {/* أول ما العنصر ده يظهر في الشاشة، الـ Observer هينادي fetchNextPage */}
          <div ref={ref} className="flex justify-center p-4">
            {isFetchingNextPage && <Spinner color="primary" label="Loading more posts..." />}
            {!hasNextPage && allPosts.length > 0 && (
              <p className="text-gray-400 text-sm italic">You've seen all the posts!</p>
            )}
          </div>
        </div>

        {/* Right Side - Suggestions */}
        <div className="hidden md:block md:col-span-4 lg:col-span-3">
          <Card className="p-4 sticky top-24 shadow-sm border border-gray-100 flex flex-col gap-4">
            <h3 className="font-bold text-gray-800 text-sm flex items-center gap-2">
              <Users size={20} className="text-blue-600" /> Suggested Friends
            </h3>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search friends..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-3 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-3">
              {suggestionsLoading ? (
                <Spinner size="sm" className="mx-auto" />
              ) : (
                filteredSuggestions?.map((follower) => (
                  <Card key={follower._id} className="p-3 border border-gray-100 shadow-none hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <Link to={`/profile/${follower._id}`}>
                          <Avatar src={follower.photo} className="w-9 h-9 border" />
                        </Link>
                        <div className="flex flex-col">
                          <Link to={`/profile/${follower._id}`} className="hover:underline">
                            <span className="text-xs font-bold text-gray-800">{follower.name}</span>
                          </Link>
                          <span className="text-[10px] text-gray-400">@{follower.username}</span>
                        </div>
                      </div>
                      <Button
                        isLoading={activeId === follower._id}
                        onPress={() => handleFollow(follower._id)}
                        size="sm" color="primary" variant="flat" className="h-7 text-[10px] font-bold"
                      >
                        Follow
                      </Button>
                    </div>
                  </Card>
                ))
              )}
            </div>
            <Link to="/followers" className="text-blue-600 text-xs font-bold text-center mt-2 block hover:underline">
              View All Suggestions
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}