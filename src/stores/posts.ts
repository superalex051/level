import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { Post } from '@/lib/types';
import { useActivity } from '@/stores/activity';
import { ME_ID } from '@/stores/session';
import { storage } from '@/stores/storage';

interface CreatePostInput {
  image: string;
  caption: string;
  aspect: number;
}

interface PostsState {
  myPosts: Post[];
  createPost: (input: CreatePostInput) => string;
  reset: () => void;
}

export const usePosts = create<PostsState>()(
  persist(
    (set) => ({
      myPosts: [],
      createPost: ({ image, caption, aspect }) => {
        const id = `mine-${Date.now()}`;
        const post: Post = {
          id,
          authorId: ME_ID,
          image,
          caption: caption.trim(),
          createdAt: Date.now(),
          aspect,
          tags: [],
        };
        set((s) => ({ myPosts: [post, ...s.myPosts] }));
        useActivity.getState().simulateCircle(id);
        return id;
      },
      reset: () => set({ myPosts: [] }),
    }),
    { name: 'level.posts.v1', storage },
  ),
);
