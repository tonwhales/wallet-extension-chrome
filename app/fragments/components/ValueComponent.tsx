import * as React from 'react';
import { fromNano } from 'ton';
import currency from 'currency.js';

export function ValueComponent(props: { value: number | string, precision?: number, noSeparator?: boolean, usd?: number }) {
    let precision = props.precision == undefined ? 4 : props.precision
    let formatted = currency(fromNano(props.value), { precision }).format({ symbol: '' });

    while (formatted.endsWith('0') && precision >= 1) {
        formatted = formatted.slice(0, formatted.length - 1);
    }
    if (formatted.endsWith('.')) {
        formatted = formatted.slice(0, formatted.length - 1);
    }
    if (props.usd) {
        formatted = currency(String((+formatted.replace(/,/g, '') * props.usd)), { precision: 2 }).format({ symbol: '' })
    }
    return <span style={{ whiteSpace: 'nowrap' }}>{props.usd && '$'}{props.noSeparator ? formatted.replace(',', '') : formatted}{!props.usd && ' 💎'}</span>;
}