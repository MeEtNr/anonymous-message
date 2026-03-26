# AnnoMessage 🚀

AnnoMessage is a modern, professional, and secure anonymous feedback platform. It allows users to create dedicated threads for specific topics or receive direct messages in their general inbox.

## Key Features

- **Anonymous Threads**: Create focused discussion points and receive anonymous responses.
- **General Inbox**: A private space for direct anonymous messages.
- **Admin Dashboard**: Comprehensive analytics and user management for platform administrators.
- **Modern UI**: A premium blue and slate theme built with Next.js, Tailwind CSS, and Framer Motion.
- **Secure Auth**: Role-based access control and secure authentication via NextAuth.

## Getting Started

### Prerequisites

- MongoDB
- Node.js 18+

### Setup

1.  Clone the repository.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Set up your environment variables in `.env`:
    ```env
    MONGODB_URI=your_mongodb_uri
    NEXTAUTH_SECRET=your_secret
    ADMIN_EMAIL=admin@example.com
    # ... other variables
    ```
4.  Run the development server:
    ```bash
    npm run dev
    ```

## Technology Stack

- **Framework**: [Next.js](https://nextjs.org/)
- **Database**: [MongoDB](https://www.mongodb.com/)
- **Auth**: [NextAuth.js](https://next-auth.js.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Charts**: [Recharts](https://recharts.org/)
