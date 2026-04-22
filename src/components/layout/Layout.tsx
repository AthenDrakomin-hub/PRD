import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';

export const Layout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-dark-bg text-gray-300 font-sans selection:bg-cyber-accent/30 selection:text-cyber-accent">
      <Navbar />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-4xl opacity-10 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyber-accent via-dark-bg to-dark-bg"></div>
        <div className="relative z-10">
          <Outlet />
        </div>
      </main>
      <footer className="border-t border-dark-border bg-dark-card py-6 text-center text-sm text-gray-500">
        <p>© {new Date().getFullYear()} CyberDefense Visual Learning Knowledge Base. Designed for Human & AI Agent.</p>
      </footer>
    </div>
  );
};
