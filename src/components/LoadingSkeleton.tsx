import React from "react";
import { Skeleton } from "./ui/skeleton";

export const LoadingSkeleton = () => {
  return (
    <div className="space-y-6">
      <div className="grid gap-6">
        <SkeletonClass />
        <SkeletonClass />
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <SkeletonClass />
        <SkeletonClass />
      </div>
    </div>
  );
};
const SkeletonClass = () => {
  return <Skeleton className="h-75 w-full rounded-lg" />;
};
