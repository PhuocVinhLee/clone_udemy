declare type UpdateCourseParams = {
  course: {
    courseId: string;
    title?: string;
    description?: string;
    imageUrl?: string;
    price?: number;
    isPublished?: boolean;
    category?: string;
    acttachments?: { name: string; url: string }[];
  };
  userId: string;
  path: string;
};

declare type CreateUserParams = {
  clerkId: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  photo: string;
};
declare type UpdateUserParams = {
  firstName: string;
  lastName: string;
  username: string;
  photo: string;
};

declare global {
  interface ClerkAuthorization {
    permission: 'org:quiz:create' | 'org:quiz:grade' | 'org:quiz:read' | 'org:quiz:fill';
    role: 'org:manager' | 'org:teacher' | 'org:student';
  }
}
