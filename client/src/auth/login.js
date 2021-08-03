import React, { useState } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { Container, Button, Form, InputGroup, FormControl, Card } from 'react-bootstrap';
import client from '../helpers/client';
import { useAlert } from 'react-alert';
import Cookies from 'universal-cookie';
// import getid from '../helpers/getId'
import '../styles/addevents.css';

const cookies = new Cookies();

function Login() {

    const alert = useAlert();

    const [user, setUser] = useState({
        email: "",
        password: ""
    })

    const [, setAttempt] = useState(0);


    if (cookies.get("token") != null) {
        // const id = getid();
        // let dest_url = "/api/session";
        // client.post(dest_url, {id})
        //     .then((res) => {
        //         if (!res.data.status) {
        //             //alert.error("Session Expired");
        //                 cookies.remove("token");
        //                 window.location = "/";
        //         }
        //     })
        //     .catch((err) => {
        //         alert.error("Something went wrong")
        //     });
            return <Redirect to={{ pathname: '/user' }} />;
    }
    else {

        const { email, password } = user;

        const handleChange = async (e) => {
            setUser({ ...user, [e.target.name]: e.target.value });
        }


        const handleClick = async (e) => {
            e.preventDefault();
            let des_url = "/users/login";
            if (user.email && user.password) {
                setAttempt(1);
                try {
                    const login = await client.post(des_url, user)
                    if (login.data.status) {
                        alert.success("Successfully logged in");
                        cookies.set("token", login.data.accessToken, { path: "/" });
                        setAttempt(0);
                    }
                    else {
                        setAttempt(0);
                        alert.error(login.data.message);
                    }
                } catch (err) {
                    setAttempt(0);
                    alert.error("Login Failed");
                }
            }
            else {
                alert.error("All fields are Required");
            }
        }

        return (
            <>
                <Container className="main">
                <Card className="cards">
                    <h4 style={{marginBottom: 15+'px'}}> Login </h4>
                    <Form>
                        <InputGroup className="mb-3">
                            <InputGroup.Prepend>
                                <InputGroup.Text id="basic-addon1">Email</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl
                                aria-label="Email"
                                aria-describedby="basic-addon1"
                                name="email"
                                value={email}
                                onChange={handleChange}
                            />
                        </InputGroup>
                        <InputGroup className="mb-3">
                            <InputGroup.Prepend>
                                <InputGroup.Text id="basic-addon2">Password</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl
                                type="password"
                                aria-label="Password"
                                aria-describedby="basic-addon2"
                                name="password"
                                value={password}
                                onChange={handleChange}
                            />
                        </InputGroup>

                        <Button style={{ backgroundColor: "#4d004d", marginRight: 5+'px', marginBottom: 5+'px' }} type="submit" onClick={handleClick}>Login</Button>
                        <Link to="/user/forgot-password"><Button style={{ backgroundColor: "#4d004d", marginBottom: 5+'px' }} type="submit">Forgot Password</Button></Link>
                    </Form>
                    </Card>
                </Container>
            </>
        )
    }
}

export default Login;
