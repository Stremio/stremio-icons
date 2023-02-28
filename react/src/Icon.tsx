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

const Icon = React.forwardRef((props: Props, ref: ForwardedRef<SVGSVGElement>) => {
    const icon = ICONS[props.name];

    if (!icon) {
        return null;
    }

    return (
        <svg ref={ref} className={props.className} viewBox={icon.viewBox}>
            {
                icon.paths.map((path, index) => (
                    <path key={index} d={path.d} style={path.style} />
                ))
            }
        </svg>
    );
});

export default Icon;
