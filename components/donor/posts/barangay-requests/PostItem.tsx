import React from "react";
import Image from "next/image";
import { FaThumbsUp, FaComment, FaInfoCircle } from "react-icons/fa";
import { MdVolunteerActivism } from "react-icons/md";

interface PostItemProps {
  post: any;
  handleOpenModal: (
    type: "donate" | "details" | "comments",
    postId: string
  ) => void;
  handleLikeClick: (postId: string) => void;
  likedPosts: Set<string>;
  handleViewDonations: (postId: string) => void;
}

const PostItem = ({
  post,
  handleOpenModal,
  handleLikeClick,
  likedPosts,
  handleViewDonations,
}: PostItemProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-lg font-semibold">
              {post.typeOfCalamity} from {post.area}: Batch {post.batchNumber}
            </h3>
          </div>
          <span className="text-sm text-gray-500">
            {new Date(post.dateTime).toLocaleDateString()}
          </span>
        </div>

        <div className="flex gap-2 flex-wrap mb-4">
          <span className="px-2 py-1 bg-primary/10 rounded-full text-sm">
            {post.Barangay.name}
          </span>
        </div>

        {post.image && (
          <Image
            src={`data:image/jpeg;base64,${Buffer.from(post.image).toString(
              "base64"
            )}`}
            alt="Calamity"
            width={400}
            height={300}
            className="w-full h-48 object-cover rounded-lg mb-4"
          />
        )}

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleLikeClick(post.id)}
              className={`btn btn-xs sm:btn-sm ${
                likedPosts.has(post.id) ? "btn-primary" : "btn-ghost"
              }`}
            >
              <FaThumbsUp /> {post.likes.length}
            </button>
            <button
              onClick={() => handleOpenModal("comments", post.id)}
              className="btn btn-xs sm:btn-sm btn-ghost"
            >
              <FaComment /> {post.comments.length}
            </button>
            <button
              onClick={() => handleOpenModal("donate", post.id)}
              className="btn btn-xs sm:btn-sm btn-primary"
            >
              <MdVolunteerActivism /> Donate
            </button>
            <button
              onClick={() => handleViewDonations(post.id)}
              className="btn btn-xs sm:btn-sm btn-secondary"
            >
              View Donations
            </button>
          </div>
          <button
            onClick={() => handleOpenModal("details", post.id)}
            className="btn btn-xs sm:btn-sm btn-ghost"
          >
            <FaInfoCircle /> Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostItem;
