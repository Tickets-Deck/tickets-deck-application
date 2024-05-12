export enum FollowsActionType {
  Follow = "follow",
  Unfollow = "unfollow",
}

export interface IUserFollowMetrics {
  following: number;
  followers: number;
  isFollowing: boolean;
}
