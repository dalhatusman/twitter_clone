"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Card, CardContent, CardFooter } from "./ui/card";
import { Button } from "./ui/button";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { IPost } from "@/types/post";

interface ICreatePostCard {
  onPostCreated: (post: IPost) => void;
}

const MAX_LENGTH = 280;

export default function CreatePostCard({ onPostCreated }: ICreatePostCard) {
  const { user } = useAuth();
  const [text, setText] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    setError(null);
    const file = e.target.files?.[0];

    if (!file?.type.startsWith("image/")) {
      setError("Only image files are allowed");
      return;
    }

    if (file) {
      setImage(file);
    } else {
      setError("Please select an image");
      return;
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!text.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("text", text);
      if (image) {
        formData.append("image", image);
      }
      const res = await api.post("/posts/", formData);
      onPostCreated(res.data);
      setText("");
    } catch (err: any) {
      console.error("Failed to create post:", err);
      setError(
        err.response?.data?.detail || "Failed to post. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  const remaining = MAX_LENGTH - text.length;
  const overLimit = remaining < 0;

  return (
    <Card className="w-full max-w-xl">
      <form onSubmit={handleSubmit}>
        <CardContent className="flex gap-3 px-4 py-3">
          <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-gray-200">
            {user?.profile_picture ? (
              <Image
                src={user.profile_picture}
                alt={user.username}
                width={40}
                height={40}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-gray-400 text-sm font-bold">
                {user?.username?.[0]?.toUpperCase()}
              </div>
            )}
          </div>

          <div>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="What's happening?"
              rows={2}
              className="w-full resize-none border-none bg-transparent text-base placeholder:text-muted-foreground focus:outline-none"
            />
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="cursor-pointer rounded-md bg-blue-500 px-3 py-2 text-sm text-white hover:bg-blue-600 transition"
              >
                Choose image
              </button>

              <span className="text-sm text-gray-500 truncate max-w-[180px]">
                {image?.name || "No file chosen"}
              </span>

              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
          </div>
        </CardContent>

        {error && <p className="px-4 text-sm text-red-500 mb-2">{error}</p>}

        <CardFooter className="flex items-center justify-between px-4 py-2 border-t">
          <span
            className={`text-xs ${overLimit ? "text-red-500 font-medium" : "text-muted-foreground"}`}
          >
            {remaining}
          </span>

          <Button
            type="submit"
            disabled={loading || !text.trim() || overLimit}
            className="rounded-full px-5 font-semibold"
          >
            {loading ? "Posting..." : "Post"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
