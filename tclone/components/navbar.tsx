"use client";
import Link from "next/link";
import Image from "next/image";
import { redirect, usePathname } from "next/navigation";
import { Button } from "./ui/button";
import {
  Home,
  Bell,
  User,
  MoreHorizontal,
  Search,
  MessageCircle,
  Bookmark,
  UserRound,
  CircleEllipsis,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import CreatePostCard from "./createPost";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { IPost } from "@/types/post";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();
  const { logout } = useAuth();
  const [open, setOpen] = useState(false);

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/search", label: "Explore", icon: Search },
    { href: "/notifications", label: "Notifications", icon: Bell },
    { href: "/messages", label: "Chat", icon: MessageCircle },
    { href: `/profile/${user?.username}`, label: "Profile", icon: User },
    { href: "/history", label: "History", icon: Bookmark },
    { href: "/more", label: "More", icon: CircleEllipsis },
  ];
  async function handleLogOut() {
    await logout();
    router.push("/login");
  }

  function handlePost() {
    redirect("/Card");
  }
  return (
    // <div className="flex flex-col h-screen ml-6 mt-4">
    //   <div className="p-4">
    //     <Image src="/X.png" width={40} height={40} alt="logo" />
    //   </div>
    //   <div className="flex flex-col">
    //     <p className="p-2 text-2xl">Home</p>
    //     <p className="p-2 text-2xl">Explore</p>
    //     <p className="p-2 text-2xl">Notifications</p>
    //     <p className="p-2 text-2xl">Chat</p>
    //     <p className="p-2 text-2xl">Grok</p>
    //     <p className="p-2 text-2xl">History</p>
    //     <p className="p-2 text-2xl">More...</p>
    //   </div>
    // </div>
    <nav className="flex ml-5 h-screen flex-col justify-between py-3 sticky top-0 bg-gray-100/80">
      <Link href="/" className="block px-3 mb-4">
        <Image src="/X.png" alt="logo" height={28} width={28} />
      </Link>
      <ul className="flex flex-col gap-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <li key={href}>
              <Link
                href={href}
                className={`flex !text-inherit !no-underline items-center gap-1 rounded-full px-3 py-2 text-lg transition-colors hover:bg-gray-200 ${
                  isActive ? "font-bold" : "font-normal text-foreground"
                }`}
              >
                <Icon className="h-6 w-6" />
                <span className="">{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
      {/* <Button onClick={() => setOpen(true)}>Create Post</Button> */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>
          <Button className="w-full rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3">
            Post
          </Button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create a post</DialogTitle>
          </DialogHeader>
          <CreatePostCard
            onPostCreated={(post) => {
              setOpen(false);
              router.push("/");
            }}
          />
        </DialogContent>
      </Dialog>
      {user && (
        <Link
          href={`/profile/${user.username}`}
          className="flex items-center gap-3 rounded-full px-3 py-1 hover:bg-accent transition-colors"
        >
          <div className="h-9 w-9 shrink-0 overflow-hidden rounded-full">
            <div className="h-9 w-9 shrink-0 overflow-hidden rounded-full bg-gray-200">
              {user.profile_picture ? (
                <Image
                  src={user.profile_picture}
                  alt={user.username}
                  width={36}
                  height={36}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-gray-400 text-sm font-bold">
                  {user.username[0].toUpperCase()}
                </div>
              )}
            </div>
          </div>
          <div className=" min-w-0">
            <p className="text-sm font-semibold truncate">{user.full_name}</p>
            <p className="text-xs text-muted-foreground truncate">
              @{user.username}
            </p>
          </div>
        </Link>
      )}
      <Button onClick={handleLogOut} className="bg-red-700">
        Logout <LogOut />
      </Button>
    </nav>
  );
}
