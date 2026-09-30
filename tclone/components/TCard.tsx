import Image from "next/image";
import { MessageCircle, Heart, Repeat2, Share, Bookmark } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { IPost } from "@/types/post";
import Link from "next/link";
import { formatDateTime } from "@/lib/format-date";

interface ITCard {
  post: IPost;
  onLike: (postId: number) => void;
  onBookmark: (postId: number) => void;
}

export default function TCard({ post, onLike, onBookmark }: ITCard) {
  return (
    <Card key={post.id} className="w-full max-w-xl">
      <CardHeader className="flex flex-row items-center gap-3 px-4 py-2">
        <Link
          href={`/profile/${post.profile.username}`}
          className="flex items-center gap-3 !text-inherit !no-underline group"
        >
          <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-gray-200">
            {post.profile.profile_picture ? (
              <Image
                src={post.profile.profile_picture}
                alt={post.profile.username}
                width={40}
                height={40}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-gray-400 text-sm font-bold">
                {post.profile.username[0].toUpperCase()}
              </div>
            )}
          </div>

          <div>
            <CardTitle className="text-sm group-hover:underline">
              {post.profile.full_name}
            </CardTitle>
            <CardDescription className="text-xs">
              @{post.profile.username}
            </CardDescription>
          </div>
        </Link>
      </CardHeader>

      <Link
        href={`/posts/${post.id}`}
        className="!text-inherit !no-underline hover:!no-underline"
      >
        <CardContent className="px-4 py-2">
          <p className="text-[15px] leading-5 whitespace-pre-wrap break-words">
            {post.text}
          </p>

          {post.image && (
            <div className="mt-3 overflow-hidden rounded-2xl max-h-80">
              <Image
                alt="Post image"
                src={post.image}
                width={600}
                height={300}
                className="h-auto max-h-80 w-full object-cover border-3 border-solid rounded-3xl border-gray-7~00"
              />
            </div>
          )}
        </CardContent>
      </Link>
      <div className="flex justify-end">
        <p className="text-xs mr-2 text-gray-700">
          Created on: {formatDateTime(post.created_at)}
        </p>
      </div>
      <CardFooter className="flex items-center justify-between px-4 py-2 text-muted-foreground">
        <Link
          href={`/posts/${post.id}`}
          className="flex items-center !text-inherit !no-underline gap-1.5 rounded-full p-1.5 hover:bg-accent hover:text-primary transition-colors"
        >
          <MessageCircle className="h-4 w-4" />
          <span className="text-xs">{post.comments_count}</span>
        </Link>

        <button className="flex items-center gap-1.5 rounded-full p-1.5 hover:bg-accent hover:text-green-600 transition-colors">
          <Repeat2 className="h-4 w-4" />
        </button>

        <button
          onClick={() => onLike(post.id)}
          className={`flex items-center gap-1.5 rounded-full p-1.5 hover:bg-like-soft hover:text-like transition-colors ${
            post.is_liked ? "text-red-500" : ""
          }`}
        >
          <Heart
            className={`h-4 w-4 ${post.is_liked ? "fill-current text-red-500" : ""}`}
          />
          <span className="text-xs">{post.likes_count}</span>
        </button>

        <button className="flex items-center gap-1.5 rounded-full p-1.5 hover:bg-accent hover:text-primary transition-colors">
          <Share className="h-4 w-4" />
        </button>

        <button
          onClick={() => onBookmark(post.id)}
          className={`flex items-center gap-1.5 rounded-full p-1.5 hover:bg-accent hover:text-primary transition-colors ${
            post.is_bookmarked ? "text-amber-500" : ""
          }`}
        >
          <Bookmark
            className={`h-4 w-4 ${post.is_bookmarked ? "fill-current text-amber-500" : ""}`}
          />
          <span className="text-xs">{post.bookmarks_count}</span>
        </button>
      </CardFooter>
    </Card>
  );
}
