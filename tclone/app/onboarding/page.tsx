"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function OnboardingPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setProfilePicture(file);
    setPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("full_name", fullName);
      formData.append("bio", bio);
      if (profilePicture) formData.append("profile_picture", profilePicture);

      await api.patch(`/profiles/${user?.username}/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      router.push("/");
    } catch (err) {
      console.error("Failed to complete profile:", err);
      setError(
        "Something went wrong. You can finish this later from your profile.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">
          Complete your profile
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          This helps others recognize you
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="flex flex-col items-center gap-3">
            <div className="relative w-20 h-20 rounded-full overflow-hidden bg-gray-200">
              {preview ? (
                <Image
                  src={preview}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-2xl font-bold">
                  {user?.username?.[0]?.toUpperCase()}
                </div>
              )}
            </div>
            <label className="cursor-pointer text-sm text-blue-600 hover:underline">
              Choose photo
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
          </div>

          <div>
            <label
              htmlFor="fullName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Full name
            </label>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="bio"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Bio
            </label>
            <textarea
              id="bio"
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-2 rounded-lg font-medium transition"
          >
            {loading ? "Saving..." : "Save and continue"}
          </button>

          <button
            type="button"
            onClick={() => router.push("/")}
            className="w-full text-sm text-gray-500 hover:underline"
          >
            Skip for now
          </button>
        </form>
      </div>
    </div>
  );
}
