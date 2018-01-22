import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { channelsListQuery } from './ChannelsListWithData';

const AddChannel = ({ mutate }) => {
  const handleKeyUp = (evt) => {
    if (evt.keyCode === 13) {
        evt.persist();
        mutate({
            variables: { name: evt.target.value },
            refetchQueries: [ { query: channelsListQuery }]
        })
        .then(res => {
            console.log(evt.target.value);
            evt.target.value = '';
        });
    }
  };

  return (
    <input
      type="text"
      placeholder="New channel"
      onKeyUp={handleKeyUp}
    />
  );
};

const addChannelMutation = gql`
  mutation addChannel($name: String!) {
    addChannel(name: $name) {
      id
      name
    }
  }
`;
const AddChannelWithMutation = graphql(
  addChannelMutation
)(AddChannel);

// export default AddChannel;
export default AddChannelWithMutation;