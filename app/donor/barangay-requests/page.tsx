"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useSession } from "next-auth/react";
import PostList from "@/components/donor/posts/barangay-requests/PostList";
import DonationModal from "@/components/donor/posts/barangay-requests/DonationModal";
import PostDetailsModal from "@/components/donor/posts/barangay-requests/PostDetailsModal";
import CommentModal from "@/components/donor/posts/barangay-requests/CommentModal";
import debounce from "lodash.debounce";
import { useRouter } from "next/navigation";

interface BarangayRequestPost {
  id: string;
  area: string;
  person: string;
  typeOfCalamity: string;
  inKind: string;
  contactNumber: string;
  dropOffAddress: string;
  dropOffLandmark: string;
  image: Buffer | null;
  dateTime: Date;
  likes: { id: string; userId: string }[];
  comments: { id: string; content: string; userId: string }[];
  likedByUser?: boolean;
}

export default function BarangayRequests() {
  const { data: session } = useSession();
  const [posts, setPosts] = useState<BarangayRequestPost[]>([]);
  const [showComments, setShowComments] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [selectedBarangay, setSelectedBarangay] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [barangays, setBarangays] = useState<{ id: string; name: string }[]>(
    []
  );
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);
  const [modalType, setModalType] = useState<
    "donate" | "details" | "comments" | null
  >(null);
  const router = useRouter();

  useEffect(() => {
    const fetchBarangays = async () => {
      try {
        const response = await fetch("/api/barangays");
        if (!response.ok) {
          throw new Error("Failed to fetch barangays");
        }
        const data = await response.json();
        setBarangays(data);
      } catch (error) {
        console.error("Error fetching barangays:", error);
      }
    };

    fetchBarangays();
  }, []);

  const fetchPosts = useCallback(async (barangay: string, page: number) => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `/api/posts?type=barangay&area=${barangay}&page=${page}&limit=10`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch posts");
      }
      const data = await response.json();
      setPosts((prevPosts) => [...prevPosts, ...data.posts]);
      setHasMore(data.hasMore);
      const initialLikedPosts = new Set(
        data.posts
          .filter((post: any) => post.likedByUser)
          .map((post: any) => post.id)
      );
      setLikedPosts(
        (prevLikedPosts: any) =>
          new Set([...prevLikedPosts, ...(initialLikedPosts as any)])
      );
    } catch (error) {
      console.error("Error fetching posts:", error);
      setError("Failed to load posts. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const debouncedFetchPosts = useMemo(
    () => debounce(fetchPosts, 300),
    [fetchPosts]
  );

  useEffect(() => {
    setPosts([]); // Clear posts when barangay changes
    setPage(1); // Reset page number
    debouncedFetchPosts(selectedBarangay, 1);
  }, [selectedBarangay, debouncedFetchPosts]);

  const lastPostElementRef = useCallback(
    (node: any) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage: number) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore]
  );

  useEffect(() => {
    if (page > 1) {
      debouncedFetchPosts(selectedBarangay, page);
    }
  }, [page, selectedBarangay, debouncedFetchPosts]);

  const handleOpenModal = (
    type: "donate" | "details" | "comments",
    postId: string
  ) => {
    if (type === "donate" && !session?.user) {
      router.push("/api/auth/signin");
      return;
    }

    setModalType(type);
    setSelectedPostId(postId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalType(null);
    setSelectedPostId(null);
    setIsModalOpen(false);
  };

  const handleLikeClick = async (postId: string) => {
    try {
      const response = await fetch(`/api/posts/${postId}/like?type=barangay`, {
        method: "POST",
      });
      if (response.ok && session?.user?.id) {
        const data = await response.json();
        setPosts((prevPosts: any) =>
          prevPosts.map((post: any) =>
            post.id === postId
              ? {
                  ...post,
                  likes: data.liked
                    ? [
                        ...post.likes,
                        {
                          id: Date.now().toString(),
                          userId: session.user.id,
                        },
                      ]
                    : post.likes.filter(
                        (like: any) => like.userId !== session?.user?.id
                      ),
                }
              : post
          )
        );
        setLikedPosts((prevLikedPosts) => {
          const newLikedPosts = new Set<string>(prevLikedPosts);
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

  const handleViewDonations = (postId: string) => {
    router.push(`/donor/donation-tracking?postId=${postId}`);
  };

  const toggleComments = (postId: string) => {
    setShowComments((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const handleAddComment = async (postId: string, content?: string) => {
    if (!content?.trim() || !session?.user) return;

    try {
      const response = await fetch(
        `/api/posts/${postId}/comment?type=barangay`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content }),
        }
      );

      if (response.ok) {
        const newComment = await response.json();
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.id === postId
              ? {
                  ...post,
                  comments: [
                    ...post.comments,
                    {
                      id: newComment.id,
                      content: newComment.content,
                      userId: newComment.userId,
                      user: {
                        id: session.user.id,
                        name: session.user.name,
                      },
                    },
                  ],
                }
              : post
          )
        );
        handleCloseModal();
        handleOpenModal("comments", postId);
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  return (
    <div className="flex flex-col justify-center w-full">
      <div className="hero-background bg-cover max-h-[20rem] mb-5 sticky top-16 z-20 w-full">
        <div className="flex justify-between pt-10 pb-5 backdrop-blur-sm bg-black/25 w-full">
          <div className="container mx-auto px-4 flex justify-between items-center">
            <div className="invisible shrink-0 w-1/4"></div>
            <div className="flex flex-col items-center flex-grow">
              <h1 className="mb-0 py-0 text-3xl font-bold text-white">
                Barangay Donation Request Post
              </h1>
              <p className="text-center text-white mt-2 text-lg">
                {selectedBarangay
                  ? `Official requests from ${selectedBarangay}`
                  : "Official requests from all Barangays"}
              </p>
            </div>
            <div className="w-1/4 flex justify-end">
              <select
                value={selectedBarangay}
                onChange={(e) => setSelectedBarangay(e.target.value)}
                className="select select-bordered w-min max-w-xs"
              >
                <option value="">All Areas</option>
                {barangays.map((barangay) => (
                  <option key={barangay.id} value={barangay.name}>
                    {barangay.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-4xl">
        <PostList
          posts={posts}
          handleOpenModal={handleOpenModal}
          handleLikeClick={handleLikeClick}
          likedPosts={likedPosts}
          isLoading={isLoading}
          error={error}
          handleViewDonations={handleViewDonations}
        />

        {selectedPostId && modalType === "donate" && (
          <DonationModal
            post={posts.find((p) => p.id === selectedPostId)}
            isOpen={isModalOpen}
            onClose={handleCloseModal}
          />
        )}

        {selectedPostId && modalType === "details" && (
          <PostDetailsModal
            post={posts.find((p) => p.id === selectedPostId)}
            onClose={handleCloseModal}
          />
        )}

        {selectedPostId && modalType === "comments" && (
          <CommentModal
            post={posts.find((p) => p.id === selectedPostId)}
            onClose={handleCloseModal}
            onAddComment={async (content) => {
              await handleAddComment(selectedPostId, content);
            }}
          />
        )}

        {message && (
          <div className="fixed bottom-4 right-4 bg-primary text-white p-4 rounded-lg shadow-lg">
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
