// components/Layout.js

import React from 'react';
import Navbar from './Common/Navbar';
import Sidebar from './Dashboard/Sidebar';
import Footer from './Common/Footer';

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <Navbar />

      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1 p-6">
          {children} {/* This is where the content of each route will go */}
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Layout;
