// Define the User type based on your Prisma schema
export interface User {
  id: string;
  username: string | null;
  email: string;
  name: string | null;
  image: string | null;
  description: string | null;
  emailVerified: boolean;
}

// Define the Session type, including the nested User
export interface Session {
  id: string;
  expiresAt: Date;
  token: string;
  createdAt: Date;
  updatedAt: Date;
  ipAddress: string | null;
  userAgent: string | null;
  userId: string;
  user: User; // Assuming the session object includes the related User
}
