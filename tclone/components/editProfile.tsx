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
  const { user } = useAuth();
  const [profileData, setProfileData] = useState<IProfile | null>(profile);
  if (!profileData) return null;
  const [username, setUsername] = useState(profileData.username ?? "");
  const [bio, setBio] = useState(profileData.bio ?? "");
  const [fullName, setFullName] = useState(profileData.full_name ?? "");
  const [profilePicturePreview, setProfilePicturePreview] = useState<
    string | null
  >(profileData.profile_picture ?? null);
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(
    null,
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setProfileData(profile);
  }, [profile]);

  async function handleProfileChange(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const file = e.target.files?.[0];
      if (!file) return;
      setProfilePictureFile(file);
      setProfilePicturePreview(URL.createObjectURL(file));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");
    setLoading(true);
    try {
      const formData = new FormData();
      if (profilePictureFile) {
        formData.append("profile_picture", profilePictureFile);
      }
      formData.append("username", username);
      formData.append("bio", bio);
      formData.append("full_name", fullName);
      await api.patch(`/profiles/${user?.username}/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      window.location.reload();
    } catch (err) {
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
          <div className="flex items-center justify-center">
            {profilePicturePreview ? (
              <Image
                src={profilePicturePreview}
                alt="Profile"
                width={80}
                height={50}
                className="rounded-full object-cover"
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

            <button
              type="submit"
              disabled={loading}
              className="rounded-md bg-blue-500 px-2 py-2 text-xs text-white hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? "Uploading..." : "Upload"}
            </button>
          </div>
          <FieldGroup>
            <Field>
              <Label htmlFor="name-1">Username</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </Field>
            <Field>
              <Label htmlFor="full_name">Full Name</Label>
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
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
