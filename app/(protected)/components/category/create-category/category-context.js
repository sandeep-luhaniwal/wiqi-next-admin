"use client";

import React, { createContext, useContext, useState } from "react";

const CategoryContext = createContext();

export const CategoryProvider = ({ children }) => {
    const [categories, setCategories] = useState([]);
    const [categoryToEdit, setCategoryToEdit] = useState(null);
    const [refreshFlag, setRefreshFlag] = useState(false);

    const triggerRefresh = () => setRefreshFlag(prev => !prev);

    return (
        <CategoryContext.Provider
            value={{
                categories,
                setCategories,
                categoryToEdit,
                setCategoryToEdit,
                refreshFlag,
                triggerRefresh,
            }}
        >
            {children}
        </CategoryContext.Provider>
    );
};

export const useCategory = () => useContext(CategoryContext);
