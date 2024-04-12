import React from 'react';

function Footer() {
    return (
        <footer>
            <p className='footer'>&copy; {new Date().getFullYear()} Blockbrite. Todos los derechos reservados.</p>
        </footer>
    );
}

export default Footer;
