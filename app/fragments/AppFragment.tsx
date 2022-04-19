import * as React from 'react';
import { useDetectLogout } from '../model/useDetectLogout';
import { SimpleNavigation } from './components/SimpleNavigation';
import { HomeFragment } from './HomeFragment';

export const AppFragment = React.memo(() => {
    useDetectLogout();

    return (
        <SimpleNavigation initialComponent={<HomeFragment />} />
    );
});