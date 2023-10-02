import React, {useState} from 'react'
import Container from 'react-bootstrap/Container'

import {getDocs} from "firebase/firestore"; 
import {coll} from '../App'

import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'

function SavedRecipes(uid) {

    const saved = useState([])
    const [loaded, setLoaded] = useState(false)

    getDocs(coll).then((querySnapshot) => {
        console.log(querySnapshot.docs)
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            console.log(typeof doc.data(), doc.data());
            saved.push(doc.data())
          })
      // setLoaded(true) - not ready yet due to Firebase frustrationsnpmn
    })
    .catch((error) => {
      // Collection does not exist or there was an error
      if (error.code === 'permission-denied') {
        console.log(`Permission denied to access collection'.`);
      } else {
        console.error(`Error checking collection':`, error);
      }
    });

    console.log(saved)

    return (
        <Container>
          {loaded ? saved.map((data) => (
            data
        )) : "Coming soon."}
        </Container>
    );
}

/*
<Card key={data.id} style={{padding: 5}}>
                <Card.Text style={{fontSize: 20}}><b>{data.get('title')}</b></Card.Text>
                <Card.Text style={{fontSize: 2}}>{data.id}</Card.Text>
                <Card.Text style={{fontSize: 10}}>Author: {data.author}</Card.Text>
                <Card.Text style={{fontSize: 10}}>Date Published: {data.published_date}</Card.Text>
                <a href={data.url} rel="noreferrer" target="_blank"> Original Link </a>
                <br></br>
                <Button type="submit" value={JSON.stringify(data)}>Choose</Button>
            </Card>
*/

export default SavedRecipes;