"use client";

import React, { createContext, useContext, useState } from "react";

const BannerContext = createContext();

export const BannerProvider = ({ children }) => {
    const [banners, setBanners] = useState([]);
    const [bannerToEdit, setBannerToEdit] = useState(null);
    const [refreshFlag, setRefreshFlag] = useState(false);

    const triggerRefresh = () => setRefreshFlag(prev => !prev);

    return (
        <BannerContext.Provider
            value={{
                banners,
                setBanners,
                bannerToEdit,
                setBannerToEdit,
                refreshFlag,
                triggerRefresh,
            }}
        >
            {children}
        </BannerContext.Provider>
    );
};

export const useBanner = () => useContext(BannerContext);