import React from 'react'
import Render from './render'
import { EngineProps } from './types'
import { EngineProvider } from './contex'
import useOmniHook from '../omni-logic/plugin/hook/use-omni-hook'

const computeHooks = (hooks: any) => {
    let hooksObj = {}
    const getSchema = (name: string) => hooks.find((val: { name: string }) => val.name === name)
    hooks?.forEach((hook: { name: string }) => {
        const schema = getSchema(hook.name)
        if (schema) {
            hooksObj = {
                ...hooksObj,
                [hook.name]: schema
            }
        }
    })
    return Object.keys(hooksObj).reduce((accum, key) => {
        const h = useOmniHook(hooksObj[key]);
        accum = {
            ...accum,
            [key]: h
        }
        return accum
    }, {})
}

const Engine = ({ routes, blocks, rawHooks }: EngineProps) => {
    const hooks = computeHooks(rawHooks.hooks);

    return (<EngineProvider data={{
        blocks, routes, hooks
    }}>
        <Render />
    </EngineProvider>
    )
}

export default Engine