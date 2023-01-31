import React, { useMemo, createContext, FC, useContext } from 'react';
import { Block, Route } from './types';

const Engine = createContext<EngineProps | {}>({});

export interface EngineProps {
    data: {
        blocks: Block
        routes: Route
        hooks: any[]
    }
    children: React.ReactNode;
}

export type EngineProviderValue = EngineProps['data']

export const EngineProvider: FC<EngineProps> = ({
    data,
    children,
}) => {
    const value = useMemo(() => {
        return {
            blocks: data.blocks,
            routes: data.routes,
            hooks: data.hooks
        };
    }, [data]);
    return <Engine.Provider value={value}>{children}</Engine.Provider>;
};

export const useEngine = () =>
    useContext(Engine) as EngineProviderValue;
