"use client";

import React, { createContext, useContext, useState } from "react";

const StreamCategoryContext = createContext();

export const StreamCategoryProvider = ({ children }) => {
    const [streamCategories, setStreamCategories] = useState([]);
    const [streamCategoryToEdit, setStreamCategoryToEdit] = useState(null);
    const [refreshFlag, setRefreshFlag] = useState(false);

    const triggerRefresh = () => setRefreshFlag((prev) => !prev);

    return (
        <StreamCategoryContext.Provider
            value={{
                streamCategories,
                setStreamCategories,
                streamCategoryToEdit,
                setStreamCategoryToEdit,
                refreshFlag,
                triggerRefresh,
            }}
        >
            {children}
        </StreamCategoryContext.Provider>
    );
};

export const useStreamCategory = () => useContext(StreamCategoryContext);
