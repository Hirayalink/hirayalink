'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-base-100">
          <div className="text-center p-8">
            <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
            <p className="text-gray-600 mb-4">{error.message}</p>
            <button
              onClick={() => reset()}
              className="btn btn-primary"
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
} 