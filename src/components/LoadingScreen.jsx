


import React from 'react';
import { Spinner } from "@heroui/react";

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/60 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4 p-8 rounded-2xl">
        <Spinner 
          size="lg" 
          color="primary" 
          labelColor="primary"
          variant="gradient" 
        />
                <div className="flex flex-col items-center">
          <p className="text-lg font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent animate-pulse">
            Loading...
          </p>
          <p className="text-xs text-zinc-400 font-medium tracking-widest uppercase">
            Please wait a moment
          </p>
        </div>
      </div>
    </div>
  );
}