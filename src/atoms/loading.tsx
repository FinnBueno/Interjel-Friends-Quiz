import React from 'react';
import { SyncLoader } from 'react-spinners';
import { usePromiseTracker } from 'react-promise-tracker';

export const LoadingIndicator: React.FC<{ scope: string }> = ({ children, scope: area }) => {
    const { promiseInProgress } = usePromiseTracker({ area });
    return (
        <>
            <SyncLoader size={16} loading={promiseInProgress} />
            {!promiseInProgress && children}
        </>
    );
};