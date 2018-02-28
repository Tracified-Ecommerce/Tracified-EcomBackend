import React, { Component } from 'react';
import * as axios from 'axios';
import { Page, RadioButton, Card, Stack} from '@shopify/polaris';
import { Container, Row, Col} from 'reactstrap';
import FulfilledOrder from './FulfilledOrder';
import Loading from './Loading';
import SearchInput, {createFilter} from 'react-search-input'
const KEYS_TO_FILTER = ['order.order_number']
const QRCode = require('qrcode.react');

class FulfilledOrdersPage extends Component {
    constructor() {
        super();
        this.state = {
            orders: [],
            mapping: {},
            products: {},
            shopDomain: "",
            isOrderListLoading: true,
            isMappingLoading: true,
            search: '',
            isCheckedCus:false,
            isCheckedOrd:true
        };
    }

    componentDidMount() {
        axios.get('/shopify/config/mapping')
            .then(response => {
                if(response.status == 200){
                    this.setState({
                        mapping: response.data
                    });
                }
                this.setState({
                    isMappingLoading: false
                });
                
            }).catch(function(error) {
                console.error(error);
            });
        axios.get('/shopify/shop-api/fulfilled-orders')
            .then(response => {
                this.setState({
                    orders: response.data.fulfilledOrders,
                    shopDomain: response.data.shopDomain,
                    isOrderListLoading: false
                });
            });
    }

    updateSearch(event){
        console.log(this.state.isCheckedCus);
        console.log(this.state.isCheckedOrd);
        this.setState({
            search: event.target.value.substr(0, 20),
        });
    }
    
    clickOrder(){
        this.setState({
            isCheckedCus: false,
            isCheckedOrd:true
        });
    }

    clickCustomer(){
        this.setState({
            isCheckedCus: true,
            isCheckedOrd:false
        });
    }

    render() {

        if (this.state.isOrderListLoading || this.state.isMappingLoading) {
            return <Loading />;
        }
        else {
            // All the order details

            if(this.state.isCheckedCus){
                console.log("cus works");

                let orders = this.state.orders.filter(
                    (order) => {
                        const customer = order.customer.first_name+ " "+order.customer.last_name;
                        const customer1 =customer.toLowerCase();
                        const customer2 =customer.toUpperCase();
                        console.log(customer1);
                        return customer1.indexOf(this.state.search) !== -1 || customer2.indexOf(this.state.search) !== -1 || customer.indexOf(this.state.search) !== -1;
                    }
                );
        
                var orderArray = [];
                orders.forEach((order) => {
                    var items = order.line_items;
                    var lineItems = [];
                    items.forEach(item => {
                        lineItems.push({
                            id: item.id,
                            title: item.title,
                            quantity: item.quantity,
                            variant_title: item.variant_title,
                            product_id: item.product_id
                        });
                    });
            
                    const customer = order.customer.first_name + " " + order.customer.last_name;
            
                    
            
                    orderArray.push({
                        id: order.id,
                        order_number: order.order_number,
                        lineItems: lineItems,
                        customer: customer,
                        created_at: order.created_at.substring(0, 10)
                    });
                });

            } else if(this.state.isCheckedOrd) {
                console.log("ord works");

                let orders = this.state.orders.filter(
                    (order) => {
                        return order.name.indexOf(this.state.search) !== -1 ;
                    }
                 );
    
                 var orderArray = [];
                 orders.forEach((order) => {
                     var items = order.line_items;
                     var lineItems = [];
                     items.forEach(item => {
                         lineItems.push({
                             id: item.id,
                             title: item.title,
                             quantity: item.quantity,
                             variant_title: item.variant_title,
                             product_id: item.product_id
                         });
                     });
          
                     const customer = order.customer.first_name + " " + order.customer.last_name;

                     orderArray.push({
                         id: order.id,
                         order_number: order.order_number,
                         lineItems: lineItems,
                         customer: customer,
                         created_at: order.created_at.substring(0, 10)
                     });
                 });
            } else {

                var orders = this.state.orders;

                var orderArray = [];
                orders.forEach((order) => {
                    var items = order.line_items;
                    var lineItems = [];
                    items.forEach(item => {
                        lineItems.push({
                            id: item.id,
                            title: item.title,
                            quantity: item.quantity,
                            variant_title: item.variant_title,
                            product_id: item.product_id
                        });
                    });

                    const customer = order.customer.first_name + " " + order.customer.last_name;

                    orderArray.push({
                        id: order.id,
                        order_number: order.order_number,
                        lineItems: lineItems,
                        customer: customer,
                        created_at: order.created_at.substring(0, 10)
                    });
                });
            }


            let orders = this.state.orders.filter(
                (order1) => {
                    return order1.name.indexOf(this.state.search) !== -1;
                }
             );

            var inputStyle={
                marginLeft: '1%',
                float: 'center',
                fontSize: '14px',
                marginTop: '1%',
                marginBottom:'1%'
            }

            var tableStyle={
                backgroundColor:"white"
            }

            return (
                <Page title="Tracified Orders" separator>
                    <div style={{paddingBottom:5}}>  
                        <Stack alignment="center" >
                            <Stack.Item>
                                <div style={{padding:"0.4rem", marginBottom:5}}>
                                Filter By :
                                </div>
                            </Stack.Item>
                            <Stack.Item>
                                <RadioButton
                                    
                                    id= "id1"
                                    label="Order ID"
                                    checked= {this.state.isCheckedOrd}
                                    onFocus= {this.clickOrder.bind(this)}
                                />   
                            </Stack.Item>
                            <Stack.Item>
                                
                                <RadioButton
                                label="Customer Name"
                                checked= {this.state.isCheckedCus}
                                onFocus= {this.clickCustomer.bind(this)}

                                />
                            </Stack.Item>
                            <Stack.Item>
                                
                                <input
                                type="text"
                                value={this.state.search}
                                onChange={this.updateSearch.bind(this)}
                                style={inputStyle}
                                />
                                
                            </Stack.Item> 

                        </Stack>
                    </div>
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <td ><b>Order No</b></td>
                                <td ><b>Customer</b></td>
                                <td ><b>Order Item to View</b></td>
                                <td ><b>Trace</b></td>
                            </tr>
                        </thead>
                        <tbody>

                            {orderArray.map((order, index) => {

                                return (
                                    <FulfilledOrder
                                        key={order.order_number}
                                        order={order}
                                        shopDomain={this.state.shopDomain}
                                        mapping={this.state.mapping}
                                    />
                                )
                            })}

                        </tbody>
                    </table>
                </Page>

            );
        }
    }
}

export default FulfilledOrdersPage;
