import React, { ForwardedRef } from 'react';
import icons from './icons.json';

type JSONIcon = {
    viewBox: string,
    paths: {
        d: string,
        style: React.CSSProperties,
    }[]
};

const ICONS = icons as Record<string, JSONIcon>

type Props = {
    className?: string,
    name: string,
};

const Icon = React.memo(React.forwardRef((props: Props, ref: ForwardedRef<SVGSVGElement>) => {
    const icon = ICONS[props.name];

    return icon ?
        <svg ref={ref} className={props.className} viewBox={icon.viewBox}>
            {
                icon.paths.map((path, index) => (
                    <path key={index} d={path.d} style={path.style} />
                ))
            }
        </svg>
        :
        null;
}));

export default Icon;
