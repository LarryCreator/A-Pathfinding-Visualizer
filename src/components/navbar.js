import { useEffect } from "react";

function NavBar({children, passData}) {
    const height = 70;
    useEffect(()=>{
        document.getElementById('navBar').style.height = `${height}px`;
        passData(height);
    })
    return (
        <nav id='navBar'>
            {children}
        </nav>
    )
}

export default NavBar;