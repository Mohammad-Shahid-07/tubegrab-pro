import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function formatDuration(seconds: number | string) {
  seconds = Number(seconds);

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  return (
    (hours > 0 ? String(hours).padStart(2, "0") + ":" : "") +
    String(minutes).padStart(2, "0") +
    ":" +
    String(secs).padStart(2, "0")
  );
}

export function formatViews(views: number | string) {
  views = Number(views);

  if (views >= 1_000_000_000) {
    return (views / 1_000_000_000).toFixed(1) + "B views";
  } else if (views >= 1_000_000) {
    return (views / 1_000_000).toFixed(1) + "M views";
  } else if (views >= 1_000) {
    return (views / 1_000).toFixed(1) + "K views";
  } else {
    return views + " views";
  }
}

// src/lib/utils.ts

export function formatTimeAgo(dateInput: string | number): string {
  const currentDate = new Date();
  const uploadedDate =
    typeof dateInput === "string" ? new Date(dateInput) : new Date(dateInput);
  const timeDiff = currentDate.getTime() - uploadedDate.getTime();
  const minutes = Math.floor(timeDiff / (1000 * 60));
  const hours = Math.floor(timeDiff / (1000 * 60 * 60));
  const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  const months = Math.floor(timeDiff / (1000 * 60 * 60 * 24 * 30));
  const years = Math.floor(timeDiff / (1000 * 60 * 60 * 24 * 365));

  if (years > 0) {
    return `${years} year${years > 1 ? "s" : ""} ago`;
  } else if (months > 0) {
    return `${months} month${months > 1 ? "s" : ""} ago`;
  } else if (days > 0) {
    return `${days} day${days > 1 ? "s" : ""} ago`;
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  } else {
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  }
}

export const formatFileSize = (bytes: number) => {
  if (bytes === 0) return "Unknown";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

