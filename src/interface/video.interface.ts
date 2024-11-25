export interface ThumbnailVideo {
  default: {
    url: string,
    width: number,
    height: number
  },
  medium: {
    url: string,
    width: number,
    height: number
  },
  high: {
    url: string,
    width: number,
    height: number
  },
  standard: {
    url: string,
    width: number,
    height: number
  },
  maxres: {
    url: string,
    width: number,
    height: number
  }
}
export interface Snippet {
  publishedAt: string,
  channelId: string,
  title: string,
  description: string,
  thumbnails: ThumbnailVideo,
  channelTitle: string,
  type: string
  views?: number,
  comments?: number
}

export interface ContentDetails {
  upload: {
    videoId: string
  }
}

export interface IStatistics {
  viewCount: number,
  likeCount: number,
  dislikeCount: number,
  favoriteCount: number,
  commentCount: number
}
export interface IVideoDetail {
  kind: string,
  etag: string,
  id: string,
  statistics: IStatistics
}

export interface IVideo {
  kind: string,
  etag: string,
  id: string,
  snippet: Snippet,
  contentDetails: ContentDetails
  statistics?: IStatistics
}