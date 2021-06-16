import React, { useEffect, useState } from 'react';
import Header from '../layout/header';
import Footer from '../layout/footer';
import '../styles/dashboard.css';
import getid from '../helpers/getId';
import client from '../helpers/client';
import { useAlert } from 'react-alert';
import Cookies from 'universal-cookie';
import { Redirect } from 'react-router-dom';
const cookies = new Cookies();

function Dashboard() {

    const id = getid();
    const alert = useAlert();

    useEffect(() => {
        window.scrollTo({
            top: 0,
        });
    }, []);

    const fetchName = async () => {
        let des_url = `/users/getuser`
        try {
            const name = await client.post(des_url, { id })
            if (name.data.status) {
                let n = name.data.name;
                let m = name.data.email;
                setMail(m);
                n = n.split(' ')[0]
                setName(n)
            }
            else {
                alert.error("Failed to display name")
            }
        } catch (error) {
            alert.error("Error")
        }
    }

    const fetchMem = async () => {
        let des_url = `/api/viewevents/getmem`
        try {
            const mem = await client.post(des_url, { id })
            if (mem.data.status) {
                setMem(mem.data.mem)
            }
            else {
                alert.error("Failed to display count")
            }
        } catch (error) {
            alert.error("Error")
        }
    }

    const [name, setName] = useState(fetchName())
    const [mail, setMail] = useState(fetchName())
    const [mem, setMem] = useState(fetchMem())
    
    if (cookies.get("token") == null) {
        return <Redirect to={{ pathname: '/' }} />
    }
    else {
        return (
            <>
                <Header />
                <div className="dash">
                    <p className="mail">{`Logged in as: ${mail}`}</p>
                    <p className="user"> {`Welcome ${name}!!`} </p>
                    <div>
                        <p className="para"> Do more of what makes you happy&nbsp;:) <br /> Collect moments, not things!</p>
                        <p className="para2"> {`You have created `}<b>{`${mem} memories`}</b> {`in your diary. Do add more, there's always something good or bad happening`}&nbsp;:)</p>
                    </div>
                </div>

                <Footer />
            </>
        );
    }

}

export default Dashboard;