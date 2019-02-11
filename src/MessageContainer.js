import PropTypes from 'prop-types';
import React from 'react';

import { View, StyleSheet, Platform } from 'react-native';

import FlatList from './FlatList'
import LoadEarlier from './LoadEarlier';
import Message from './Message';

export default class MessageContainer extends React.PureComponent {

    constructor(props) {
        super(props);

        this.renderRow = this.renderRow.bind(this);
        this.renderFooter = this.renderFooter.bind(this);
        this.renderLoadEarlier = this.renderLoadEarlier.bind(this);
    }

    renderFooter() {
        if (this.props.renderFooter) {
            const footerProps = {
                ...this.props,
            };
            return this.props.renderFooter(footerProps);
        }
        return null;
    }

    renderLoadEarlier() {
        if (this.props.loadEarlier === true) {
            const loadEarlierProps = {
                ...this.props,
            };
            if (this.props.renderLoadEarlier) {
                return this.props.renderLoadEarlier(loadEarlierProps);
            }
            return <LoadEarlier {...loadEarlierProps} />;
        }
        return null;
    }

    scrollTo(options) {
        if (this.flatListRef) {
            this.flatListRef.scrollToOffset(options);
        }
    }

    renderRow({ item, index }) {
        if (!item._id && item._id !== 0) {
            console.warn('GiftedChat: `_id` is missing for message', JSON.stringify(item));
        }
        if (!item.user) {
            if (!item.system) {
                console.warn('GiftedChat: `user` is missing for message', JSON.stringify(item));
            }
            item.user = {};
        }
        const { messages, ...restProps } = this.props;
        const previousMessage = messages[index + 1] || {};
        const nextMessage = messages[index - 1] || {};

        const messageProps = {
            ...restProps,
            key: item._id,
            currentMessage: item,
            previousMessage,
            nextMessage,
            position: item.user._id === this.props.user._id ? 'right' : 'left',
        };

        if (this.props.renderMessage) {
            return this.props.renderMessage(messageProps);
        }
        return <Message {...messageProps} />;
    }

    render() {
        if (this.props.messages.length === 0) {
            return <View style={styles.container} />;
        }
        return (
            <View style={styles.container}>
              <FlatList
                  ref={(ref) => (this.flatListRef = ref)}
                  keyExtractor={(item) => item._id}
                  enableEmptySections
                  automaticallyAdjustContentInsets={false}
                  removeClippedSubviews={Platform.OS === 'android'}
                  inverted={true}
                  {...this.props.listViewProps}
                  data={this.props.messages}
                  style={styles.listStyle}
                  contentContainerStyle={styles.contentContainerStyle}
                  renderItem={this.renderRow}
                  renderHeader={this.renderLoadEarlier}
                  renderFooter={this.renderFooter}
                  {...this.props.invertibleScrollViewProps}
              />
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainerStyle: {
        justifyContent: 'flex-end',
    },
    headerWrapper: {
        flex: 1,
    },
    listStyle: {
        flex: 1,
    },
});

MessageContainer.defaultProps = {
    messages: [],
    user: {},
    renderFooter: null,
    renderMessage: null,
    onLoadEarlier: () => {},
    inverted: true,
    loadEarlier: false,
    listViewProps: {},
    invertibleScrollViewProps: {}, // TODO: support or not?
};

MessageContainer.propTypes = {
    messages: PropTypes.arrayOf(PropTypes.object),
    user: PropTypes.object,
    renderFooter: PropTypes.func,
    renderMessage: PropTypes.func,
    renderLoadEarlier: PropTypes.func,
    onLoadEarlier: PropTypes.func,
    listViewProps: PropTypes.object,
    inverted: PropTypes.bool,
    loadEarlier: PropTypes.bool,
    invertibleScrollViewProps: PropTypes.object, // TODO: support or not?
};
