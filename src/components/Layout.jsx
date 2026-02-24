import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import QRModal from './QRModal';

const Layout = () => {
    return (
        <div className="widescreen-container">
            <Sidebar />
            <main className="main-content">
                <Header />
                <div className="page-content">
                    <Outlet />
                </div>
            </main>
            <QRModal />
        </div>
    );
};

export default Layout;
