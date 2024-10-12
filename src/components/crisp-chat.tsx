'use client'

import { useEffect } from "react";
import { Crisp } from 'crisp-sdk-web';

export const CrispChat = () => {
    useEffect(() => { 
        Crisp.configure("a3e81638-dcbc-4441-93cc-96a0cabfe792");
    }, []);

    return null;
}