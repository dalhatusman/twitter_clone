// components/right-sidebar.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import api from "@/lib/api";

interface SuggestedUser {
  username: string;
  full_name: string;
  profile_picture: string | null;
}

interface NewsItem {
  category: string;
  timeAgo: string;
  headline: string;
}

// Static for now — swap for a real news API/source later
const NEWS_HIGHLIGHTS: NewsItem[] = [
  {
    category: "Sports",
    timeAgo: "Trending",
    headline: "City edge United in late thriller",
  },
  {
    category: "Tech",
    timeAgo: "2h ago",
    headline: "New chip design cuts power use by 40%",
  },
  {
    category: "Politics",
    timeAgo: "4h ago",
    headline: "Senate advances infrastructure bill",
  },
];

export default function RightSidebar() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<SuggestedUser[]>([]);

  return (
    <div className="w-80 px-4 py-4 space-y-6">
      <div className="relative ">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search...."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-11 pr-3 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="bg-gray-50 rounded-2xl p-4">
        <h3 className="text-base font-bold mb-3">News for you</h3>
        {NEWS_HIGHLIGHTS.map((item, i) => (
          <div
            key={i}
            className={`py-2 ${i < NEWS_HIGHLIGHTS.length - 1 ? "border-b border-gray-200" : ""}`}
          >
            <p className="text-xs text-gray-400 mb-0.5">
              {item.category} · {item.timeAgo}
            </p>
            <p className="text-sm font-medium">{item.headline}</p>
          </div>
        ))}
      </div>

      <div className="bg-gray-50 rounded-2xl p-4">
        <h3 className="text-base font-bold mb-3">Who to follow</h3>
      </div>
    </div>
  );
}
