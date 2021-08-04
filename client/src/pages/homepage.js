import React, { useEffect, useState } from 'react'
import { Navbar, Row, Col } from 'react-bootstrap';
import { MdEvent } from 'react-icons/md';
import JwtDecode from 'jwt-decode';
import Cookies from 'universal-cookie';
import { Redirect } from 'react-router-dom';
import client from '../helpers/client';
import '../styles/homepage.css';
import Register from '../auth/register';
import Login from '../auth/login'
import Footer from '../layout/footer';
import '../styles/header.css'
const cookies = new Cookies();

function HomePage() {

    const [login, setLogin] = useState(true)

    useEffect(() => {
        window.scrollTo({
            top: 0,
        });
    }, []);

    if (cookies.get("token") != null) {
        var { id } = JwtDecode(cookies.get("token"));
        let dest_url = "/api/session";
        client.post(dest_url, { id })
            .then((res) => {
                if (!res.data.status) {
                    cookies.remove("token");
                    window.location = "/";
                }
            })
            .catch((err) => {
                console.log(err);
            });
        return <Redirect to={{ pathname: '/user' }} />;
    }
    else {

        return (
            <>
                <Navbar className="navigation" expand="lg">
                    <Navbar.Brand><MdEvent size={30} color="white" className="mr-5" /></Navbar.Brand>
                </Navbar>
                <Row style={{ marginTop: 80 + 'px' }}>
                    <Col>
                        <div style={{ marginLeft: 20 + 'px' }}>
                            <p className="welcome"> Welcome to your personal diary!</p>
                            <p className="content1"> Who you are tomorrow begins with what you do today. Keep a diary and one day it'll keep you&nbsp;!</p>
                            <div>Already registered? <button style={{ border: 'none', color: '#4d004d', marginBottom: '4px' }} type="submit" onClick={() => setLogin(true)}>Login here</button></div>
                            <div>Don't have an account? <button style={{ border: 'none', color: '#4d004d' }} type="submit" onClick={() => setLogin(false)}>Register here</button></div>
                        </div>
                    </Col>

                    <Col>
                        {login ? <Login /> : <Register />}
                    </Col>
                </Row>

                <Footer />
            </>
        )
    }
}

export default HomePage;
