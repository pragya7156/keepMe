import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, Button, Container, InputGroup, FormControl } from 'react-bootstrap';
import Header from '../layout/header';
import Footer from '../layout/footer';
import '../styles/addevents.css';
import { useAlert } from 'react-alert';
import client from '../helpers/client'
import getid from '../helpers/getId';
import Cookies from 'universal-cookie';
import { Redirect } from 'react-router-dom';
const cookies = new Cookies();

function AddEvents() {

    const id = getid();

    const [data, setData] = useState({
        title: "",
        event_type: "",
        description: "",
        id: id
    })

    const alert = useAlert();

    useEffect(() => {
        window.scrollTo({
            top: 0,
        });
    }, []);

    const { event_type, title, description } = data;

    if (cookies.get("token") != null) {
        let dest_url = "/api/session";
        client.post(dest_url, { id })
            .then((res) => {
                if (!res.data.status) {
                    //alert.error("Session expired")
                    cookies.remove("token");
                    window.location = "/";
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }

    if (cookies.get("token") == null) {
        return <Redirect to={{ pathname: '/' }} />
    }

    const handleClick = async (e) => {
        e.preventDefault();
        let des_url = `/users/addevents`
        if (data.title) {
            try {
                const add = await client.post(des_url, data)
                if (add.data.status) {
                    alert.success("Event added");
                }
                else {
                    alert.error(add.data.message);
                }
            } catch (err) {
                alert.error("Failed");
            }
        } else {
            alert.error('Title is required')
        }

    }

    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    }

    return (
        <>
            <Header />
            <Container className="main">
                <h4 className="heading">Details about the Event </h4>
                <Form>
                    <Form.Control as="select" className="mb-4" name="event_type" value={event_type} onChange={handleChange} required>
                        <option value="Select" disabled>Select the type of your event</option>
                        <option value="Daily">Daily</option>
                        <option value="Notes">Notes</option>
                        <option value="Occassion">Occassion</option>
                        <option value="Special">Special</option>
                        <option value="Tragedy">Tragedy</option>
                        <option value="Others">Others</option>
                    </Form.Control>
                    <InputGroup className="mb-3">
                        <InputGroup.Prepend>
                            <InputGroup.Text id="basic-addon1">Title</InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl
                            placeholder="Title for the Event"
                            aria-label="Title"
                            aria-describedby="basic-addon1"
                            name="title"
                            value={title}
                            onChange={handleChange}
                            required
                        />
                    </InputGroup>
                    <Form.Group controlId="exampleForm.ControlTextarea1" className="forms">
                        <Form.Label>Description</Form.Label>
                        <br />
                        <Form.Control as="textarea" rows={3} name="description"
                            value={description}
                            onChange={handleChange} />
                    </Form.Group>

                    <Button style={{ backgroundColor: "#4d004d" }} type="submit" onClick={handleClick}>Add Event</Button>
                </Form>
            </Container>
            <Footer />
        </>

    )
}

export default AddEvents;
