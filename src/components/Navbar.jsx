 
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
            <Link to="/" className="flex items-center gap-3 no-underline">
                <img
                    src={logoSrc}
                    alt="JOHNBOOKS logo"
                    className="h-8 w-8 object-contain rounded"
                />
                <span className="text-base font-bold tracking-tight">EBOOKS</span>
            </Link>
                <div className="flex items-center gap-3">
                    <Link to="/owners/signup" className="no-underline">
                        <div className="rounded-lg border-2 border-black px-3 py-1 text-sm font-medium text-black bg-white/90 hover:brightness-95 animate-pulse">
                            Sign up
                        </div>
                    </Link>
                </div>
        </div>

        
    </nav>
);
}

export default Navbar;
