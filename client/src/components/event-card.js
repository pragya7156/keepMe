import React, { useState, useCallback, useEffect } from 'react';
import { IoEyeSharp } from 'react-icons/io5';
import { FaEdit } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import { Form, Button, InputGroup, FormControl, Container, Modal } from 'react-bootstrap';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';
import client from '../helpers/client';
import getid from '../helpers/getId';
import { useAlert } from 'react-alert';
import Cookies from 'universal-cookie';
import { Redirect } from 'react-router-dom';
const cookies = new Cookies();

function EventCard(props) {

  const initialStatus = props.status === 1 ? true : false;
  const [status, setStatus] = useState(initialStatus);
  const id = getid();
  const alert = useAlert();

  const [editDetail, setEditDetail] = useState({
    title: props.title,
    event_type: props.type,
    description: props.description,
    event_id: props.id,
    id: id
  })

  useEffect(() => {
    window.scrollTo({
      top: 0,
    });
  }, []);

  const [showedit, setShowedit] = useState(false);

  const handleCloseedit = () => setShowedit(false);
  const handleShowedit = () => setShowedit(true);

  const handleChange = (e) => {
    setEditDetail({ ...editDetail, [e.target.name]: e.target.value })
  }

  const handleEdit = async (e) => {
    e.preventDefault();
    handleCloseedit()
    try {
      let des_url = `/users/editevents`
      const edit = await client.post(des_url, editDetail)
      if (edit.data.status) {
        alert.success("Edited")
      }
      else {
        alert.error(edit.data.message)
      }
    } catch (err) {
      alert.error("Failed to edit")
    }
  }


  const handleDelete = useCallback(() => {

    handleClosedel();

    let des_url = `/users/delevents`
    const event_id = props.id;
    client.post(des_url, { event_id })
      .then(res => {
        console.log(res.data.result);
      });

  }, [props.id])

  const handleStar = useCallback(() => {
    setStatus(!status)
    let des_url = `/users/favevents`
    const event_id = props.id;
    client.post(des_url, { event_id })
      .then(res => {
        console.log(res.data.result);
      })
      .catch(err => {
        alert.error("Failed to change")
      })
  }, [status, alert, props.id])

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [showdel, setShowdel] = useState(false);

  const handleClosedel = () => setShowdel(false);
  const handleShowdel = () => setShowdel(true);

  let ist = new Date(props.date).getDay()
  var s = new Date(props.date).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
  var time = s.split(" ")[2];
  var time2 = s.split(" ")[0];
  time2 = time2.replace(",", " ")
  time = time.toUpperCase();
  s = s.replace("pm", `${time}`)
  s = s.replace("am", `${time}`)
  s = s.split(",")[1]
  var weekday = new Array(7);
  weekday[0] = "Sun";
  weekday[1] = "Mon";
  weekday[2] = "Tue";
  weekday[3] = "Wed";
  weekday[4] = "Thu";
  weekday[5] = "Fri";
  weekday[6] = "Sat";

  var n = weekday[ist];

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

  return (
    <div className="flex">
      <div className="Cards">
        <section className="cards mb-5">
          <img src={props.imgsrc} className="image" alt="diary entry" />
          <h1>{props.title}</h1>

          {!props.st && (status === false ? <AiOutlineStar size={20} className="star" onClick={handleStar} /> : <AiFillStar size={20} className="star text-warning" onClick={handleStar} />)}

          <p>{props.type}</p>
          <small>{`${n} ${time2}`}</small>
          <small>{`${s}`}</small>

          <div className="actions">
            <div className="preview" onClick={handleShow}>
              {<IoEyeSharp />} Preview
            </div>
            <div className="edit" onClick={handleShowedit}>

              {<FaEdit />} Edit
            </div>
            <span className="delete" onClick={handleShowdel}>
              {<MdDelete />} Delete
            </span>
          </div>
        </section>
      </div>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>{props.type}</Modal.Title>
        </Modal.Header>
        <Modal.Body><div style={{ textAlign: 'left' }}>{props.title}</div>
          {props.description}</Modal.Body>
        <Modal.Footer>
          <Button style={{ backgroundColor: "#4d004d" }} onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showedit} onHide={handleCloseedit} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit the Event </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container className="main">
            <Form>
              <Form.Control as="select" className="mb-4" name="event_type" defaultValue={props.type} onChange={handleChange}>
                <option value="Daily">Daily</option>
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
                  defaultValue={props.title}
                  onChange={handleChange}
                />
              </InputGroup>
              <Form.Group controlId="exampleForm.ControlTextarea1" className="forms">
                <Form.Label>Description</Form.Label>
                <br />
                <Form.Control as="textarea" rows={3} name="description" defaultValue={props.description} onChange={handleChange} />
              </Form.Group>

              <Button style={{ backgroundColor: "#4d004d" }} type="submit" onClick={handleEdit}>Edit Event</Button>
            </Form>
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button style={{ backgroundColor: "#4d004d" }} onClick={handleCloseedit}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={showdel} onHide={handleClosedel} centered>
        <Modal.Header closeButton>
        </Modal.Header>
        <Modal.Body>Do you really want to delete this event?</Modal.Body>
        <Modal.Footer>
          <Button style={{ backgroundColor: "#4d004d" }} onClick={handleDelete}>Yes</Button>
          <Button style={{ backgroundColor: "#4d004d" }} onClick={handleClosedel}>No</Button>
        </Modal.Footer>
      </Modal>

    </div>
  )
}

export default EventCard;
