"use client";
import {
  Dialog,
  DialogTrigger,
  DialogDescription,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import TCard from "@/components/TCard";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import { IPost } from "@/types/post";
import Navbar from "@/components/navbar";
import { CirclePlus } from "lucide-react";
import RightSidebar from "@/components/rightSideBar";
import CreatePostCard from "@/components/createPost";
import { LogOut } from "lucide-react";
import LoadingLogo from "@/components/loadingLogo";

export default function Home() {
  const [text, setText] = useState<string>("");
  const [posts, setPosts] = useState<IPost[]>([]);
  const [open, setOpen] = useState(false);
  const [isloading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handlePostCreated = (newPost: IPost) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  useEffect(() => {
    async function fetchPosts() {
      try {
        const { data } = await api.get<IPost[]>("/posts/");
        setPosts(data);
      } catch (err: any) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPosts();
  }, []);

  async function handleLike(postId: number) {
    try {
      const { data } = await api.post(`/posts/${postId}/like/`);
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
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
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? {
                ...post,
                is_bookmarked: data.bookmarked,
                bookmarks_count: data.bookmarks_count,
              }
            : post,
        ),
      );
    } catch (err) {
      console.error("Failed to like post:", err);
    }
  }

  if (isloading) return <LoadingLogo fullScreen />;
  // return (
  //   <div className="min-h-screen flex items-center justify-center text-xl font-bold text-gray-700">
  //     Loading...
  //   </div>
  // );
  if (error) return <p>Something went wrong</p>;
  return (
    <>
      {posts.length != 0 ? (
        <div className="relative">
          <div className="space-y-2">
            {posts.map((post) => (
              <TCard
                key={post.id}
                post={post}
                onLike={handleLike}
                onBookmark={handleBookmark}
              />
            ))}
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger>
              <button className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 active:scale-95 transition">
                <CirclePlus className="h-7 w-7" />
              </button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create a post</DialogTitle>
              </DialogHeader>
              <CreatePostCard
                onPostCreated={(post) => {
                  handlePostCreated(post);
                  setOpen(false);
                }}
              />
            </DialogContent>
          </Dialog>
        </div>
      ) : (
        <div className="flex justify-center items-center flex-col gap-3">
          <p>No tweets yet..</p>
          <Button className="rounded-full">Create Post</Button>
        </div>
      )}
    </>
  );
}
