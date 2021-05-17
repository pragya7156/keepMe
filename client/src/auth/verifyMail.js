import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { Container, Button, Form, InputGroup, FormControl } from 'react-bootstrap';
import client from '../helpers/client';
import { useAlert } from 'react-alert';
import Cookies from 'universal-cookie';
import JwtDecode from 'jwt-decode';
// import getid from '../helpers/getId';

const cookies = new Cookies();

function VerifyMail() {

    const alert = useAlert();
    const token = cookies.get("token");
    var { password } = JwtDecode(cookies.get("token"));

    const [user, setUser] = useState({
        pass: "",
        confirm_pass: "",
        token: token,
        password: password
    })

    const { pass, confirm_pass } = user;

    const handleChange = async (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    }


    const handleClick = async (e) => {
        e.preventDefault();
        console.log(user);
        let des_url = `/users/first-set-password/verify/${user.password}/${user.token}`;
        if (user.pass && user.confirm_pass) {
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
                alert.error("Cannot set password");
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
                            type="password"
                            name="pass"
                            defaultValue={pass}
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
                            name="confirm_pass"
                            type="password"
                            defaultValue={confirm_pass}
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

export default VerifyMail;
