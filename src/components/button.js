import { useEffect } from "react";

function Button({content, func, id}) { 
    return(
        <button id={id ? id : null} className='navBarButton' onClick={func}>
            {content}
        </button>
    )
}




export default Button;