import React, { useState, useEffect } from 'react'
import { Container } from 'react-bootstrap';
import Cards from '../components/event-card';
import diary from '../assets/images/writing diary.png';
import Header from '../layout/header';
import Footer from '../layout/footer';
import client from '../helpers/client';
import getid from '../helpers/getId';
import Cookies from 'universal-cookie';
import { Redirect } from 'react-router-dom';
const cookies = new Cookies();

function FavEvents() {

  const [events, setEvents] = useState([]);
  const id = getid();

  useEffect(() => {
    let des_url = `/api/viewevents/fav`
    client.post(des_url, { id })
      .then(res => {
        setEvents(res.data.result);
      });
  }, [setEvents, id, events]);

  // if (cookies.get("token") != null) {
  //   let dest_url = "/api/session";
  //   client.post(dest_url, { id })
  //     .then((res) => {
  //       if (!res.data.status) {
  //         //alert.error("Session expired")
  //         cookies.remove("token");
  //         window.location = "/";
  //       }
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // }

  if (cookies.get("token") == null) {
    return <Redirect to={{ pathname: '/' }} />
  }

  const FavEvents = events.map((item, idx) => {
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
      {FavEvents.length <= 0 ? (
        <div>No Events Starred</div>
      ) : (
        <Container className="card-container mt-5">
          {FavEvents.map((item, idx) => (
            <Cards
              imgsrc={diary}
              type={item.type}
              title={item.title}
              date={item.date}
              key={idx}
              id={item.id}
              description={item.description}
              st="fav"
            />
          ))}
        </Container>)}
      <Footer />
    </>
  )
}

export default FavEvents
