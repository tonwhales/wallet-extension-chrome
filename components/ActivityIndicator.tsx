import * as React from 'react';

// const activityIndicator = css`
//     @keyframes rotate {
//         from {
//             transform: rotate(0deg);
//         }
//         to {
//             transform: rotate(360deg);
//         }
//     }
//     width: 20px;
//     height: 20px;
//     margin: auto;
//     & > svg {
//         animation: rotate 0.75s linear infinite;
//     }
// `;

export const ActivityIndicator = React.memo(() => {
    return (
        <div className='activityIndicator'>
            <svg height="100%" viewBox="0 0 32 32" width="100%">
                <circle
                    cx="16"
                    cy="16"
                    fill="none"
                    r="14"
                    strokeWidth="4"
                    style={{
                        stroke: '#1a95e0',
                        opacity: 0.2,
                    }}
                />
                <circle
                    cx="16"
                    cy="16"
                    fill="none"
                    r="14"
                    strokeWidth="4"
                    style={{
                        stroke: '#1a95e0',
                        strokeDasharray: 80,
                        strokeDashoffset: 60,
                    }}
                />
            </svg>
        </div>
    );
});
