import React from "react"; // import is needed!

declare module "react" {
    namespace JSX {
        interface IntrinsicElements {
            "sp-button": Omit<React.DetailedHTMLProps<React.HTMLProps<HTMLButtonElement>, HTMLButtonElement>, "size"> & CommonProps & {
                variant?: "primary" | "secondary" | "tertiary" | string;
                size?: "s" | "m" | "l";
            };
            "sp-heading": React.DetailedHTMLProps<React.HTMLProps<HTMLSpanElement>, HTMLSpanElement> & CommonProps;
            "sp-label": React.DetailedHTMLProps<React.HTMLProps<HTMLSpanElement>, HTMLSpanElement> & CommonProps & {
                isrequired?: "true" | "false";
            };
            "sp-divider": Omit<React.DetailedHTMLProps<React.HTMLProps<HTMLHRElement>, HTMLHRElement>, "size"> & CommonProps & {
                size?: "small" | "medium" | "large";
            };
            "sp-textfield": React.DetailedHTMLProps<React.HTMLProps<HTMLInputElement>, HTMLInputElement> & {
                size?: "small" | "medium" | "large";
                onInput?: (e: React.ChangeEvent<HTMLInputElement>) => void;
            };
            "sp-picker": React.DetailedHTMLProps<React.HTMLProps<HTMLInputElement>, HTMLInputElement> & CommonProps;
            "sp-menu": React.DetailedHTMLProps<React.HTMLProps<HTMLInputElement>, HTMLInputElement> & CommonProps;
            "sp-menu-item": CommonProps & {
                children: JSX.Element | JSX.Element[] | string;
                onClick?: (e: React.MouseEvent<HTMLOptionElement, HTMLInputElement>) => void;
                selected: true | null
            };
        }
    }
}

type CommonProps = {
    key?: string | number;
    // uxp elements has class (not className) attribute!
    class?: string;
    style?: React.CSSProperties;
}