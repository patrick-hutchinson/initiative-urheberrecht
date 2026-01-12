import React, {createContext, useState } from 'react';

export const MenuContext = createContext();

const UserContextProvider = (props) => {
    const [opened, setOpened] = useState(false)

    const storeOpened = state => {
        setOpened(state)
    }

    return (
        <MenuContext.Provider value={{ opened, storeOpened  }}>
            {props.children}
        </MenuContext.Provider>
    )
}
export default UserContextProvider;