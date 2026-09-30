export interface IPost {
  id: number;
  text: string;
  image: string;
  likes_count: number;
  bookmarks_count: number;
  comments_count: number;
  created_at: string;
  profile: {
    username: string;
    full_name: string;
    profile_picture: string;
  };
   is_liked: boolean;
   is_bookmarked: boolean;
}