import React, { useState } from 'react'
import { header } from '../Routes'
import { Redirect } from 'react-router-dom';
import { FaPowerOff } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Nav, NavDropdown, Modal, Button } from 'react-bootstrap'
import { MdEvent } from 'react-icons/md';
import client from '../helpers/client';
import Cookies from 'universal-cookie';
import getid from '../helpers/getId'
import '../styles/header.css'
import { useAlert } from 'react-alert';

const cookies = new Cookies();

function Header() {

    const id = getid();
    const alert = useAlert();

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [showdeluser, setShowdeluser] = useState(false);

    const handleClosedeluser = () => setShowdeluser(false);
    const handleShowdeluser = () => setShowdeluser(true);

    if (cookies.get("token") == null)
        return <Redirect to="/" />

    const handleLogout = async () => {
        handleClose();
        let dest_url = `/users/logout`;
        await client.post(dest_url, {id})
            .then((res) => {
                cookies.remove("token");
                alert.success("Successfully Logged out");
                <Redirect to="/logout" />
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => {
                setTimeout(() => {
                    window.location = "/";
                }, 200);
            });
    };

    const handleDelUser = async() => {
        handleClosedeluser();
        let des_url = `/users/deluser`;
        await client.post(des_url, {id})
        .then((res) => {
            cookies.remove("token");
            <Redirect to="/" />
        })
        .catch((err) => {
            console.log(err);
        })
        .finally(() => {
            setTimeout(() => {
                window.location = "/";
            }, 200);
        });

    }

    const getItems = (header) => {
        return (
            header.map((item, key) => (
                <Nav.Link href={item.path} key={key} className="mr-4 text-light" style={{ paddingLeft: 0 + 'px' }} >
                    {<item.icon />} {item.name}
                </Nav.Link>
            )
            ))
    }
    return (
        <>
            <Navbar className="navigation" expand="lg">
                <Navbar.Brand><MdEvent size={30} color="white" className="mr-5" /></Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav>
                        {getItems(header)}
                    </Nav>
                    <Navbar.Collapse className="justify-content-end mr-5">
                        <NavDropdown title={<span className="text-light">More</span>}>
                            <NavDropdown.Item href="/user/starred" style={{ color: "#4d004d" }}>Starred Events</NavDropdown.Item>
                            <NavDropdown.Item href="/user/todos" style={{ color: "#4d004d" }}>Todo List</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item style={{ color: "#4d004d" }} onClick={handleShow}><FaPowerOff className="mr-1" />Logout</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item style={{ color: "white", backgroundColor: "red"}} onClick={handleShowdeluser}>Delete account</NavDropdown.Item>
                        </NavDropdown>
                    </Navbar.Collapse>
                </Navbar.Collapse>
            </Navbar>
            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                </Modal.Header>
                <Modal.Body>Do you really want to logout?</Modal.Body>
                <Modal.Footer>
                    <Button style={{ backgroundColor: "#4d004d" }} onClick={handleLogout}>Yes</Button>
                    <Button style={{ backgroundColor: "#4d004d" }} onClick={handleClose}>No</Button>
                </Modal.Footer>
            </Modal>
            <Modal show={showdeluser} onHide={handleClosedeluser} centered>
                <Modal.Header closeButton>
                </Modal.Header>
                <Modal.Body>Do you really want to permanently delete your account? You will lose all your memories and todos you have stored.</Modal.Body>
                <Modal.Footer>
                    <Button style={{ backgroundColor: "#4d004d" }} onClick={handleDelUser}>Yes</Button>
                    <Button style={{ backgroundColor: "#4d004d" }} onClick={handleClosedeluser}>No</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default Header;
