import * as React from 'react';

// const buttonStyle = css`
//     padding: 6px 18px;
//     padding-top: 8px;
//     background-color: var(--primary-color);
//     color: white;
//     align-self: center;
//     border-radius: 48px;
//     &:hover {
//         color: white;
//         background-color: var(--primary-color);
//     }
// `;

// const buttonStyleInverted = css`
//     padding: 6px 18px;
//     background-color: var(--background-color);
//     color: var(--font-color);
//     border-style: solid;
//     border-color: var(--secondary-color);
//     border-width: 1px;
//     align-self: center;
//     border-radius: 48px;
//     &:hover {
//         color: var(--font-color);
//         background-color: var(--background-color);
//     }
// `;

export const LinkButton = React.memo((props: { href: string, text: string }) => {
    return (
        <a href={props.href}>
            {props.text}
        </a>
    )
})