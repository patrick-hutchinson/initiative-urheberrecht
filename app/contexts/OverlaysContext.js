import React, {createContext, useState } from 'react';

export const OverlaysContext = createContext();

const UserContextProvider = (props) => {
    const [overlays, setOverlays] = useState([])
    const [openEvent, setOpenEvent] = useState(false)
    const [closeEvent, setCloseEvent] = useState(false)

    const storeOverlays = overlay => {
        setOverlays(overlay)
    }
    const resetOverlays = () => {
        setOverlays([])   
    }
    const storeCloseEvent = status => {
        setCloseEvent(status)
    }
    const storeOpenEvent = status => {
        setOpenEvent(status)
    }

    return (
        <OverlaysContext.Provider value={{ overlays, storeOverlays, resetOverlays, closeEvent, storeCloseEvent, openEvent, storeOpenEvent  }}>
            {props.children}
        </OverlaysContext.Provider>
    )
}
export default UserContextProvider;