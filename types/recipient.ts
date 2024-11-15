export interface Comment {
  id: string;
  content: string;
  userId: string;
  createdAt: Date;
  user: {
    id: string;
    name: string;
  };
}

export interface RecipientRequests {
  id: string;
  completeName: string;
  age: number;
  noOfFamilyMembers: number;
  contactNumber: string;
  emailAddress?: string;
  barangayId: string;
  barangayName: string;
  area: string;
  typeOfCalamity: string;
  inKindNecessities: string;
  specifications: string;
  uploadedPhoto: Buffer | null;
  dateTime: string;
  likes: string[];
  comments: Comment[];
  likedByUser?: boolean;
}

export interface PostDetailsModalProps {
  post: RecipientRequests;
  onClose: () => void;
}

export interface PostProps {
  post: RecipientRequests;
  handleLikeClick: (postId: string) => Promise<void>;
  toggleComments: (postId: string) => void;
  showComments: { [key: string]: boolean };
  newComment: { [key: string]: string };
  setNewComment: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>;
  handleAddComment: (postId: string, content: string) => Promise<void>;
  likedPosts: Set<string>;
  onOpenDetails: () => void;
  ref?: React.RefObject<HTMLDivElement>;
} 