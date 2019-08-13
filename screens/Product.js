import React from 'react'
import { Text, View, ActivityIndicator, ScrollView, List } from 'react-native'
import firebase from '../Firebase';
import moment from 'moment';

const _format = 'YYYY-MM-DD'
const _today = moment().format(_format)
const _maxDate = moment().add(2, 'days').format(_format)
const _minDate = moment().add(-2, 'days').format(_format)

dates = ['2018-08-13', '2018-08-02']
PLACE = 'Karapakkam'
const CUSTOMER = '+917022268034'

class Product extends React.Component {
  constructor() {
    super();

  }

  componentDidMount() {
    firebase.firestore().collection('interior_service_dates').doc('Karapakkam').get().then(
      (doc) => {
        console.log(doc.data())
      }
    )

  }

  

  render() {
    // if(this.state.isLoading){
    //   return(
    //     <View>
    //       <ActivityIndicator size="large" color="#0000ff"/>
    //     </View>
    //   )
    // }
    return (
      <ScrollView>
        <Text>Hellooooooo</Text>
      </ScrollView>
    );
  }
}
export default Product