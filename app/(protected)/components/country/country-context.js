"use client";

import React, { createContext, useContext, useState } from "react";

const CountryContext = createContext();

export const CountryProvider = ({ children }) => {
    const [countries, setCountries] = useState([]);
    const [countryToEdit, setCountryToEdit] = useState(null);
    const [refreshFlag, setRefreshFlag] = useState(false);

    const triggerRefresh = () => setRefreshFlag(prev => !prev);

    return (
        <CountryContext.Provider
            value={{
                countries,
                setCountries,
                countryToEdit,
                setCountryToEdit,
                refreshFlag,
                triggerRefresh,
            }}
        >
            {children}
        </CountryContext.Provider>
    );
};

export const useCountry = () => useContext(CountryContext);
