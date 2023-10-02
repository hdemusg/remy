import Form from 'react-bootstrap/Form'
import RangeSlider from 'react-bootstrap-range-slider'
import React from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Card from 'react-bootstrap/Card'

import axios from 'axios'

import {setDoc, doc } from "firebase/firestore"; 

import { useState } from 'react'

import {db} from '../App'

const randomId = function(length = 6) {
    return Math.random().toString(36).substring(2, length+2);
  };

function QueryForm(uid) {

    const [show, setShow] = useState(false);
    const [options, setOptions] = useState([])
    const [loaded, setLoaded] = useState(false)
    const [recipe, setRecipe] = useState([])
    const [recipeLoaded, setRecipeLoaded] = useState(false)
    const [showRecipe, setShowRecipe] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleCloseRecipe = () => {
        setShowRecipe(false);
        window.location.reload()
    }
    const handleShowRecipe = () => setShowRecipe(true);

    function search() {
       console.log(c, parseInt(r))
       axios({
        method: "post",
        headers: {
          'Content-Type': 'application/json'
        },
        url: "https://search-geyavl4cfq-uc.a.run.app",
        data: JSON.stringify({
            'c': c,
            'd': d,
            'gluten': gluten,
            'dairy': dairy,
            'nut': nut,
            'r': parseInt(r)
           })
       }).then((resp) => {
        console.log(resp.data.results)
        setOptions(resp.data.results)
        console.log(options)
       }).catch((e) => {
        console.log(e)
       }).then((e) => {
        handleShow();
        setLoaded(true);
       })
    }

    const handleChoice = (e) => {
        const x = e.target.value;
        const url = 'https://corsproxy.io/?' + encodeURIComponent("https://parse-geyavl4cfq-uc.a.run.app");
        console.log(x)
        axios({
            method: "post",
            headers: {
              'Content-Type': 'application/json',
              "access-control-allow-origin": "*",
            },
            url: url,
            data: {'choice': x}
           }).then((resp) => {
            handleClose()
            console.log(resp.data)
            setRecipe(resp.data)
            setRecipeLoaded(true)
            handleShowRecipe()
           }).catch((error) => {
            console.log(error)
            handleClose()
            alert("Parsing failed. Please try again!")
            window.location.reload()
           })
      }

    const handleSave = (e) => {
        const x = JSON.parse(e.target.value);
        const id = randomId(10)
        const data = {
            title: recipe["title"],
            ingredients: recipe["ingredients"],
            instructions: recipe["instructions"],
            author: x["author"],
            url: x["url"],
            id: x["id"],
            user: uid,
        }
        try {
            const d = doc(db, 'recipes', id);
            setDoc(d, data).then((e) => {
                console.log("Success")
                handleCloseRecipe()
               }).catch((error) => {
                console.log(error)
                alert("Saving failed. Please try another recipe!")
                handleCloseRecipe()
               });
          } catch (error) {
            console.error('Error creating collection reference:', error);
          }
    }

    const [r, setR] = React.useState(1)
    const [c, setC] = React.useState('a')
    const [d, setD] = React.useState('no')
    const [gluten, setGluten] = React.useState(false)
    const [dairy, setDairy] = React.useState(false)
    const [nut, setNut] = React.useState(false)

    return (
        <Container fluid>
            <br>
            </br>
           <Form>
            <Form.Group className="mb-3">
              <Row className="justify-content-md-center">
                <Col xs lg="6">
                <Form.Label>Cuisine</Form.Label>
                </Col>
                <Col xs lg="6">
                <Form.Control
                as="select"
                value={c}
                onChange={e => {
                    setC(e.target.value)}}>
                 <option value="a">American</option>
                 <option value="c">Chinese</option>
                 <option value="f">French</option>
                 <option value="g">German</option>
                 <option value="i">Indian</option>
                 <option value="j">Japanese</option>
                 <option value="k">Korean</option>
                 <option value="l">Italian</option>
                 <option value="m">Mediterranean</option>
                 <option value="n">Nigerian</option>
                 <option value="t">Thai</option>
                 <option value="x">Mexican</option>
                
               </Form.Control>
                </Col>
              </Row>
            </Form.Group>
            <Form.Group className="mb-3">
              <Row className="justify-content-md-center">
                <Col xs lg="6">
                <Form.Label>Dietary</Form.Label>
                </Col>
                <Col xs lg="6">
                <Form.Control
                as="select"
                value={d}
                onChange={e => {
                    setD(e.target.value)}}>
                 <option value="vn">Vegan</option>
                 <option value="vg">Vegetarian</option>
                 <option value="ha">Halal</option>
                 <option value="ko">Kosher</option>
                 <option value="no">None</option>
                
               </Form.Control>
                </Col>
              </Row>
            </Form.Group>
            
            <Form.Group className="mb-3">
                <Row className="justify-content-md-center">
                  <Col xs lg="6">
                  <Form.Label>Number of results</Form.Label>
                  </Col>
                  <Col xs lg="6">
                  <RangeSlider
                    value={r}
                    onChange={e => setR(e.target.value)}
                    min={1}
                    max={5}
                />
                  </Col>
                </Row>
            </Form.Group>
            <Form.Group className="mb-3">
                <Row className="justify-content-md-center">
                  <Col xs lg="6">
                  <Form.Label>Allergies</Form.Label>
                  </Col>
                  <Col xs lg="6">
                    {['checkbox'].map((type) => (
                        <div key={`inline-${type}`} className="mb-3">
                        <Form.Check
                            inline
                            label="Gluten-Free"
                            value="gf"
                            type={type}
                            onChange={e => 
                                {console.log(e.target.checked);
                                setGluten(e.target.checked)}}
                            id={`inline-${type}-1`}
                        />
                        <Form.Check
                            inline
                            label="Dairy-Free"
                            value="df"
                            type={type}
                            onChange={e => 
                                {console.log(e.target.checked);
                                setDairy(e.target.checked)}}
                            id={`inline-${type}-2`}
                        />
                        <Form.Check
                            inline
                            label="Nut-Free"
                            value="nf"
                            type={type}
                            onChange={e => 
                                {console.log(e.target.checked);
                                setNut(e.target.checked)}}
                            id={`inline-${type}-3`}
                        />
                        </div>
                    ))}
                  </Col>
                </Row>
            </Form.Group>
          </Form>
          <Button type="submit" onClick={search}>Search!</Button>
        <Modal show={show} onHide={handleClose} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>Options</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        {loaded ? options.map((data) => (
            <Card key={data.id} style={{padding: 5}}>
                <Card.Text style={{fontSize: 20}}><b>{data.title}</b></Card.Text>
                <Card.Text style={{fontSize: 2}}>{data.id}</Card.Text>
                <Card.Text style={{fontSize: 10}}>Author: {data.author}</Card.Text>
                <Card.Text style={{fontSize: 10}}>Date Published: {data.published_date}</Card.Text>
                <a href={data.url} rel="noreferrer" target="_blank"> Original Link </a>
                <br></br>
                <Button type="submit" value={JSON.stringify(data)} onClick={handleChoice}>Choose</Button>
            </Card>
        )) : "Nothing to see here, folks!"}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showRecipe} onHide={handleCloseRecipe} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>Selected Recipe</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        {recipeLoaded ? 
            <Card key={recipe.data.id} style={{padding: 5}}>
                <Card.Text style={{fontSize: 20}}><b>{recipe.title}</b></Card.Text>
                <a href={recipe.data.url} rel="noreferrer" target="_blank"> Original Link </a>
                <br></br>
                <Card.Text style={{fontSize: 20}}><b>Ingredients:</b> </Card.Text>
                {recipe.ingredients.map((data) => (<li key={data}>{data}</li>))}
                <br></br>
                <Card.Text style={{fontSize: 20}}><b>Instructions:</b> </Card.Text>
                {recipe.instructions.map((data) => (<li key={data}>{data}</li>))}
                <br></br>
                <Button type="submit" value={JSON.stringify(recipe.data)} onClick={handleSave}>Save</Button>
            </Card> : "Nothing to see here, folks!"}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseRecipe}>
            Exit
          </Button>
        </Modal.Footer>
      </Modal>
        </Container>
    );
}

export default QueryForm;