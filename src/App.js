import './App.css';
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  HttpLink,
  split
} from "@apollo/client";

import { BrowserRouter, Switch, Route} from "react-router-dom";
import Body from './Components/Body';
//import { Switch, Route} from "react-router-dom";
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';

const wsLink = new WebSocketLink({
  uri: 'wss://mithari-auto-parts.herokuapp.com/v1/graphql',
  options: {
    reconnect: true
  }
});
const httpLink = new HttpLink({
  uri: 'https://mithari-auto-parts.herokuapp.com/v1/graphql',
  // headers: {
  //   'x-hasura-access-key': 'zfuKdqZBwg75jKeI79C61mSdzikNYwNhlZeC1kt3pyolwNqIMQ0Re8CNoBiICeJY'
  // }
})
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
);
const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <BrowserRouter>
        <Switch>
          <Route path="/"> <Body /></Route>
        </Switch>
      </BrowserRouter>
    </ApolloProvider>
  );
}

export default App;