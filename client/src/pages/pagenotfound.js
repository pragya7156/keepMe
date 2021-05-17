import React, { useEffect } from 'react'
import '../styles/pagenotfound.css'

function PageNotFound() {

    useEffect(() => {
		window.scrollTo({
			top: 0,
		});
	}, []);

    return (
        <>
        <div className="page">Page not found!</div>
        <div className="pnfpage">
        <pre>
            <h1 className="oops">Oops... </h1>
        <p className="nth"> nothing here</p>
        <p className="home"> <a href="/">Go to homepage</a></p>
        </pre>
        </div>
        </>
    )
}

export default PageNotFound;
