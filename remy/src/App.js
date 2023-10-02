import './App.css';
import { useState } from 'react'
import Navbar from 'react-bootstrap/Navbar'
import Container from 'react-bootstrap/Container'
import GoogleButton from 'react-google-button'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import firebaseConfig from './firebaseConfig'
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

import 'bootstrap/dist/css/bootstrap.min.css';

import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

// import { getAnalytics } from "firebase/analytics";

// const {  } = useContext(UserContext)


import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";

import Search from './components/Search'
import SavedRecipes from './components/SavedRecipes'

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
console.log(typeof db)
const collectionName = 'recipes';
export const coll = collection(db, collectionName);
console.log(typeof coll)
getDocs(coll)
  .then((querySnapshot) => {
    if (querySnapshot.size > 0) {
      // Collection exists and has documents
      console.log(`Collection '${collectionName}' exists.`);
    } else {
      // Collection is empty (it exists, but has no documents)
      console.log(`Collection '${collectionName}' exists but is empty.`);
    }
  })
  .catch((error) => {
    // Collection does not exist or there was an error
    if (error.code === 'permission-denied') {
      console.log(`Permission denied to access collection '${collectionName}'.`);
    } else {
      console.error(`Error checking collection '${collectionName}':`, error);
    }
  });

function App() {

  const [loggedIn, setLoggedIn] = useState(false)
  const [user, setUser] = useState("")
  const [email, setEmail] = useState(null)
  const [id, setId] = useState("")

  const app = initializeApp(firebaseConfig)
  const provider = new GoogleAuthProvider();
  const auth = getAuth(app)

  console.log(firebaseConfig, typeof(db))

  function signIn() {
    signInWithPopup(auth, provider).then((result) => {
      setUser(result.user)
      setLoggedIn(true);
      setId(result.user.uid);
      setEmail(result.user.email)
    }).catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      const email = error.customData.email;
      const credential = GoogleAuthProvider.credentialFromError(error);
      console.log(errorCode, errorMessage, email, credential)
    })
}

function handleSignOut() {
    signOut(auth).then(() => {
      setLoggedIn(false);
      setId("");
      setUser("");
    }).catch((error) => {
      console.log('error')
    });
}

  return (
    <div className="App">
    <Navbar expand="lg" className="bg-body-tertiary">
    <Container>
      <Navbar.Brand>remy</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      {user === "" ? <GoogleButton onClick={signIn}/> : 
      <Row>
        <Col><p>{email}</p></Col>
        <Col>
        <Button onClick={handleSignOut}>Sign Out</Button> 
        </Col>
      </Row>}
    </Container>
  </Navbar>
      <header className="App-header">
      {!loggedIn ? 
      <Container>
        <p>Hi, I'm Remy!</p>
      <p>
        I'm here to help you find good recipes to make!
      </p>
      Please sign in to search for recipes or look at your saved recipes.
      </Container>
      : 
      <Tabs
      defaultActiveKey="home"
      id="content"
      className="mb-12"
    >
      <Tab eventKey="home" style={{color: "white"}} title="Search">
        <Search uid={id}/>
      </Tab>
      <Tab eventKey="recipes" style={{color: "white"}} title="Saved Recipes">
        <SavedRecipes />
      </Tab>
    </Tabs>}
      </header>
    </div>
  );
}

export default App;
