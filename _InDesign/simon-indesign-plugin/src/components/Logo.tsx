import React from "react";
import * as manifest from "../../plugin/manifest.json";

export const Logo = () => (
    <div className='logo-wrapper'>
        <div style={{ flex: "0 0 auto", width: "auto" }}>
            <img src='assets/images/simon_logo.png' alt='logo' className='logo-img' height="44" />
        </div>
        <div style={{ flex: "0 0 auto", width: "auto", position: "relative" }}>
            <div className='logo'><span>S</span>IMON</div>
            <sp-label class='logo-motto my-1'>EPUB CREATOR</sp-label>
        </div>
        <sp-label class="version">{manifest.version}</sp-label>
    </div>
)