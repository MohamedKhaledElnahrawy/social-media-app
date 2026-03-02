import React from "react";
import { Card, Button, Avatar, Spinner } from "@heroui/react";
import { UserPlus, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { getFollowSuggestions, sendFollowApi } from "../services/PostServices";
import { Link } from "react-router-dom";
import LoadingScreen from "../components/LoadingScreen";

{
  /* **************************************************************************/
}

export default function FollowersPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useInfiniteQuery({
    queryKey: ["allSuggestions"],

    queryFn: ({ pageParam = 1 }) => {
      const currentLimit = pageParam === 1 ? 30 : 20;

      return getFollowSuggestions(currentLimit, pageParam);
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { currentPage, numberOfPages } = lastPage.meta.pagination;
      return currentPage < numberOfPages ? currentPage + 1 : undefined;
    },
  });

  // ********************************************************************

  const { mutate: handleFollow, variables: activeId } = useMutation({
    mutationFn: (userId) => sendFollowApi(userId),
    onSuccess: (data) => {
      console.log("✅ Follow process succeeded in FollowersPage:", data);
      queryClient.invalidateQueries({ queryKey: ["allSuggestions"] });
      queryClient.invalidateQueries({ queryKey: ["followSuggestions"] });
    },
    onError: (error) => {
      console.error("❌ Follow failed:", error);
    },
  });

  {
    /* **************************************************************************/
  }

  if (isLoading)
    return (
      <div className="">
        <LoadingScreen />
      </div>
    );

  {
    /* **************************************************************************/
  }

  if (isError)
    return (
      <div className="text-center p-20 text-red-500">
        Error: {error.message}
      </div>
    );

  {
    /* **************************************************************************/
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button
          isIconOnly
          variant="flat"
          radius="full"
          onPress={() => navigate(-1)}
        >
          <ChevronLeft size={20} />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Suggested Friends
          </h1>
          <p className="text-gray-500 text-sm">Discover people you may know</p>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {data?.pages?.map((page, index) => (
          <React.Fragment key={index}>
            {page.data.suggestions.map((user) => (
              <Card
                key={user._id}
                className="p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4 w-full">
                    <Link
                      to={`/profile/${user._id}`}
                      className="hover:opacity-80 transition-opacity shrink-0"
                    >
                      <Avatar
                        src={user.photo}
                        className="w-14 h-14 border-2 border-white shadow-sm"
                      />
                    </Link>

                    <div className="flex flex-col overflow-hidden">
                      <Link
                        to={`/profile/${user._id}`}
                        className="hover:underline truncate"
                      >
                        <span className="font-bold text-gray-900 leading-tight">
                          {user.name}
                        </span>
                      </Link>
                      <span className="text-sm text-gray-500 truncate">
                        @{user.username || "user"}
                      </span>
                      <span className="text-[11px] font-medium text-blue-600 mt-1 bg-blue-50 px-2 py-0.5 rounded-full w-fit">
                        {user.followersCount} followers
                      </span>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    color="primary"
                    className="font-bold shadow-sm w-full sm:w-auto shrink-0"
                    startContent={
                      activeId !== user._id && <UserPlus size={16} />
                    }
                    isLoading={activeId === user._id}
                    onPress={() => handleFollow(user._id)}
                  >
                    Follow
                  </Button>
                </div>
              </Card>
            ))}
          </React.Fragment>
        ))}
      </div>

      {/* View More Button */}
      {hasNextPage && (
        <div className="flex justify-center mt-12 mb-10">
          <Button
            onPress={() => fetchNextPage()}
            isLoading={isFetchingNextPage}
            variant="bordered"
            color="primary"
            className="px-12 font-bold border-2 h-12"
          >
            {isFetchingNextPage ? "Loading more..." : "View More"}
          </Button>
        </div>
      )}
    </div>
  );
}


