import api from "@/lib/api";
import { Trash } from "lucide-react";

interface IDeletePostBtn {
  postId: number;
  onDeleted: (postId: number) => void;
}
export default function HandleDeleteBtn({ postId, onDeleted }: IDeletePostBtn) {
  async function handleDelete() {
    try {
      await api.delete(`/posts/${postId}/`);
      onDeleted(postId);
    } catch (error) {
      console.error("Failed to delete post:", error);
    }
  }

  return (
    <button
      onClick={handleDelete}
      className="flex items-center gap-1.5 rounded-full p-1.5 hover:bg-accent hover:text-red-500 transition-color"
    >
      <Trash className="h-4 w-4" />
    </button>
  );
}
