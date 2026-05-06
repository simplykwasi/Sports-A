import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar'; // Assuming you have a Sidebar component
import Header from './Header'; // Assuming you have a Header component

/**
 * AppLayout component provides a consistent layout with a fixed sidebar and header.
 * It renders the main content of the application via the Outlet.
 */
function AppLayout() {
  return (
    <div className="flex min-h-screen bg-ink-950 text-slate-100">
      <Sidebar /> {/* Fixed sidebar */}
      <div className="flex-1 flex flex-col">
        <Header /> {/* Fixed top header */}
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet /> {/* Renders the current route's component */}
        </main>
      </div>
    </div>
  );
}

export default AppLayout;