import Header from 'components/Header';
import React from 'react';
import { Outlet } from 'react-router-dom';

const Home = () => {
  return (
    <div className="flex flex-col w-full h-screen">
      <Header />
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default Home;
