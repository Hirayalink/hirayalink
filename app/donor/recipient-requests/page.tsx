"use client";

import { useState, useEffect, useRef, useCallback, Suspense } from "react";
import PostList from "@/components/donor/posts/recipient-requests/Post";
import PostDetailsModal from "@/components/donor/posts/recipient-requests/PostDetailsModal";
import type { RecipientRequests } from "@/types/recipient";
import PostSkeleton from "@/components/donor/posts/PostSkeleton";

export default function RecipientRequests() {
  const [posts, setPosts] = useState<RecipientRequests[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);
  const [selectedPost, setSelectedPost] = useState<RecipientRequests | null>(
    null
  );

  const lastPostElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore]
  );

  const fetchPosts = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`/api/posts?type=recipient&page=${page}&limit=10`);
      if (!response.ok) {
        throw new Error("Failed to fetch posts");
      }
      const data = await response.json();

      setPosts((prevPosts) => {
        if (page === 1) return data.posts;
        const newPosts = data.posts.filter(
          (post: RecipientRequests) => !prevPosts.some((p) => p.id === post.id)
        );
        return [...prevPosts, ...newPosts];
      });

      setHasMore(data.posts.length > 0 && data.hasMore);

      const initialLikedPosts = new Set(
        data.posts
          .filter(
            (post: RecipientRequests & { likedByUser?: boolean }) =>
              post.likedByUser
          )
          .map((post: RecipientRequests) => post.id)
      );
      setLikedPosts((prevLikedPosts) => {
        const prevArray = Array.from(prevLikedPosts);
        const newArray = Array.from(initialLikedPosts) as string[];
        return new Set<string>([...prevArray, ...newArray]);
      });
    } catch (error) {
      console.error("Error fetching posts:", error);
      setError("Failed to load posts. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleLikeClick = async (postId: string) => {
    try {
      const response = await fetch(`/api/posts/${postId}/like?type=recipient`, {
        method: "POST",
      });
      if (response.ok) {
        const data = await response.json();
        console.log("Like response:", data); // Log the response

        setPosts((prevPosts) =>
          prevPosts.map((post: RecipientRequests) =>
            post.id === postId
              ? {
                  ...post,
                  likes: data.liked
                    ? [...post.likes, String(Date.now())] // Convert number to string
                    : post.likes.slice(0, -1),
                }
              : post
          )
        );

        setLikedPosts((prevLikedPosts) => {
          const newLikedPosts = new Set(prevLikedPosts);
          if (data.liked) {
            newLikedPosts.add(postId);
          } else {
            newLikedPosts.delete(postId);
          }
          return newLikedPosts;
        });
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const handleAddComment = async (postId: string, content: string) => {
    try {
      const response = await fetch(
        `/api/posts/${postId}/comment?type=recipient`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content }),
        }
      );
      if (response.ok) {
        const newCommentData = await response.json();
        
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.id === postId
              ? { 
                  ...post, 
                  comments: [...post.comments, newCommentData]
                }
              : post
          )
        );
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleOpenPostDetails = (post: RecipientRequests) => {
    setSelectedPost(post);
  };

  const handleClosePostDetails = () => {
    setSelectedPost(null);
  };

  return (
    <div>
      <div className="hero-background bg-cover max-h-[20rem] mb-5 sticky top-16 z-20 w-full">
        <div className="text-center py-10 backdrop-blur-sm bg-black/25">
          <h1 className="mb-0 py-0 text-3xl font-bold text-white">
            Recipient Donation Request Post
          </h1>
        </div>
      </div>

      {/* Posts section */}
      <div className="container mx-auto px-4 max-w-4xl space-y-6">
        <Suspense fallback={<PostSkeleton count={3} />}>
          <PostList
            posts={posts}
            handleLikeClick={handleLikeClick}
            handleAddComment={handleAddComment}
            likedPosts={likedPosts}
            onOpenDetails={handleOpenPostDetails}
            lastPostRef={lastPostElementRef}
          />
        </Suspense>
        {isLoading && <PostSkeleton count={3} />}
        {error && <p className="text-red-500 text-center">{error}</p>}
      </div>

      {selectedPost && (
        <PostDetailsModal
          post={selectedPost}
          onClose={handleClosePostDetails}
        />
      )}
    </div>
  );
}
