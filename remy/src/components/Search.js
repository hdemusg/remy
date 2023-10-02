import React from 'react'
import QueryForm from './QueryForm'
import Container from 'react-bootstrap/Container'

function Search(uid) {
    return (
        <Container>
          <QueryForm uid={uid}/>
        </Container>
        
    );
}

export default Search;