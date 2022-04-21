import * as React from 'react';
import { SimpleNavigation } from './components/SimpleNavigation';
import { HomeFragment } from './HomeFragment';

export const AppFragment = React.memo(() => {
    return (
        <SimpleNavigation initialComponent={<HomeFragment />} />
    );
});