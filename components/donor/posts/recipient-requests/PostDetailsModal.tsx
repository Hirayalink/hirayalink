import React from "react";
import { FaTimes } from "react-icons/fa";
import { PostDetailsModalProps } from "@/types/recipient";

const PostDetailsModal = ({ post, onClose }: PostDetailsModalProps) => {
  const parseJsonSafely = (data: string) => {
    try {
      return JSON.parse(data);
    } catch {
      return data;
    }
  };

  const inKindNecessities = parseJsonSafely(post.inKindNecessities);
  const specifications = parseJsonSafely(post.specifications);

  // Helper function to handle both object and string cases
  const renderItems = () => {
    if (typeof inKindNecessities === 'string') {
      console.log('inKindNecessities:', inKindNecessities);
      console.log('specifications:', specifications);

      return inKindNecessities.split(',').map((necessity: string, index: number) => {
        const trimmedNecessity = necessity.trim().replace(/['{}"]/g, '');
        console.log('Processing necessity:', trimmedNecessity);

        // Handle specifications as an object
        const correspondingSpecification = typeof specifications === 'object' && specifications !== null
          ? specifications[trimmedNecessity]
          : null;

        console.log('Found specification:', correspondingSpecification);

        return (
          <div key={index} className="mb-3">
            <p className="font-medium">{trimmedNecessity}</p>
            <p className="text-sm text-gray-600">
              Specifications: {correspondingSpecification || 'Not Specified'}
            </p>
          </div>
        );
      });
    }

    // Handle case where it's an object
    return Object.entries(inKindNecessities).map(([category, items]) => (
      <div key={category} className="mb-3">
        <p className="font-medium">{category}</p>
        <p>{items as string}</p>
        <p className="text-sm text-gray-600">
          Specifications: {
            typeof specifications === 'object' && specifications !== null
              ? (specifications[category] || "Not Specified")
              : (specifications || "Not Specified")
          }
        </p>
      </div>
    ));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-primary text-white p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">Recipient Request Details</h2>
          <button onClick={onClose} className="btn btn-ghost btn-sm text-white">
            <FaTimes />
          </button>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold">Complete Name</h3>
              <p>{post.completeName}</p>
            </div>
            <div>
              <h3 className="font-semibold">Age</h3>
              <p>{post.age}</p>
            </div>
            <div>
              <h3 className="font-semibold">Number of Family Members</h3>
              <p>{post.noOfFamilyMembers}</p>
            </div>
            <div>
              <h3 className="font-semibold">Contact Number</h3>
              <p>{post.contactNumber}</p>
            </div>
            {post.emailAddress && (
              <div>
                <h3 className="font-semibold">Email Address</h3>
                <p>{post.emailAddress}</p>
              </div>
            )}
            <div>
              <h3 className="font-semibold">Barangay</h3>
              <p>{post.barangayName}</p>
            </div>
            <div>
              <h3 className="font-semibold">Area</h3>
              <p>{post.area}</p>
            </div>
            <div>
              <h3 className="font-semibold">Type of Calamity</h3>
              <p>{post.typeOfCalamity}</p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Needed Items</h3>
            <div className="bg-gray-100 p-3 rounded-md">
              {renderItems()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetailsModal; 