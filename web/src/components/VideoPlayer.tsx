"use client";

import Image from "next/image";
import { useState } from "react";
import { youtubeEmbed, youtubeThumbnail } from "@/lib/youtube";

/**
 * Click-to-play YouTube video. Until the visitor taps, only a thumbnail served from our
 * own domain is shown; the privacy-enhanced YouTube player loads after the tap.
 */
export function VideoPlayer({
  videoId,
  title,
  rounded = true,
  priority = false,
}: {
  videoId: string;
  title: string;
  rounded?: boolean;
  priority?: boolean;
}) {
  const [playing, setPlaying] = useState(false);
  const shape = rounded ? "rounded-xl" : "";

  if (playing) {
    return (
      <div className={`relative aspect-video w-full overflow-hidden bg-black ${shape}`}>
        <iframe
          src={youtubeEmbed(videoId)}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full border-0"
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      aria-label={`Play video: ${title}`}
      className={`relative block aspect-video w-full overflow-hidden bg-[#23262d] p-0 ${shape}`}
    >
      <Image
        src={youtubeThumbnail(videoId)}
        alt=""
        fill
        sizes="(max-width: 768px) 100vw, 720px"
        className="object-cover"
        priority={priority}
      />
      <span className="absolute inset-0 flex items-center justify-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-accent text-accent-ink shadow-lg">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M8 5.5v13l11-6.5Z" />
          </svg>
        </span>
      </span>
    </button>
  );
}
