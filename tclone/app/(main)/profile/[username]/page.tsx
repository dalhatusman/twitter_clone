"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import api from "@/lib/api";
import TCard from "@/components/TCard";
import { IPost } from "@/types/post";
import { useAuth } from "@/context/AuthContext";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Navbar from "@/components/navbar";
import LoadingLogo from "@/components/loadingLogo";
import { EditProfile } from "@/components/editProfile";
import { IProfile } from "@/types/profile";

export default function ProfilePage() {
  const { user } = useAuth();
  const { username } = useParams<{ username: string }>();
  const [profile, setProfile] = useState<IProfile | null>(null);
  const [profilePicture, setprofilePicture] = useState<File | null>(null);
  const [posts, setPosts] = useState<IPost[]>([]);
  const [likedRes, setLikedRes] = useState<IPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      setError("");
      try {
        const profileRes = await api.get(`/profiles/${username}`);
        const postsRes = await api.get(`/posts/?user=${username}`);
        const likedRes = await api.get(`/profiles/${username}/liked_posts/`);
        setProfile(profileRes.data);
        setPosts(postsRes.data);
        setLikedRes(likedRes.data);
      } catch (err) {
        console.error("Failed to load profile:", err);
        setError("Could not load this profile");
      } finally {
        setLoading(false);
      }
    }

    if (username) fetchProfile();
  }, [username]);

  async function handleLike(postId: number) {
    try {
      const res = await api.post(`/posts/${postId}/like/`);
      const updatedPost = (post: IPost) =>
        post.id === postId
          ? {
              ...post,
              is_liked: res.data.liked,
              likes_count: res.data.likes_count,
            }
          : post;

      setPosts((prev) => prev.map(updatedPost));
      setLikedRes((prev) => prev.map(updatedPost));
    } catch (err) {
      console.error("Failed to like post:", err);
    }
  }
  async function handleBookmark(postId: number) {
    try {
      const res = await api.post(`/posts/${postId}/bookmark/`);
      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId
            ? {
                ...post,
                is_bookmarked: res.data.bookmarked,
                bookmarks_count: res.data.bookmarks_count,
              }
            : post,
        ),
      );
    } catch (err) {
      console.error("Failed to bookmark post:", err);
    }
  }

  if (loading) return <LoadingLogo fullScreen />;
  if (error || !profile)
    return (
      <p className="text-center mt-10 text-gray-500">
        {error || "Profile not found"}
      </p>
    );

  return (
    <>
      <hr className="border-gray-200 mb-4" />
      {user?.username === username ? (
        <div className="flex justify-end">
          {/* <button className="mt-1 rounded-md bg-blue-500 px-3 py-2 text-xs font-medium text-white hover:bg-blue-600 transition disabled:opacity-50"> */}
          <EditProfile profile={profile} />
          {/* </button> */}
        </div>
      ) : (
        ""
      )}
      <div className="max-w-xl mx-auto px-4 py-3">
        <div className="flex items-center gap-5 mb-6">
          <div className="flex flex-col items-center gap-3">
            <div className="relative w-20 h-20 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
              {profile.profile_picture ? (
                <Image
                  src={profile.profile_picture}
                  alt={profile.username}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-2xl font-bold">
                  {profile.username[0].toUpperCase()}
                </div>
              )}
            </div>
          </div>

          <div>
            <h1 className="text-xl font-bold text-gray-900">
              {profile.full_name}
            </h1>
            <p className="text-gray-500">@{profile.username}</p>
          </div>
        </div>
        {profile.bio && <p className="text-gray-700 mb-8">{profile.bio}</p>}
      </div>

      <Tabs defaultValue="account" className="w-[400px]">
        <TabsList className="flex w-full items-center justify-center gap-[25px]">
          <TabsTrigger value="posts" className="font-bold">
            POSTS
          </TabsTrigger>
          <TabsTrigger value="likes" className="font-bold">
            LIKES
          </TabsTrigger>
        </TabsList>
        <TabsContent value="posts">
          <div className="space-y-4">
            {posts.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-8">
                No posts yet
              </p>
            ) : (
              posts.map((post) => (
                <TCard
                  key={post.id}
                  post={post}
                  onLike={handleLike}
                  onBookmark={handleBookmark}
                />
              ))
            )}
          </div>
        </TabsContent>
        <TabsContent value="likes">
          {likedRes.length != 0 ? (
            <div className="space-y-4">
              {likedRes.map((post) => (
                <TCard
                  key={post.id}
                  post={post}
                  onLike={handleLike}
                  onBookmark={handleBookmark}
                />
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <p className="text-lg">You've not liked any tweet yet...</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </>
  );
}
