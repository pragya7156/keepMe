import React, { useState } from 'react';
import { Container, Button, Form, InputGroup, FormControl, Navbar } from 'react-bootstrap';
import client from '../helpers/client';
import { useAlert } from 'react-alert';
import Cookies from 'universal-cookie';
import { MdEvent } from 'react-icons/md';

const cookies = new Cookies();

function ForgotPassword() {

    const alert = useAlert();

    const [user, setUser] = useState({
        email: ""
    })

    const { email } = user;

    const handleChange = async (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    }


    const handleClick = async (e) => {
        e.preventDefault();
        let des_url = "/users/forgot-password";
        if (user.email) {
            try {
                const login = await client.post(des_url, user)
                if (login.data.status) {
                    alert.success(login.data.message);
                    cookies.set("token", login.data.token, { path: "/user/reset-password" });
                }
                else {
                    alert.error(login.data.message);
                }
            } catch (err) {
                alert.error("Something went wrong");
            }
        }
        else {
            alert.error("Email is required");
        }
    }

    return (
        <>
            <Navbar className="navigation" expand="lg">
                <Navbar.Brand><MdEvent size={30} color="white" className="mr-5" /></Navbar.Brand>
            </Navbar>
            <Container fluid className="main">
                <h4 className="heading"> Forgot Password </h4>
                <Form>
                    <InputGroup className="mb-3">
                        <InputGroup.Prepend>
                            <InputGroup.Text id="basic-addon1">Email</InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl
                            placeholder="Email"
                            aria-label="Email"
                            aria-describedby="basic-addon1"
                            name="email"
                            value={email}
                            onChange={handleChange}
                            required
                        />
                    </InputGroup>

                    <Button style={{ backgroundColor: "#4d004d" }} type="submit" onClick={handleClick}>Submit</Button>
                </Form>
            </Container>
        </>
    )
}

export default ForgotPassword;
