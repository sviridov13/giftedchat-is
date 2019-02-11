import React, { Component } from 'react';
import { ScrollView, View, Text } from 'react-native-web';

import type { StyleObj } from 'react-native/Libraries/StyleSheet/StyleSheetTypes';

type PropsType = {|
ItemSeparatorComponent?: ?(React$ComponentType<*> | React$Element<*>),
    renderFooter?: ?(React$ComponentType<*> | React$Element<*>),
    renderHeader?: ?(React$ComponentType<*> | React$Element<*>),
    ListEmptyComponent?: ?(React$ComponentType<*> | React$Element<*>),
    contentContainerStyle?: StyleObj,
    data?: Array<*>,
    horizontal?: boolean,
    keyExtractor?: (item: *) => string,
    renderItem: (obj: { index: number, item: * }) => ?React$Element<*>,
    style?: StyleObj
        |};


class FlatList extends Component<PropsType> {
    renderComponent = (Component: ?(React$ComponentType<*> | React$Element<*>)) => {
        if (!Component) {
            return null;
        }

        if (React.isValidElement(Component)) {
            return Component;
        }

        // $FlowFixMe
        return <Component />;
    }

    scrollToOffset = () => {
        console.log('scroll to bottom')
    }

    render() {
        const {
            ItemSeparatorComponent,
            renderFooter,
            renderHeader,
            ListEmptyComponent,
            contentContainerStyle,
            // data = [],
            horizontal = false,
            keyExtractor,
            renderItem,
            style
        } = this.props;
        const data = this.props.data.slice().reverse();

        return (
            <View style={{height: '90vh'}}>
            <ScrollView
                contentContainerStyle={contentContainerStyle}
                horizontal={horizontal}
                style={style}
            >
                { this.renderComponent(renderHeader) }

                { data.length === 0 ?

                    this.renderComponent(ListEmptyComponent) :

                    data.map((item: *, index: number): React$Node => (
                        <View
                            key={keyExtractor ? keyExtractor(item) : index}
                            // style={{  transform: [{ scaleY: -1 }] }}
                        >
                            { renderItem({ index, item }) }
                            { index < data.length - 1 && this.renderComponent(ItemSeparatorComponent) }
                        </View>
                    ))
                }

                { this.renderComponent(renderFooter) }

            </ScrollView>
            </View>
        );
    }
}

export default FlatList;