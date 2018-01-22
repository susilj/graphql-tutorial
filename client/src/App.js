import React, { Component } from 'react';
import ApolloClient from 'apollo-client-preset';
// import { createNetworkInterface } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import {
  ApolloProvider,
  // createNetworkInterface
} from 'react-apollo';
import {
  makeExecutableSchema,
  addMockFunctionsToSchema
} from 'graphql-tools';
import { mockNetworkInterfaceWithSchema } from 'apollo-test-utils';

import { typeDefs } from './schema';
import logo from './logo.svg';
import './App.css';
import ChannelsListWithData from './components/ChannelsListWithData';

const schema = makeExecutableSchema({ typeDefs });

addMockFunctionsToSchema({ schema });

const mockNetworkInterface = mockNetworkInterfaceWithSchema({ schema });
// const networkInterface = createNetworkInterface({ 
//   uri: 'http://localhost:4000/graphql',
// });

const client = new ApolloClient({
  link: new HttpLink({ uri: 'http://localhost:4000/graphql' }),
  cache: new InMemoryCache()
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
      <ApolloProvider client={client}>
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h1 className="App-title">Welcome to Apollo</h1>
          </header>
          {/* <ChannelsList /> */}
          <ChannelsListWithData />
        </div>
      </ApolloProvider>
    );
  }
}

export default App;
