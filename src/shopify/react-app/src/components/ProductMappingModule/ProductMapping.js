// ProductMapping.js

import React, { Component } from 'react';
import Sticky from 'react-sticky-el';
import ReactDOM from 'react-dom';
import ProductMappingService from './ProductMappingService';
import axios from 'axios';
import ProductMappingTableRow from './ProductMappingTableRow';
import {
  Layout,
  Page,
  FooterHelp,
  Card,
  Link,
  Button,
  FormLayout,
  TextField,
  AccountConnection,
  ChoiceList,
  SettingToggle,
  Stack,
  Badge,
  Heading,
  PageActions,
  Select,
  Checkbox,
  Spinner, 
  DisplayText,
  TextStyle 
} from '@shopify/polaris';
import '@shopify/polaris/styles.css';
import './AppMP.css';
import './ProductMapping.css';
import { setTimeout } from 'timers';
// import Spinner from '../../lib/components/Spinner';
import { request } from 'http';
import { Row, Col, Container} from 'reactstrap';
import Loading from '../Loading';



class ProductMapping extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isTraceListLoading: true,
      isProductListLoading: true,
      shopifyProducts: [],
      tracedata: [],
      permission: {},
      mapping: {},
      initialMapping: {}
    };

    this.productMappingService = new ProductMappingService();
    this.updateMapping = this.updateMapping.bind(this);
    this.updatePermission = this.updatePermission.bind(this);
    this.onItemChange = this.onItemChange.bind(this);
    this.onPermissionChange = this.onPermissionChange.bind(this);

  }

  updatePermission(permission, shopifyProductID) {
    this.state.permission[shopifyProductID] = permission;
    if (this.state.permission.hasOwnProperty(shopifyProductID)) {
      this.state.mapping[shopifyProductID][1] = permission;
    }

    console.log(this.state.permission);
  }
  updateMapping(tracifiedItemID, shopifyProductID) {
    console.log(shopifyProductID);
    if (this.state.permission.hasOwnProperty(shopifyProductID)) {
      this.state.mapping[shopifyProductID] = [tracifiedItemID, true];
    }
    else {
      this.state.mapping[shopifyProductID] = [tracifiedItemID, false];
    }

    console.log(this.state.mapping);

  }

  onItemChange(tracifiedItemID, shopifyProductID) {

    if (this.state.mapping.hasOwnProperty(shopifyProductID)) {
      if (!(tracifiedItemID == "noItem")) {
        this.state.mapping[shopifyProductID][0] = tracifiedItemID;
      }
      else {
        let tempMapping = this.state.mapping;
        delete tempMapping[shopifyProductID];
        this.state.mapping = tempMapping;
      }
    }
    else {
      this.state.mapping[shopifyProductID] = [tracifiedItemID, false];
    }
    console.log(this.state.mapping);
  }

  onPermissionChange(permission, shopifyProductID) {
    console.log(this.state.mapping[shopifyProductID]);
    console.log(permission);
    console.log(shopifyProductID);
    this.state.mapping[shopifyProductID][1] = permission;
    console.log(this.state.mapping);
  }


  componentDidMount() {
    axios.get('https://tracified-react-api.herokuapp.com/shopify/config/mapping')
      .then(response => {
        this.setState({
          initialMapping: response.data,
          mapping: response.data
        });
        console.log(this.state.initialMapping);

      });
    axios.get('https://tracified-react-api.herokuapp.com/shopify/shop-api/products')
      .then(response => {
        var products = response.data.products;

        products = products.reduce(function (reducedJson, product) {
          reducedJson.push({
            id: product.id,
            title: product.title

          });
          return reducedJson;
        }, []);
        this.setState({ shopifyProducts: products });

        if (response.status == 200) {
          this.setState({ isProductListLoading: false });


        }

      })
      .catch(function (error) {
        console.log(error);
      });


    axios({
      method: 'get',
      url: 'https://tracified-react-api.herokuapp.com/shopify/tracified/item-list',      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
    })
      .then(response_ => {
        this.setState({ tracedata: response_.data });
        console.log("mapping response sttus : " + response_.status);
        console.log("mapping response data : " + JSON.stringify(response_.data));

        let responseTxt = "";
        for ( const obj of response_.data) {
          const itemname = obj.itemName.replace(/\s/g, "-");
          responseTxt += obj.itemID + " : " + itemname + " , ";
      }

      this.setState({ tracedata: responseTxt });
        if (response_.status == 200) {
          this.setState({ isTraceListLoading: false });

        }
      })
      .catch(function (error) {
        console.log("error gettin mapping list :" + error);
      })
  }


  tabRow() {
    const trace = this.state.tracedata;
    if (this.state.shopifyProducts instanceof Array) {
      return this.state.shopifyProducts.map((object, i) => {
        return <ProductMappingTableRow
          onItemChange={this.onItemChange}
          onPermissionChange={this.onPermissionChange}
          obj={object}
          key={i}
          tracelist={trace}
          mapping={this.state.mapping}
        />;

      })

    }
  }

  onChange = (e) => {
    // Because we named the inputs to match their corresponding values in state, it's super easy to update the state
    const state = this.state
    state[e.target.name] = e.target.value;
    this.setState(state);
  }


  onSubmit = (e) => {
    e.preventDefault();
    // get our form data out of state
    const mapping = this.state.mapping;

    /**
     * write functions to adust dynamically a state attribute that holds the current selections by the user.
     * then assign that attribute to the following "mapping:" instead of "{productName, tracifiedItemID, tracifiedItemtitle, permission }"
     * means it should look like " mapping: this.state.mapping"
     * make sure that state.mapping holds the current selections
     */
    axios.post('https://tracified-react-api.herokuapp.com//shopify/config/mapping', { mapping })
      .then((result) => {
        alert("Mapping Successfully Saved!");
        console.log(result);
      });

      // axios({
      //   method: 'post',
      //   url: 'https://tracified-local-test.herokuapp.com/shopify/tracified/item-list',      headers: {
      //     'Content-Type': 'text/plain;charset=utf-8',
      //   },
      // })

  }



  render() {
    const { productName, tracifiedItemID, tracifiedItemtitle, permission, isTraceListLoading, isProductListLoading } = this.state;

    var navStyle={
      // width: '340%',
      zindex: '20'
    }

    if (isTraceListLoading || isProductListLoading) {
      return (
              <Loading/>
      );
      console.log('spinner');
    } else {
      console.log('not spinner');
    }


    return (
      <div class="loader" id="productmapping">
        {/*<Sticky>*/}
        <script src="https://cdnjs.cloudflare.com/ajax/libs/react/15.4.1/react.js"></script>
        
          {/*<form>*/}
            <table className="table table-striped">
              
              <Sticky>

              <thead>
                <Row className="cardWrapper" style={navStyle}>
                <Card>

                {/*<Row>                  
                  <Col sm="10">
                    <p className="MappingDetails" style={{fontWeight:'bold',fontSize:'120%'}}>Product Mapping Details</p>
                  </Col>
                  <Col sm="2">
                    <Button primary onClick={this.onSubmit}>Save</Button>
                  </Col>*/}
                {/*</Row>*/}

                {/*<br />*/}
                
                  <tr>
                    <td>
                      <p className="MappingDetails" style={{fontWeight:'bold',fontSize:'120%'}}>Product Mapping Details</p>
                    </td>
                    <td className="saveBtn">
                      <Button primary onClick={this.onSubmit}>Save</Button>
                    </td>
                  </tr>
                <tr >
                  <Row className="tblHeaders">
                  <Col sm="5" className="pName">Product Name</Col>
                  <Col sm="2" className="Pid">Product Item ID</Col>
                  <Col sm="3" className="tTitle">Tracified Item title</Col>
                  <Col sm="2" className="Permission">Permission</Col>
                </Row>
                </tr>
                
                {/*<Row className="tblHeaders">
                  <Col sm="3" className="pName">Product Name</Col>
                  <Col sm="3" className="Pid">Product Item ID</Col>
                  <Col sm="3" className="tTitle">Tracified Item title</Col>
                  <Col sm="3" className="Permission">Permission</Col>
                </Row>*/}
                </Card>
                </Row>
              </thead>
              </Sticky>
                <br/><br/><br/><br/><br/><br/><br/>
              <tbody>
                {this.tabRow()}
              </tbody>
            </table>            
          {/*</form>*/}
        {/*</Card>*/}
        {/*</Sticky>*/}
      </div>
    );
    <ProductMapping /> , document.getElementById('productmapping')
    console.log('document thing works');
  }

}

export default ProductMapping;