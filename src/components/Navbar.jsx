 
import { useState, useEffect } from "react";
import { Button } from "./ui/button";

function Navbar() {
    const lightLogo = "https://res.cloudinary.com/dnitzkowt/image/upload/v1763331618/ChatGPT_Image_Nov_16__2025__07_00_44_PM-removebg-preview_idhs4n.png";
    const logoSrc = lightLogo;

    const navBase = "sticky top-0 z-30 border-b backdrop-blur-md";
    const navThemeClass = "card text-stone-950";
    const navClassName = `${navBase} ${navThemeClass}`;

return (
    <nav className={navClassName}>
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
                <img
                    src={logoSrc}
                    alt="JOHNBOOKS logo"
                    className="h-8 w-8 object-contain rounded"
                />
                <span className="text-base font-bold tracking-tight hidden sm:inline">
                    EBOOKS
                </span>
            </div>

            <div className="flex items-center gap-3">
                {/* dark mode toggle removed */}
            </div>
        </div>

        
    </nav>
);
}

export default Navbar;
