import React, { useState, useEffect } from 'react';
import Header from '../layout/header';
import Footer from '../layout/footer';
import { Button, Container, InputGroup, FormControl, Form } from 'react-bootstrap';
import client from '../helpers/client';
import getid from '../helpers/getId';
import { useAlert } from 'react-alert';
import TodoList from '../components/todolist';
import '../styles/addevents.css';
import Cookies from 'universal-cookie';
import { Redirect } from 'react-router-dom';
const cookies = new Cookies();

function ToDo() {

    const Uid = getid();
    const [todos, setTodos] = useState({
        title: "",
        id: Uid
    });

    useEffect(() => {
        window.scrollTo({
            top: 0,
        });
    }, []);

    const { title, id } = todos;

    const alert = useAlert();

    if (cookies.get("token") == null) {
        return <Redirect to={{ pathname: '/' }} />
    }

    const handleChange = (e) => {
        setTodos({ ...todos, [e.target.name]: e.target.value });
    }

    const handleClick = async (e) => {
        e.preventDefault();
        let des_url = `/users/addtodo`
        if (todos.title) {
            try {
                const add = await client.post(des_url, { id, title })
                if (add.data.status) {
                    alert.success("Todo added");
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

    return (
        <>
            <Header />
            <Container className="main">
                <h2 className="heading" >Todo List </h2>
                <Form>
                    <InputGroup className="mb-3">
                        <InputGroup.Prepend>
                            <InputGroup.Text id="basic-addon1">Title</InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl
                            placeholder="Title"
                            aria-label="Title"
                            aria-describedby="basic-addon1"
                            name="title"
                            value={title}
                            onChange={handleChange}
                            required
                        />
                    </InputGroup>
                    <Button style={{ backgroundColor: "#4d004d" }} type="submit" onClick={handleClick}>Add</Button>
                </Form>
                <TodoList style={{ marginTop: 50 + 'px' }} />
            </Container>
            <Footer />
        </>
    );

}

export default ToDo;