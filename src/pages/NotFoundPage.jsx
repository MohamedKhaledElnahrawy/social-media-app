import React from 'react';
import { Button } from "@heroui/react";
import { Link } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-6 text-center">
      <div className="relative">
        <h1 className="text-[12rem] font-black text-zinc-100 dark:text-zinc-800 select-none">
          404
        </h1>
        <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl font-bold text-primary w-full">
           Oops! Page Not Found
        </p>
      </div>

      <div className="max-w-md mt-4">
        <p className="text-zinc-500 dark:text-zinc-400 text-lg">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mt-10">
        <Button
          as={Link}
          to="/"
          color="primary"
          variant="shadow"
          size="lg"
          radius="full"
          startContent={<Home size={20} />}
          className="font-bold px-8"
        >
          Back to Home
        </Button>
        
        <Button
          onPress={() => window.history.back()}
          variant="bordered"
          size="lg"
          radius="full"
          startContent={<ArrowLeft size={20} />}
          className="font-bold px-8 border-zinc-200 dark:border-zinc-700"
        >
          Go Back
        </Button>
      </div>

      <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden pointer-events-none opacity-50">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-400/5 blur-[120px]" />
      </div>
    </div>
  );
}