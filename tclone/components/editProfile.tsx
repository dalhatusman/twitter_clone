"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { IProfile } from "@/types/profile";
import api from "@/lib/api";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";

interface ProfileCard {
  profile: IProfile;
}

export function EditProfile({ profile }: ProfileCard) {
  const { user, setUser } = useAuth();
  const [profileData, setProfileData] = useState<IProfile | null>(profile);
  const [username, setUsername] = useState(profileData?.username ?? "");
  const [bio, setBio] = useState(profileData?.bio ?? "");
  const [fullName, setFullName] = useState(profileData?.full_name ?? "");
  const [profilePicturePreview, setProfilePicturePreview] = useState<
    string | null
  >(profileData?.profile_picture ?? null);
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(
    null,
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [hasInvalidFile, setHasInvalidFile] = useState(false);
  useEffect(() => {
    setProfileData(profile);
  }, [profile]);

  if (!profileData) return null;

  async function handleProfileChange(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    setError("");

    const file = e.target.files?.[0];
    if (!file?.type.startsWith("image/")) {
      setError("Only images are allowed");
      setHasInvalidFile(true);
      e.target.value = "";
      return;
    }
    if (!file) {
      setError("Please select an image ");
      return;
    }
    setHasInvalidFile(false);
    setProfilePictureFile(file);
    setProfilePicturePreview(URL.createObjectURL(file));
  }

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (hasInvalidFile) {
      setError(
        "Please choose a valid image, or clear the selection, before saving",
      );
      return;
    }

    setError(null);
    setLoading(true);
    setSuccess(false);

    try {
      const formData = new FormData();
      if (profilePictureFile) {
        formData.append("profile_picture", profilePictureFile);
      }
      formData.append("username", username);
      formData.append("bio", bio);
      formData.append("full_name", fullName);
      const { data } = await api.patch(
        `/profiles/${user?.username}/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      setUser((prev) => (prev ? { ...prev, ...data } : data));
      setSuccess(true);
    } catch (err: any) {
      console.error("Failed to save changes", err);
      setError("Failed to save changes");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog>
      <DialogTrigger render={<Button variant="outline">Edit Profile</Button>} />
      <DialogContent className="sm:max-w-sm max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSave}>
          <div className="flex flex-col items-center justify-center gap-2">
            {error && <p className="px-2 text-sm text-red-500">{error}</p>}
            {success && (
              <p className="px-2 text-sm text-green-600">Profile updated</p>
            )}
            {profilePicturePreview ? (
              <Image
                src={profilePicturePreview}
                alt="Profile"
                width={80}
                height={80}
                className="rounded-full object-cover h-20 w-20"
              />
            ) : (
              <div className="h-20 w-20 rounded-full bg-gray-200" />
            )}
          </div>

          <div className="flex items-center justify-center m-3">
            <input
              id="profile-picture"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleProfileChange}
            />
            <label
              htmlFor="profile-picture"
              className="cursor-pointer rounded-md bg-gray-200 mr-5 px-1 py-2 text-xs hover:bg-gray-300"
            >
              Choose Image
            </label>
          </div>

          <FieldGroup>
            <Field>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </Field>
            <Field>
              <Label htmlFor="fullname">Full Name</Label>
              <Input
                id="fullname"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </Field>
            <Field>
              <Label htmlFor="bio">Bio</Label>
              <Input
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </Field>
          </FieldGroup>

          <DialogFooter>
            <DialogClose render={<Button variant="outline">Cancel</Button>} />
            <Button type="submit" disabled={loading || hasInvalidFile}>
              {loading ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
