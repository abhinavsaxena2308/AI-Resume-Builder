import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
    const { pathname, hash } = useLocation();

    useEffect(() => {
        // If there is no hash in the URL, smooth scroll to the top
        if (!hash) {
            window.scrollTo({
                top: 0,
                left: 0,
                behavior: "smooth"
            });
        }
    }, [pathname, hash]);

    return null;
};

export default ScrollToTop;
