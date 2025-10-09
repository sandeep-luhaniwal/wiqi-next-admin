"use client";

import React, { createContext, useContext, useState } from "react";

const ProCategoryContext = createContext();

export const ProCategoryProvider = ({ children }) => {
  const [proCategories, setProCategories] = useState([]); // list
  const [proCategoryToEdit, setProCategoryToEdit] = useState(null); // edit state
  const [refreshFlag, setRefreshFlag] = useState(false); // trigger refresh
  const [open, setOpen] = useState(false);
  const triggerRefresh = () => setRefreshFlag(prev => !prev);

  return (
    <ProCategoryContext.Provider
      value={{
        proCategories,
        setProCategories,
        proCategoryToEdit,
        setProCategoryToEdit,
        open,
        setOpen,
        refreshFlag,
        triggerRefresh,
      }}
    >
      {children}
    </ProCategoryContext.Provider>
  );
};

export const useProCategory = () => useContext(ProCategoryContext);
