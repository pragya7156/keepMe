import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { Container, Button, Form, InputGroup, FormControl } from 'react-bootstrap';
import client from '../helpers/client';
import { useAlert } from 'react-alert';
import Cookies from 'universal-cookie';
import getid from '../helpers/getId';

const cookies = new Cookies();

function ResetPassword() {

    const alert = useAlert();
    const token = cookies.get("token");
    const id = getid();

    const [user, setUser] = useState({
        password: "",
        confirm_password: "",
        id: id,
        token: token
    })

    const { password, confirm_password } = user;

    const handleChange = async (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    }


    const handleClick = async (e) => {
        e.preventDefault();
        console.log(user);
        let des_url = `/users/reset-password/${user.id}/${user.token}`;
        if (user.password && user.confirm_password) {
            try {
                const login = await client.post(des_url, {...user})
                if (login.data.status) {
                    alert.success(login.data.message);
                    cookies.remove("token")
                    return <Redirect to={{ pathname: '/' }} />;
                }
                else {
                    alert.error(login.data.message);
                }
            } catch (err) {
                console.log(err);
                alert.error("Cannot reset password");
            }
        }
        else {
            alert.error("All fields are required");
        }
    }

    return (
        <>
            <Container fluid className="main">
                <h4 className="heading"> Reset Password </h4>
                <Form>
                    <InputGroup className="mb-3">
                        <InputGroup.Prepend>
                            <InputGroup.Text id="basic-addon1">Password</InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl
                            placeholder="Password"
                            aria-label="Password"
                            aria-describedby="basic-addon1"
                            name="password"
                            type="password"
                            value={password}
                            onChange={handleChange}
                            required
                        />
                    </InputGroup>
                    <InputGroup className="mb-3">
                        <InputGroup.Prepend>
                            <InputGroup.Text id="basic-addon2">Confirm Password</InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl
                            placeholder="Confirm Password"
                            aria-label="Confirm Password"
                            aria-describedby="basic-addon2"
                            name="confirm_password"
                            type="password"
                            value={confirm_password}
                            onChange={handleChange}
                            required
                        />
                    </InputGroup>

                    <Button style={{backgroundColor: "#4d004d"}} type="submit" onClick={handleClick}>Reset Password</Button>
                </Form>
            </Container>
        </>
    )
}

export default ResetPassword;
