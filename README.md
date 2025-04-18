This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## ScreenShots
![image](https://github.com/user-attachments/assets/bfe5d75a-265b-4ec0-b4a5-af640a376536)


This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

\
## Requirements

*   Node.js (version specified in `package.json` or latest LTS recommended)
*   npm, yarn, pnpm, or bun package manager
*   PostgreSQL database


## Running the Application

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd DesignGenius
    ```

2.  **Install dependencies:**
    Choose one of the following commands based on your preferred package manager:
    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    # or
    bun install
    ```

3.  **Run database migrations:**
    ```bash
    npx prisma migrate dev
    ```
    This command will synchronize your database schema with your Prisma schema (`prisma/schema.prisma`) and apply any pending migrations.

4.  **Run the development server:**
    Choose one of the following commands:
    ```bash
    npm run dev
    # or
    yarn dev
    # or
    pnpm dev
    # or
    bun dev
    ```

5.  **Open the application:**
    Open [http://localhost:3000](http://localhost:3000) (or the `NEXT_PUBLIC_API_URL` specified in your `.env` file if different) with your browser to see the result.
