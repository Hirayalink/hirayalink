import "next-auth"

declare module "next-auth" {
  interface User {
    id: string
    name: string
    userType: string
    contactNumber: string
    brgyName?: string
  }
  
  interface Session {
    user: User
  }
} 