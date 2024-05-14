import { PostType } from "./PostType";
import { UserType } from "./UserType";

export interface CommentType {
    _id: string;
    post: string;
    user: UserType;
    content: string;
    isReply: boolean;
    replyTo: string;
    repliesCount: number;
    createdAt: string;
}