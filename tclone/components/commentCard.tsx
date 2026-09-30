import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "./ui/card";
import { IComment } from "@/types/comment";
import { Heart, Bookmark, MessageCircle, Share, Repeat2 } from "lucide-react";
interface ICommentCard {
  comment: IComment;
  onLike: (commentId: number) => void;
  onBookmark: (commentId: number) => void;
}

export default function CommentCard({
  comment,
  onLike,
  onBookmark,
}: ICommentCard) {
  return (
    <div
      key={comment.id}
      className="border-b border-border px-4 py-3 hover:bg-accent/30 transition-colors "
    >
      <div className="flex items-center gap-2">
        <Avatar className="h-9 w-9 shrink-0">
          <AvatarImage src={comment.profile.profile_picture ?? undefined} />
          <AvatarFallback>
            {comment.profile.username[0].toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="flex items-baseline gap-1.5 min-w-0">
          <span className="text-sm font-semibold truncate">
            {comment.profile.full_name}
          </span>
          <span className="text-xs text-muted-foreground truncate">
            @{comment.profile.username}
          </span>
        </div>
      </div>

      <p className="text-sm leading-5 mt-2 ml-11">{comment.text}</p>

      <div className="flex items-center justify-between mt-2 ml-11 text-muted-foreground">
        <button className="flex items-center gap-1.5 rounded-full p-1.5 hover:bg-accent hover:text-primary transition-colors">
          <MessageCircle className="h-3.5 w-3.5" />
          <span className="text-xs">{comment.comments_count}</span>
        </button>

        <button className="flex items-center gap-1.5 rounded-full p-1.5 hover:bg-accent hover:text-green-600 transition-colors">
          <Repeat2 className="h-3.5 w-3.5" />
        </button>

        <button
          onClick={() => onLike(comment.id)}
          className={`flex items-center gap-1.5 rounded-full p-1.5 hover:bg-red-50 hover:text-red-500 transition-colors ${
            comment.is_liked ? "text-red-500" : ""
          }`}
        >
          <Heart
            className={`h-3.5 w-3.5 ${comment.is_liked ? "fill-current" : ""}`}
          />
          <span className="text-xs">{comment.likes_count}</span>
        </button>

        <button className="flex items-center gap-1.5 rounded-full p-1.5 hover:bg-accent hover:text-primary transition-colors">
          <Share className="h-3.5 w-3.5" />
        </button>

        <button
          onClick={() => onBookmark(comment.id)}
          className={`flex items-center gap-1.5 rounded-full p-1.5 hover:bg-accent hover:text-primary transition-colors ${
            comment.is_bookmarked ? "text-amber-500" : ""
          }`}
        >
          <Bookmark
            className={`h-4 w-4 ${comment.is_bookmarked ? "fill-current text-amber-500" : ""}`}
          />
        </button>
      </div>
    </div>
  );
}
