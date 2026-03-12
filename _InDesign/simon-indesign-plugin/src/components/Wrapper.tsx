import React, { useCallback, useEffect, useRef } from "react";

interface IWrapper {
    children: React.ReactNode;
    [key: string]: any;
}

export const Wrapper = (props: IWrapper) => {
    const elRef = useRef<HTMLDivElement | null>(null);

    const handleEvent = useCallback((evt: Event) => {
        const propName = `on${evt.type[0].toUpperCase()}${evt.type.substr(1)}`;
        if (props[propName]) {
            props[propName].call(evt.target, evt);
        }
    }, [props])

    useEffect(() => {
        const el = elRef.current;
        const eventProps = Object.entries(props).filter(([k]) => k.startsWith("on"));
        eventProps.forEach(([k]) => el?.addEventListener(k.substr(2).toLowerCase(), handleEvent));

        return () => {
            // eslint-disable-next-line react-hooks/exhaustive-deps
            const el = elRef.current;
            const eventProps = Object.entries(props).filter(([k]) => k.startsWith("on"));
            eventProps.forEach(([k]) => el?.removeEventListener(k.substr(2).toLowerCase(), handleEvent));
        }
    }, [handleEvent, props]);

    return <div ref={elRef} {...props}>{props.children}</div>
}