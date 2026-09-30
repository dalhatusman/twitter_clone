"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import TCard from "@/components/TCard";
import { IPost } from "@/types/post";

export default function HistoryPage() {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const handlePostCreated = (newPost: IPost) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  useEffect(() => {
    async function fetchBookmarks() {
      try {
        const { data } = await api.get<IPost[]>("/posts/bookmarks/");
        setPosts(data);
      } catch (err: any) {
        console.error("Failed to load bookmarks:", err);
        setError("Could not load your bookmarks");
      } finally {
        setLoading(false);
      }
    }
    fetchBookmarks();
  }, []);

  async function handleLike(postId: number) {
    try {
      const { data } = await api.post(`/posts/${postId}/like/`);
      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId
            ? { ...post, is_liked: data.liked, likes_count: data.likes_count }
            : post,
        ),
      );
    } catch (err) {
      console.error("Failed to like post:", err);
    }
  }

  async function handleBookmark(postId: number) {
    try {
      const { data } = await api.post(`/posts/${postId}/bookmark/`);
      if (!data.bookmarked) {
        // If they un-bookmark from the history page, remove it from view immediately
        setPosts((prev) => prev.filter((post) => post.id !== postId));
      }
    } catch (err) {
      console.error("Failed to bookmark post:", err);
    }
  }

  if (loading)
    return <p className="text-center mt-10 text-gray-500">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-gray-500">{error}</p>;

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <h1 className="text-xl font-bold mb-6">Bookmarks</h1>

      {posts.length === 0 ? (
        <p className="text-gray-400 text-sm text-center py-8">
          No bookmarks yet
        </p>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <TCard
              key={post.id}
              post={post}
              onLike={handleLike}
              onBookmark={handleBookmark}
            />
          ))}
        </div>
      )}
    </div>
  );
}
