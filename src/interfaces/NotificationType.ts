import { UserType } from "./UserType";

export interface NotificationType {
    _id: string;
    user: UserType;
    type: string;
    text: string;
    onClickPath: string;
    read: boolean;
    createdAt: string;
  }