import React from "react";
import { FaTimes } from "react-icons/fa";

interface PostDetailsModalProps {
  post: any;
  onClose: () => void;
}

const PostDetailsModal = ({ post, onClose }: PostDetailsModalProps) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-primary text-white p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">Request Details</h2>
          <button onClick={onClose} className="btn btn-ghost btn-sm text-white">
            <FaTimes />
          </button>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold">Area</h3>
              <p>{post.area}</p>
            </div>
            <div>
              <h3 className="font-semibold">Barangay</h3>
              <p>{post.Barangay.name}</p>
            </div>
            <div>
              <h3 className="font-semibold">Contact Person</h3>
              <p>{post.person}</p>
            </div>
            <div>
              <h3 className="font-semibold">Contact Number</h3>
              <p>{post.contactNumber}</p>
            </div>
            <div>
              <h3 className="font-semibold">Drop-off Address</h3>
              <p>{post.dropOffAddress}</p>
            </div>
            <div>
              <h3 className="font-semibold">Landmark</h3>
              <p>{post.dropOffLandmark}</p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Needed Items</h3>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(post.inKind as Record<string, boolean>).map(
                ([key, value]) =>
                  value && (
                    <div key={key} className="bg-gray-100 p-2 rounded-md">
                      <p className="font-medium">{key}</p>
                      <p className="text-sm text-gray-600">
                        {post.specifications?.[key] || "Nothing specified"}
                      </p>
                    </div>
                  )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetailsModal; 