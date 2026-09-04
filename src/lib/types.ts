export interface User {
  id: string;
  name: string;
  handle: string;
  avatar?: string;
  bio: string;
  tags: string[];
}

export interface Post {
  id: string;
  authorId: string;
  image: string;
  caption: string;
  createdAt: number;
  /** width / height */
  aspect: number;
  tags: string[];
}

export type ActivityKind = 'seen' | 'liked' | 'shared';

/** Something a person did with one of your posts. Only the author ever sees these. */
export interface ActivityEvent {
  postId: string;
  userId: string;
  kind: ActivityKind;
  at: number;
}

export type FeedReason =
  | { kind: 'yours' }
  | { kind: 'circle' }
  | { kind: 'author'; name: string }
  | { kind: 'tag'; tag: string }
  | { kind: 'new' }
  | { kind: 'suggested' };
