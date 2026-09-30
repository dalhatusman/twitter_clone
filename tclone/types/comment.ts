import {IPost} from '@/types/post'

export interface IComment{
  id: number;
  text: string;
  likes_count: number;
  comments_count: number;
  created_at: string;
  profile: {
    username: string;
    full_name: string;
    profile_picture: string;
  };
  is_liked: boolean;
  is_bookmarked: boolean
}