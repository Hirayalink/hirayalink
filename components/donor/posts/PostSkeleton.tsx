import React from "react";

interface PostSkeletonProps {
  count: number;
}

const PostSkeleton: React.FC<PostSkeletonProps> = ({ count }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-lg shadow-md overflow-hidden p-4"
        >
          <div className="flex justify-between items-center mb-4">
            <div className="w-1/2 h-4 bg-gray-200 rounded"></div>
            <div className="w-1/4 h-4 bg-gray-200 rounded"></div>
          </div>
          <div className="w-full h-48 bg-gray-200 rounded-lg mb-4"></div>
          <div className="w-3/4 h-4 bg-gray-200 rounded mb-2"></div>
          <div className="w-1/2 h-4 bg-gray-200 rounded"></div>
        </div>
      ))}
    </>
  );
};

export default PostSkeleton;
