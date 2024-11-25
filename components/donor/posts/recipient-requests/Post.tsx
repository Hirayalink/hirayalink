import React, { forwardRef } from "react";
import Image from "next/image";
import { FaThumbsUp, FaComment, FaInfoCircle } from "react-icons/fa";
import type { RecipientRequests } from "@/types/recipient";

interface PostProps {
  posts: RecipientRequests[];
  handleLikeClick: (postId: string) => void;
  handleAddComment: (postId: string, content: string) => void;
  likedPosts: Set<string>;
  onOpenDetails: (post: RecipientRequests) => void;
  lastPostRef: (node: HTMLDivElement | null) => void;
}

const Post = forwardRef<HTMLDivElement, PostProps>(
  ({ posts, handleLikeClick, handleAddComment, likedPosts, onOpenDetails, lastPostRef }, ref) => {
    if (posts.length === 0) {
      return <div>No posts available.</div>;
    }

    return (
      <div className="space-y-4">
        {posts.map((post, index) => (
          <div
            key={post.id}
            ref={index === posts.length - 1 ? lastPostRef : null}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-lg font-semibold">
                    {post.completeName} ({post.age} years old)
                  </h3>
                  <div className="text-sm text-gray-600">
                    Family Members: {post.noOfFamilyMembers}
                  </div>
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(post.dateTime).toLocaleDateString()}
                </span>
              </div>

              <div className="flex gap-2 flex-wrap mb-4">
                <span className="px-2 py-1 bg-primary/10 rounded-full text-sm">
                  {post.barangayName}
                </span>
                <span className="px-2 py-1 bg-primary/10 rounded-full text-sm">
                  {post.typeOfCalamity}
                </span>
              </div>

              {post.uploadedPhoto && (
                <Image
                  src={`data:image/jpeg;base64,${Buffer.from(post.uploadedPhoto).toString("base64")}`}
                  alt="Request"
                  width={400}
                  height={300}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
              )}

              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <button
                    onClick={() => handleLikeClick(post.id)}
                    className={`btn btn-sm ${
                      likedPosts.has(post.id) ? "btn-primary" : "btn-ghost"
                    }`}
                  >
                    <FaThumbsUp /> {post.likes.length}
                  </button>
                  <button
                    onClick={() => handleAddComment(post.id, "")}
                    className="btn btn-sm btn-ghost"
                  >
                    <FaComment /> {post.comments.length}
                  </button>
                </div>
                <button 
                  onClick={() => onOpenDetails(post)}
                  className="btn btn-sm btn-ghost"
                >
                  <FaInfoCircle /> Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
);

Post.displayName = 'Post';

export default Post;
