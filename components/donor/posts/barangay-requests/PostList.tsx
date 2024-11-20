import React from "react";
import PostItem from "./PostItem";
import Loading from "@/app/loading";

const PostList = ({
  posts,
  handleOpenModal,
  handleLikeClick,
  likedPosts,
  isLoading,
  error,
  handleViewDonations,
}: {
  posts: any;
  handleOpenModal: any;
  handleLikeClick: any;
  likedPosts: any;
  isLoading: any;
  error: any;
  handleViewDonations: any;
}) => {
  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (posts.length === 0) {
    return <p className="text-center">No posts available</p>;
  }

  return (
    <div className="space-y-4 p-4 max-w-screen-md">
      {posts.map((post: any) => (
        <PostItem
          key={post.id}
          post={post}
          handleOpenModal={handleOpenModal}
          handleLikeClick={handleLikeClick}
          likedPosts={likedPosts}
          handleViewDonations={handleViewDonations}
        />
      ))}
    </div>
  );
};

export default PostList;
