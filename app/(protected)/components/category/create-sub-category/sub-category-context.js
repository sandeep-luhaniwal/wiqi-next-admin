"use client";

import React, { createContext, useContext, useState } from "react";

const SubCategoryContext = createContext();

export const SubCategoryProvider = ({ children }) => {
    const [subCategories, setSubCategories] = useState([]); // subcategory list
    const [subCategoryToEdit, setSubCategoryToEdit] = useState(null); // edit state
    const [refreshFlag, setRefreshFlag] = useState(false); // trigger refresh

    const triggerRefresh = () => setRefreshFlag(prev => !prev);

    return (
        <SubCategoryContext.Provider
            value={{
                subCategories,
                setSubCategories,
                subCategoryToEdit,
                setSubCategoryToEdit,
                refreshFlag,
                triggerRefresh,
            }}
        >
            {children}
        </SubCategoryContext.Provider>
    );
};

export const useSubCategory = () => useContext(SubCategoryContext);
