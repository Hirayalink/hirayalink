import { useState } from "react";
import { FaTrash } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface DonationItem {
  itemName: string;
  quantity: number;
  category: string;
}

export default function DonationModal({ post, isOpen, onClose }: { post: any; isOpen: boolean; onClose: () => void }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [donationItems, setDonationItems] = useState<DonationItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availableCategories = Object.entries(post.inKind as Record<string, boolean>)
    .filter(([_, value]) => value)
    .map(([key]) => key);

  const addItemToCategory = (category: string) => {
    setDonationItems([
      ...donationItems,
      { itemName: '', quantity: 1, category }
    ]);
  };

  const updateDonationItem = (index: number, field: keyof DonationItem, value: string | number) => {
    const newItems = [...donationItems];
    newItems[index] = { ...newItems[index], [field]: value };
    setDonationItems(newItems);
  };

  const removeItem = (index: number) => {
    setDonationItems(donationItems.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!session?.user?.id) {
      toast.error("Please login to make a donation");
      router.push('/login');
      return;
    }

    if (donationItems.some(item => !item.itemName.trim() || item.quantity < 1)) {
      toast.error("Please fill in all item details correctly");
      return;
    }

    try {
      setIsSubmitting(true);
      
      const response = await fetch('/api/donation-pledge', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postId: post.id,
          items: donationItems.map(item => ({
            name: `${item.category} - ${item.itemName}`,
            quantity: item.quantity,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit donation');
      }

      toast.success("Donation pledged successfully!");
      router.refresh();
      onClose();
      setDonationItems([]);
    } catch (error) {
      console.error('Error:', error);
      toast.error("Failed to submit donation");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <dialog open={isOpen} className="modal modal-open">
      <div className="modal-box max-w-2xl bg-white w-[90%] sm:w-full mx-4 p-4">
        <div className="flex justify-between bg-primary text-white items-center sticky top-0 p-3 sm:p-5">
          <h3 className="font-bold text-base sm:text-lg">Make a Donation</h3>
          <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost">✕</button>
        </div>
        
        {availableCategories.length === 0 ? (
          <p className="text-center text-gray-500 my-4">No items needed for this request.</p>
        ) : (
          availableCategories.map((category) => (
            <div key={category} className="p-5">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold capitalize">{category}</h3>
                <button
                  onClick={() => addItemToCategory(category)}
                  className="btn btn-sm btn-ghost"
                >
                  + Add Item
                </button>
              </div>
              
              {post.specifications?.[category] && (
                <p className="text-sm text-gray-600 mb-2">
                  Specification: {post.specifications[category]}
                </p>
              )}

              {donationItems
                .filter(item => item.category === category)
                .map((item, idx) => {
                  const globalIndex = donationItems.findIndex(
                    di => di === item
                  );
                  return (
                    <div key={`${category}-${idx}`} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        placeholder="Item description"
                        className="input input-bordered flex-grow mb-2"
                        value={item.itemName}
                        onChange={(e) => updateDonationItem(globalIndex, 'itemName', e.target.value)}
                      />
                      <input
                        type="number"
                        min="1"
                        className="input input-bordered w-full sm:w-24 mb-2"
                        value={item.quantity}
                        onChange={(e) => updateDonationItem(globalIndex, 'quantity', parseInt(e.target.value))}
                      />
                      <button
                        onClick={() => removeItem(globalIndex)}
                        className="btn btn-ghost btn-square"
                      >
                        <FaTrash className="text-error" />
                      </button>
                    </div>
                  );
                })}
            </div>
          ))
        )}

        <div className="modal-action mb-5 mr-5">
          <div className="flex gap-2">
            <button 
              className="btn btn-ghost" 
              onClick={() => {
                setDonationItems([]);
                onClose();
              }}
            >
              Cancel
            </button>
            <button 
              onClick={handleSubmit}
              className="btn btn-primary text-white"
              disabled={donationItems.length === 0 || isSubmitting}
              type="button"
            >
              {isSubmitting ? (
                <>
                  <span className="loading loading-spinner"></span>
                  Submitting...
                </>
              ) : (
                'Submit Donation'
              )}
            </button>
          </div>
        </div>
      </div>
      <div className="modal-backdrop bg-black/50" onClick={onClose}></div>
    </dialog>
  );
}
