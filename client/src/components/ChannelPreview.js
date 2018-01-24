import React from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';


// const ChannelPreview = () => {
//   let channel = { name: "Stub Name"}

//   return (
//     <div className="channelName">
//       {channel.name}
//     </div>
//   );
// };

// export default (ChannelPreview);

const ChannelPreview = ({ data: {loading, error, channel } }) => {
    if (loading) {
      return <p>Loading ...</p>;
    }
    if (error) {
      return <p>{error.message}</p>;
    }

    return (
      <div>
        <div className="channelName">
          {/* {channel.name} */}
          {channel ? channel.name : 'Loading...'}
        </div>
        <div>Loading Messages</div>
      </div>);
  };
  
  export const channelQuery = gql`
    query ChannelQuery($channelId : ID!) {
      channel(id: $channelId) {
        id
        name
      }
    }
  `;
  
  export default (graphql(channelQuery, {
    options: (props) => ({
      variables: { channelId: props.channelId },
    }),
  })(ChannelPreview));