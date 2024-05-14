import { UserType } from "./UserType";

export interface PostType {
    _id: string;
    user: UserType
    media: string[],
    caption: string,
    hashTags: string[];
    tags: UserType[];
    likedBy: string[];
    savedBy: string[];
    commentsCount: number;
    sharesCount: number;
    isArchived: boolean;
    createdAt: string;
  }