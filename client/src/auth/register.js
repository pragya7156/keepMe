import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { Container, Button, Form, InputGroup, FormControl, Card } from 'react-bootstrap';
import client from '../helpers/client';
import { useAlert } from 'react-alert';
import Cookies from 'universal-cookie';
import getid from '../helpers/getId';
import '../styles/addevents.css';

const cookies = new Cookies();

function Register() {

    const alert = useAlert();

    const [user, setUser] = useState({
        name: "",
        email: "",
        password: ""
    })

    if (cookies.get("token") != null) {
        const id = getid();
        let dest_url = "/api/session";
        client.post(dest_url, {id})
            .then((res) => {
                if (!res.data.status) {
                    //alert.error("Session Expired");
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

        const { name, email, password } = user;

        const handleChange = async (e) => {
            setUser({ ...user, [e.target.name]: e.target.value });
        }

        const handleClick = async (e) => {
            e.preventDefault();
            let dest_url = "/users/register";
            if (user.name && user.email && user.password) {
                try {
                    const register = await client.post(dest_url, {...user})
                    if (register.data.status) {
                        alert.success(register.data.message);
                        cookies.set("token", register.data.token, { path: "/user/first-set-password/verify" });
                    }
                    else {
                        alert.error(register.data.message);
                    }
                } catch (err) {
                    console.log(err);
                    alert.error("Registration Failed");
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
                    <h4 style={{marginBottom: 15+'px'}}> Register </h4>
                    <Form>
                        <InputGroup className="mb-3">
                            <InputGroup.Prepend>
                                <InputGroup.Text id="basic-addon1">Name</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl
                                aria-label="Name"
                                aria-describedby="basic-addon1"
                                name="name"
                                value={name}
                                onChange={handleChange}
                                required
                            />
                        </InputGroup>
                        <InputGroup className="mb-3">
                            <InputGroup.Prepend>
                                <InputGroup.Text id="basic-addon2">Email</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl
                                aria-label="Email"
                                aria-describedby="basic-addon2"
                                name="email"
                                value={email}
                                onChange={handleChange}
                                required
                            />
                        </InputGroup>
                        <InputGroup className="mb-3">
                            <InputGroup.Prepend>
                                <InputGroup.Text id="basic-addon3">Password</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl
                                type="password"
                                aria-label="Password"
                                aria-describedby="basic-addon3"
                                name="password"
                                value={password}
                                onChange={handleChange}
                                required
                            />
                        </InputGroup>
                        
                        <Button style={{ backgroundColor: "#4d004d" }} type="submit" onClick={handleClick}>Register</Button>
                    </Form>
                    </Card>
                </Container>
            </>
        )
    }
}

export default Register;
