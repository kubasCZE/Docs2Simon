import React, { useCallback, useEffect, useRef } from "react";
import { DataStore } from "../services/dataStore";

interface ILoader {
    dataStore: DataStore;
    className?: string;
    style?: React.CSSProperties;
}

export const Loader = ({ dataStore, className = "" }: ILoader) => {

    const loadingContainer = useRef<HTMLSpanElement | null>(null);
    const interval = useRef<NodeJS.Timeout | null>(null);

    const updateDots = useCallback((loadingContainer: HTMLSpanElement) => {

        if (!loadingContainer)
            return;

        let dotCount = 0;
        const maxDots = 20;

        interval.current = setInterval(() => {
            let dots = ".".repeat(dotCount);
            loadingContainer.textContent = dots;
            dotCount = (dotCount + 1) % (maxDots + 1);
        }, 500);
    }, [])

    useEffect(() => {
        if (loadingContainer.current) {
            updateDots(loadingContainer.current);
        }
        return () => {
            if (interval.current)
                clearInterval(interval.current);
        }
    }, [loadingContainer, updateDots])


    return (
        <div className={`spinner-loader-wrapper ${className}`}>
            <sp-label class="mt-3 text-center" style={{ fontSize: "0.875rem" }}><>
                <div>{dataStore.localizationService.getLocalizationString("Processing")}
                </div>
                <span ref={loadingContainer} className="loader__dots" />
            </></sp-label>
        </div>
    )
};
