import React, { Component } from 'react';
import { Container, Collapse, Row, Col } from 'reactstrap';
import { Button, Card, ResourceList, Thumbnail, Stack } from '@shopify/polaris';
import * as axios from 'axios';
import { isUndefined } from 'util';

class CollapaseCard extends Component {
    constructor(props) {
        super(props);
    }

    render() {

        console.log("item array: "+JSON.stringify(this.props.itemArray));
        let resourceList = this.props.itemArray.map((resItem, index) => {
            let productImage = "no/image";
            if (!isUndefined(this.props.products.length) && !isUndefined(this.props.products)) {
                const product = this.props.products.filter((product) => {
                    return product.id == resItem.product_id
                });

                if (!isUndefined(product[0])) {
                    productImage = product[0].images[0].src;
                    
                }
            }

            let resource = {
                url: '#',
                media: <Thumbnail
                    source={productImage}
                    alt={resItem.title + " Image"}
                />,
                attributeOne: resItem.title,
                attributeTwo: resItem.variant_title,
                attributeThree: resItem.quantity,
            }

            console.log('resource is: '+JSON.stringify(resource));
            return (
                resource
            );
        });

        return (
            <div>
                <ResourceList
                    items={resourceList}
                    renderItem={(item, index) => {
                        return <ResourceList.Item key={index} {...item} />;
                    }}
                />
            </div>
        );
    }
}

export default CollapaseCard;

