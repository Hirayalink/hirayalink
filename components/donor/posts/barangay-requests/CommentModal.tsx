import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";

interface CommentModalProps {
  post: any;
  onClose: () => void;
  onAddComment: (content: string) => Promise<void>;
}

const CommentModal = ({ post, onClose, onAddComment }: CommentModalProps) => {
  const [newComment, setNewComment] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      await onAddComment(newComment);
      setNewComment("");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[80vh] flex flex-col">
        <div className="sticky top-0 bg-primary text-white p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">Comments</h2>
          <button onClick={onClose} className="btn btn-ghost btn-sm text-white">
            <FaTimes />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {post.comments.map((comment: any) => (
            <div key={comment.id} className="mb-4 bg-gray-50 p-3 rounded-lg">
              <p className="font-semibold text-sm text-gray-600">
                {comment.user.name}
              </p>
              <p className="text-gray-800">{comment.content}</p>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="p-4 border-t">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full p-2 border rounded-lg mb-2"
            placeholder="Write a comment..."
            rows={3}
          />
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="btn btn-ghost">
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary text-white"
              disabled={!newComment.trim()}
            >
              Post Comment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CommentModal;
