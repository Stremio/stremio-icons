import { For, JSX } from 'solid-js';
import icons from './icons.json';

type JSONIcon = {
    viewBox: string,
    paths: {
        d: string,
        style: JSX.CSSProperties,
    }[]
};

const ICONS = icons as Record<string, JSONIcon>

type Props = {
    class?: string,
    name: string,
};

const Icon = (props: Props) => {
    const icon = ICONS[props.name];

    if (!icon) {
        return null;
    }

    return (
        <svg class={props.class} viewBox={icon.viewBox}>
            <For each={icon.paths}>{(path) =>
                <path d={path.d} style={path.style}></path>
            }</For>
        </svg>
    );
};

export default Icon;
