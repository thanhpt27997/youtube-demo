'use client';
import React from 'react';
import YouTube from 'react-youtube';

export default function VideoPlayer({
  videoId,
  width,
  height
}: {
  videoId: string
  width?: number
  height?: number
}) {

  const opts = {
    height: height ?? '390',
    width: width ?? '640',
    playerVars: {
      autoplay: 0,
    },
  };

  return <YouTube videoId={videoId} opts={opts} />;
}
