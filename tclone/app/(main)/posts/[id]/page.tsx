"use client";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { IPost } from "@/types/post";
import { IComment } from "@/types/comment";
import TCard from "@/components/TCard";
import { Button } from "@/components/ui/button";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarBadge,
} from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import CommentCard from "@/components/commentCard";
interface IPostDetail extends IPost {
  post: IPost;
  comments: IComment[];
}
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/navbar";
import LoadingLogo from "@/components/loadingLogo";

export default function PostDetail() {
  const { user } = useAuth();
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<IPostDetail | null>();
  const [posts, setPosts] = useState<IPost[]>([]);
  const [commentText, setCommentText] = useState<string>("");
  const [isloading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPostDetail() {
      try {
        const { data } = await api.get(`/posts/${id}`);
        setPost(data);
      } catch (err: any) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchPostDetail();
  }, [id]);

  async function handleCommentLike(postId: number, commentId: number) {
    try {
      const { data } = await api.post(
        `/posts/${postId}/comments/${commentId}/like/`,
      );

      if (post) {
        const newComments = post.comments.map((comment) =>
          comment.id === commentId
            ? {
                ...comment,
                is_liked: data.liked,
                likes_count: data.likes_count,
              }
            : comment,
        );

        setPost({ ...post, comments: newComments });
      }
    } catch (err) {
      console.error("Failed to like comment:", err);
    }
  }

  async function handleCommentBookmark(postId: number, commentId: number) {
    try {
      const { data } = await api.post(
        `/posts/${postId}/comments/${commentId}/bookmark/`,
      );
      console.log(data);
      if (post) {
        const newComments = post.comments.map((comment) =>
          comment.id === commentId
            ? {
                ...comment,
                is_bookmarked: data.bookmarked,
                bookmarks_count: data.bookmarks_count,
              }
            : comment,
        );

        setPost({ ...post, comments: newComments });
      }
    } catch (err) {
      console.error("Failed to bookmark comment", err);
    }
  }
  async function handleLike(postId: number) {
    try {
      const { data } = await api.post(`/posts/${postId}/like/`);
      if (post && post.id === postId) {
        setPost({
          ...post,
          is_liked: data.liked,
          likes_count: data.likes_count,
        });
      }
    } catch (err) {
      console.error("Failed to like post:", err);
    }
  }
  async function handleBookmark(postId: number) {
    try {
      const { data } = await api.post(`/posts/${postId}/bookmark/`);
      if (post && post.id === postId) {
        setPost({
          ...post,
          is_bookmarked: data.bookmarked,
          bookmarks_count: data.bookmarks_count,
        });
      }
    } catch (err) {
      console.error("Failed to bookmark post:", err);
    }
  }

  async function handleCommentSubmit(e: React.SubmitEvent) {
    e.preventDefault();

    try {
      const { data } = await api.post(`/posts/${id}/comments/`, {
        text: commentText,
      });

      setPost((prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          comments: [...prev.comments, data],
        };
      });

      setCommentText("");
    } catch (err: any) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }

  if (error) return <p>Error: {error}</p>;
  if (isloading) return <LoadingLogo fullScreen />;
  if (!post) return <p>No Post yet.... Tweet Something</p>;
  return (
    <>
      <div className="w-full max-w-xl">
        <TCard
          key={post.id}
          post={post}
          onLike={handleLike}
          onBookmark={handleBookmark}
        />

        {post.comments.map((comment) => (
          <CommentCard
            key={comment.id}
            comment={comment}
            onLike={(commentId) => handleCommentLike(post.id, commentId)}
            onBookmark={(commentId) =>
              handleCommentBookmark(post.id, commentId)
            }
          />
        ))}
        <form
          onSubmit={handleCommentSubmit}
          className="flex gap-3 border-b border-border px-4 py-3"
        >
          <Avatar className="h-9 w-9 shrink-0">
            <AvatarImage src={user?.profile_picture ?? undefined} />
            <AvatarFallback>{user?.username[0].toUpperCase()}</AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <Textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Post your reply"
              className="min-h-[60px] resize-none border-none shadow-none focus-visible:ring-0 px-0 text-base"
            />

            <div className="flex justify-end mt-2">
              <Button
                type="submit"
                disabled={!commentText.trim()}
                className="rounded-full px-5"
              >
                Reply
              </Button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
