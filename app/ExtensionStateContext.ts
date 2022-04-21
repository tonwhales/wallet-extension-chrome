import * as React from 'react';
import { ExtensionState } from './model/ExtensionState';

export const ExtensionStateContext = React.createContext<ExtensionState>({ type: 'initing' });

export function useExtensionState() {
    return React.useContext(ExtensionStateContext);
}