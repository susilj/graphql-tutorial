import React, { Component } from 'react';
import {
  BrowserRouter,
  Link,
  Route,
  Switch,
} from 'react-router-dom';
import ApolloClient from 'apollo-client-preset';
// import { createNetworkInterface } from 'apollo-client';
import { 
  // HttpLink,
  createHttpLink
} from 'apollo-link-http';
import {
  ApolloLink,
  // concat,
  // Observable
} from 'apollo-link';
import { InMemoryCache } from 'apollo-cache-inmemory';
import {
  ApolloProvider,
  // createNetworkInterface
  toIdValue,
} from 'react-apollo';
import {
  makeExecutableSchema,
  addMockFunctionsToSchema
} from 'graphql-tools';
// import { mockNetworkInterfaceWithSchema } from 'apollo-test-utils';

import { typeDefs } from './schema';
// import logo from './logo.svg';
import './App.css';
import ChannelsListWithData from './components/ChannelsListWithData';
import NotFound from './components/NotFound';
import ChannelDetails from './components/ChannelDetails';

const schema = makeExecutableSchema({ typeDefs });

addMockFunctionsToSchema({ schema });

// const mockNetworkInterface = mockNetworkInterfaceWithSchema({ schema });
// const networkInterface = createNetworkInterface({ 
//   uri: 'http://localhost:4000/graphql',
// });

const httpLink = createHttpLink({ uri: 'http://localhost:4000/graphql' });

function dataIdFromObject(result) {
  if (result.__typename) {
    if (result.id !== undefined) {
      return `${result.__typename}:${result.id}`;
    }
  }
  return null;
}

// function test(operation, forward) {
//   return forward(operation)
// }

const authMiddleware = new ApolloLink((operation, forward) => {
  // console.log(operation.operationName);
  return forward(operation);
  // return new Observable(obs => {
  //   setTimeout(() => {
  //     console.log(obs);
  //     // obs.next({ data: { foo: { id: 1 } } });
  //     obs.next({});
  //     obs.complete();
  //   }, 5);
  // });
})

const client = new ApolloClient({
  // link: new HttpLink({ uri: 'http://localhost:4000/graphql' }),
  link: authMiddleware.concat(httpLink),
  cache: new InMemoryCache(),
  customResolvers: {
    Query: {
      channel: (_, args) => {
        return toIdValue(dataIdFromObject({ __typename: 'Channel', id: args['id'] }))
      },
    },
  },
  dataIdFromObject
  // ,
  // networkInterface: mockNetworkInterface
  // networkInterface
});

// const ChannelsList = ({ data: { loading, error, channels } }) => {
//   if (loading) {
//     return <p>Loading ...</p>;
//   }
//   if (error) {
//     return <p>{error.message}</p>;
//   }
//   return <ul>
//     {channels.map(ch => <li key={ch.id}>{ch.name}</li>)}
//   </ul>;
// }
// (
//   <ul className="Item-list">
//     <li>Channel 1</li>
//     <li>Channel 2</li>
//   </ul>
// );

// const channelsListQuery = gql`
//    query ChannelsListQuery {
//      channels {
//        id
//        name
//      }
//    }
//  `;

// const ChannelsListWithData = graphql(channelsListQuery)(ChannelsList);

class App extends Component {
  render() {
    return (
      // <ApolloProvider client={client}>
      //   <div className="App">
      //     <header className="App-header">
      //       <img src={logo} className="App-logo" alt="logo" />
      //       <h1 className="App-title">Welcome to Apollo</h1>
      //     </header>
      //     {/* <ChannelsList /> */}
      //     <ChannelsListWithData />
      //   </div>
      // </ApolloProvider>
      <ApolloProvider client={client}>
        <BrowserRouter>
          <div className="App">
            <Link to="/" className="navbar">React + GraphQL Tutorial</Link>
            <Switch>
              <Route exact path="/" component={ChannelsListWithData} />
              <Route path="/channel/:channelId" component={ChannelDetails} />
              <Route component={NotFound} />
            </Switch>
          </div>
        </BrowserRouter>
      </ApolloProvider>
    );
  }
}

export default App;
