import React, { useEffect, useState } from 'react';
import Header from '../layout/header';
import Footer from '../layout/footer';
import { Container } from 'react-bootstrap';
import Cards from '../components/event-card';
import diary from '../assets/images/writing diary.png'
import '../styles/vieweventCard.css';
import client from '../helpers/client';
import getid from '../helpers/getId';
import Cookies from 'universal-cookie';
import { Redirect } from 'react-router-dom';
const cookies = new Cookies();

function ViewEvents() {

  const [events, setEvents] = useState([]);
  const id = getid();

  useEffect(() => {
    let des_url = `/api/viewevents/all`
    client.post(des_url, { id })
      .then(res => {
        setEvents(res.data.result);
      });
  }, [setEvents, id, events]);

  if (cookies.get("token") == null) {
    return <Redirect to={{ pathname: '/' }} />
  }

  const Events = events.map((item, idx) => {
    return {
      key: idx,
      id: item.event_id,
      title: item.title,
      type: item.event_type,
      date: item.created_at,
      status: item.status,
      description: item.description
    }
  });

  return (
    <>
      <Header />
      {Events.length <= 0 ? (
        <div>No Events Available</div>
      ) : (
        <>
          <Container className="card-container mt-5">
            {Events.map((item, idx) => (
              <Cards
                imgsrc={diary}
                type={item.type}
                title={item.title}
                date={item.date}
                status={item.status}
                key={idx}
                id={item.id}
                description={item.description}
              />
            ))}
          </Container>
        </>)}
      <Footer />
    </>
  );

}

export default ViewEvents;