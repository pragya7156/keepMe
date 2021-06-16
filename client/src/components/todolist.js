import React, { useState, useEffect } from 'react';
import { Button, InputGroup, FormControl, Form, Modal, Container } from 'react-bootstrap';
import client from '../helpers/client';
import { FaEdit } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import { useAlert } from 'react-alert';
import getid from '../helpers/getId';

function ToDoList() {


    const id = getid();

    const [showedit, setShowedit] = useState(false);

  const handleCloseedit = () => setShowedit(false);
  const handleShowedit = () => setShowedit(true);

    const [todoall, setTodoall] = useState([]);

    useEffect(() => {
        const des_url = `/api/todos`
        client.post(des_url, { id }).then(res => {
            setTodoall(res.data.result);
        });
    }, [id, todoall]);

    const Todo = todoall.map((item, idx) => {
        return {
            key: idx,
            id: item.todo_id,
            title: item.title,
        }
    });

    const [todoId, setTodoId] = useState({
        todo_id: "",
        title: ""
    })


    const handleChange = (e) => {
        setTodoId({ ...todoId, [e.target.name]: e.target.value })
    }

    const handleEdit = async (e) => {
        e.preventDefault();
        handleCloseedit()
        if(todoId.title) {
        let des_url = `/users/edittodo`
        try {
            const edit = await client.post(des_url, { todo_id: todoId.todo_id, title: todoId.title })
            if (edit.data.status) {
                alert.success("Edited");
            }
            else {
                alert.error(edit.data.message);
            }
        } catch (error) {
            alert.error("Failed to edit")
        }
    }
    else {
        alert.error("Title is required")
    }
    
    }

    const alert = useAlert();

    return (
            <div className="heading">
            {Todo.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>S. No.</th>
                            <th>Title</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Todo.map((todo) => (
                            <tr key={todo.key}>
                                <td>{todo.key + 1}</td>
                                <td>{todo.title}</td>
                                <td>
                                    <FaEdit onClick={() => {
                                        setTodoId({todo_id: todo.id, title: todo.title})
                                        handleShowedit();
                                    }} style={{ cursor: 'pointer' }} />
                                    <MdDelete onClick={async () => {
                                        let des_url = `/users/deltodo`
                                        let todo_id = todo.id;
                                        try {
                                            const del = await client.post(des_url, { todo_id })
                                            if (del.data.status) {
                                                alert.success("Deleted");
                                            }
                                            else {
                                                alert.error(del.data.message);
                                            }
                                        } catch (err) {
                                            alert.error("Failed to delete")
                                        }
                                    }} style={{ cursor: 'pointer' }} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <tr>
                    <td colSpan={3}>No todo</td>
                </tr>
            )}
            <Modal show={showedit} onHide={handleCloseedit} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit the Event </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container className="main">
          <Form>
            <InputGroup className="mb-3">
                <InputGroup.Prepend>
                    <InputGroup.Text id="basic-addon2">Title</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                    placeholder="Title"
                    aria-label="Title"
                    aria-describedby="basic-addon2"
                    name="title"
                    defaultValue={todoId.title}
                    onChange={handleChange}
                    required
                />
            </InputGroup>
            <Button style={{ backgroundColor: "#4d004d" }} type="submit" onClick={handleEdit}>Edit</Button>
        </Form>
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button style={{ backgroundColor: "#4d004d" }} onClick={handleCloseedit}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

        </div>
    );

}

export default ToDoList;