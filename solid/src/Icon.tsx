import { For, JSX, Show } from 'solid-js';
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
    const icon = () => ICONS[props.name] ?? null;

    return (
        <Show when={icon()}>
            <svg class={props.class} viewBox={icon()?.viewBox}>
                <For each={icon()?.paths}>{(path) =>
                    <path d={path.d} style={path.style}></path>
                }</For>
            </svg>
        </Show>
    );
};

export default Icon;
