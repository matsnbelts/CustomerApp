import React, { Component } from 'react'
import { Dimensions, Image, StyleSheet, ScrollView, Modal, Keyboard, View, ActivityIndicator } from 'react-native'
import firebase from '../Firebase';
import { Card, Input, Button, Block, Text, Switch } from '../components';
import { theme, mocks } from '../constants';
import { Calendar } from 'react-native-calendars'
import moment from 'moment';
import { AirbnbRating } from 'react-native-ratings';

const { width } = Dimensions.get('window');

let CUSTOMER = '+917022268034'
const _format = 'YYYY-MM-DD'
const _today = moment().format(_format)
const _maxDate = moment().add(20, 'days').format(_format)
const _minDate = moment().add(-20, 'days').format(_format)

const fireStore = {
  CUSTOMER: 'customers',
  INTERIOR_DATES: 'interior_service_dates',
  EXTERIOR_DATES: 'exterior_services_unavailability',
  RATINGS: 'job_allocation'
}

class Browse extends Component {
  constructor(props) {
    super(props)
    this.state = {
      active: 'Products',
      categories: [],
      interior_offered: [],
      exterior_cancelled: [],
      all_dates: {},
      current_date: '',
      showRatings: false,
      showBookings: false,
      comments: '',
      isLoading: false,
      interior_value: false,
      exterior_cancel_value: false,
      customer_details: {},
      ratings_loading: false,
      bookings_loading: false,
      current_ratings: 3,
      all_loaded: true,
      cust_details_loaded: false,
      exterior_admin_cancelled: [],
      customer_name: '',
      customer_cars: [],
      customer_apartment: '',
    }

  }

  componentWillMount() {
    CUSTOMER = this.props.navigation.getParam('customer', '+917022268034');
    CUSTOMER = '+91'+CUSTOMER
    console.log(CUSTOMER)
    this.get_customer_details()
  }

  get_interior_offeref_dates() {
    let interior_offered_dates = []
    firebase.firestore().collection(fireStore.INTERIOR_DATES).doc(this.state.customer_apartment).collection('Dates').
    onSnapshot((querySnapshot)=>{
      querySnapshot.forEach((doc)=>{
        interior_offered_dates.push(moment(doc.id).format(_format))
      })
      this.setState({interior_offered: interior_offered_dates})
      console.log(interior_offered_dates)
      this.setState({ interior_offered: interior_offered_dates })
      console.log(this.state.interior_offered)
    })
  }

  get_interior_availed_dates(){
    let intertior_availed_dates = []
    firebase.firestore().collection(fireStore.INTERIOR_DATES).doc(this.state.customer_apartment).collection('Dates').where('Cars', 'array-contains', this.state.customer_cars[0]).
    onSnapshot((querySnapshot)=>{
      querySnapshot.forEach((doc)=>{
        intertior_availed_dates.push(moment(doc.id).format(_format))
      })
      this.setState({interior_availed: intertior_availed_dates})
    })
  }

  get_exterior_cancelled_dates(){
    let exterior_cancelled_dates = []
    firebase.firestore().collection(fireStore.EXTERIOR_DATES).doc(this.state.customer_apartment).collection('Dates').
    onSnapshot((querySnapshot)=>{
      querySnapshot.forEach((doc)=>{
        exterior_cancelled_dates.push(moment(doc.id).format(_format))
      })
      this.setState({exterior_admin_cancelled: exterior_cancelled_dates})
    })
    firebase.firestore().collection(fireStore.EXTERIOR_DATES).doc(this.state.customer_apartment).collection('Dates').where('Cars', 'array-contains', this.state.customer_cars[0]).
    onSnapshot((querySnapshot)=>{
      querySnapshot.forEach((doc)=>{
        exterior_cancelled_dates.push(moment(doc.id).format(_format))
      })
      var set = new Set(exterior_cancelled_dates)
      exterior_cancelled_dates = Array.from(set)
      this.setState({exterior_cancelled: exterior_cancelled_dates})
      this.arrange_date()
    })
  }

  set_ratings(){
    this.setState({ ratings_loading: true })
    Keyboard.dismiss();
    day = this.state.current_date
    MONTH = moment(day).format('MM')
    MONTH = MONTH[0]==0?MONTH[1]:MONTH
    DAY = moment(day).format('DD')
    DAY = DAY[0]==0?DAY[1]:DAY
    YEAR = moment(day).format('YYYY')
    firebase.firestore().collection(fireStore.RATINGS).doc(YEAR).collection(MONTH).doc(DAY).collection('cars').doc(this.state.customer_cars[0]).
    set({'customerFeedback': this.state.comments, 'cutomerRatings': this.state.current_ratings }, {merge: true}).
    then(() => {
      this.setState({ showRatings: false, ratings_loading: false, current_ratings: 3, comments: '' })
    })
  }

  change_interior_exterior_pref(){
    this.setState({ bookings_loading: true })
    Keyboard.dismiss();
    day = this.state.current_date
    MONTH = moment(day).format('MMMM')
    MONTH = MONTH[0]==0?MONTH[1]:MONTH
    DAY = moment(day).format('DD')
    DAY = DAY[0]==0?DAY[1]:DAY
    YEAR = moment(day).format('YYYY')
    // var docRef = firebase.firestore().collection('interior_service_dates').doc('Karapakkam').collection(MONTH).doc(DAY.toString()).collection(CUSTOMER).doc('Services')
    // docRef.set({ 'Interior_availed': this.state.interior_value, 'exterior_cancelled': this.state.exterior_cancel_value }
    // ).then((doc) => {
    //   let dates_ref = this.state.all_dates
    //   if (this.state.interior_value)
    //     dates_ref[day] = { selected: true, marked: true, selectedColor: 'green' }
    //   if (this.state.exterior_cancel_value)
    //     dates_ref[day] = { selected: true, selectedColor: 'rgb(206,89,74)' }
    //   this.setState({ showBookings: false, bookings_loading: false, interior_value: false, exterior_cancel_value: false, all_dates: dates_ref })
    // })
    console.log(DAY+' '+MONTH+' '+YEAR)
    this.setState({ showBookings: false, bookings_loading: false, interior_value: false, exterior_cancel_value: false})
    firebase.firestore().collection(fireStore.INTERIOR_DATES).doc(this.state.customer_apartment).collection('Dates').doc(DAY+'-'+MONTH+'-'+YEAR).
    get().then((doc)=>{
      let cars = doc.data().Cars
      temp_Car = this.state.customer_cars[0]
      if(this.state.interior_value){
        if(!cars.includes(temp_Car)){
          cars.push(temp_Car)
        }
      }
      else{
        if(cars.includes(temp_Car)){
          cars = cars.filter(function(value, index, arr){
            return value != temp_Car;
        });
        }
      }
      this.setState({ showBookings: false, bookings_loading: false, interior_value: false, exterior_cancel_value: false, all_dates: dates_ref })
      firebase.firestore().collection(fireStore.INTERIOR_DATES).doc(this.state.customer_apartment).collection('Dates').doc(DAY+'-'+MONTH+'-'+YEAR).
    set({Cars: cars}, {merge: true}).then(() =>{
      let dates_ref = this.state.all_dates
        if (this.state.interior_value){
          dates_ref[day] = { selected: true, marked: true, selectedColor: 'green' }
        }
        if (this.state.exterior_cancel_value){
          dates_ref[day] = { selected: true, selectedColor: 'rgb(206,89,74)' }
        }
        this.setState({ showBookings: false, bookings_loading: false, interior_value: false, exterior_cancel_value: false, all_dates: dates_ref })
      }).catch((err)=>{this.setState({ showBookings: false, bookings_loading: false, interior_value: false, exterior_cancel_value: false, all_dates: dates_ref })})
      }).catch((err)=>{this.setState({ showBookings: false, bookings_loading: false, interior_value: false, exterior_cancel_value: false, all_dates: dates_ref })})

    // firebase.firestore().collection(fireStore.EXTERIOR_DATES).doc(this.state.customer_apartment).collection('Dates').doc(DAY+'-'+MONTH+'-'+YEAR).
    // get().then((doc)=>{
    //   let cars = doc.data().Cars
    //   temp_Car = this.state.customer_cars[0]
    //   if(this.state.exterior_cancel_value){
    //     if(!cars.includes(temp_Car)){
    //       cars.push(temp_Car)
    //     }
    //   }
    //   else{
    //     if(cars.includes(temp_Car)){
    //       cars = cars.filter(function(value, index, arr){
    //         return value != temp_Car;
    //     });
    //     }
    //   }
    //   firebase.firestore().collection(fireStore.EXTERIOR_DATES).doc(this.state.customer_apartment).collection('Dates').doc(DAY+'-'+MONTH+'-'+YEAR).
    // set({Cars: cars}, {merge: true}).then(() =>{
    // let dates_ref = this.state.all_dates
    //   if (this.state.interior_value){
    //     dates_ref[day] = { selected: true, marked: true, selectedColor: 'green' }
    //   }
    //   if (this.state.exterior_cancel_value){
    //     dates_ref[day] = { selected: true, selectedColor: 'rgb(206,89,74)' }
    //   }
    //   this.setState({ showBookings: false, bookings_loading: false, interior_value: false, exterior_cancel_value: false, all_dates: dates_ref })
    // }).catch((err)=>{this.setState({ showBookings: false, bookings_loading: false, interior_value: false, exterior_cancel_value: false, all_dates: dates_ref })})
    // })
  }

  get_customer_details() {
    var docRef = firebase.firestore().collection(fireStore.CUSTOMER).doc(CUSTOMER)
    docRef.get().then((doc) => {
      let car_details = doc.data()
      this.setState({ 
        customer_details: car_details,
        cust_details_loaded: true,
        customer_name: car_details.name.split(' ')[0],
        customer_cars: Object.keys(car_details.Cars),
        customer_apartment: car_details.apartment })
      this.get_interior_offeref_dates()
      this.get_interior_availed_dates()
      this.get_exterior_cancelled_dates()
    })
  }

 
  arrange_date() {
    startDate = moment(_minDate);
    endDate = moment(_maxDate);

    var now = startDate, dates_a = {};
    let interior_offered = this.state.interior_offered
    let interior_availed = this.state.interior_availed
    let cancelled_dates = this.state.exterior_cancelled
    while (now.isBefore(endDate) || now.isSame(endDate)) {
      if (interior_offered.includes(now.format(_format)) || interior_availed.includes(now.format(_format)) || cancelled_dates.includes(now.format(_format))) {
        if (interior_offered.includes(now.format(_format)) && interior_availed.includes(now.format(_format)))
          dates_a[now.format(_format)] = { selected: true, selectedColor: 'green' }
        else if (interior_offered.includes(now.format(_format)))
          dates_a[now.format(_format)] = { marked: true, dotColor: 'green' }
        else if (interior_availed.includes(now.format(_format)))
          dates_a[now.format(_format)] = { selected: true, marked: true, selectedColor: 'green' }
        else if (cancelled_dates.includes(now.format(_format)))
          dates_a[now.format(_format)] = { selected: true, selectedColor: 'rgb(206,89,74)' }

      }
      else {
        dates_a[now.format(_format)] = { selected: false, marked: false }
      }
      now.add(1, 'days');
    }
    this.setState({
      all_dates: dates_a,
      all_loaded: false,
    })

  }

  onDaySelect = (day) => {
    // MONTH = moment(day.dateString).format('MMMM')
    // DAY = moment(day.dateString).format('DD')
    // var docRef = firebase.firestore().collection('customer_ratings').doc(MONTH).collection(DAY).doc(CUSTOMER)
    // docRef.get().then((doc) => {
    //   if (doc.exists) {
    //     console.log(doc.data())
    //   }
    // })
    const _selectedDay = moment(day.dateString).format(_format);
    this.setState({ current_date: _selectedDay })
    if (_today < _selectedDay)
      this.setState({ showBookings: true })
    else
      this.setState({ showRatings: true })
  }

  renderRatingsPanel() {
    return (
      <Modal animationType="slide" visible={this.state.showRatings} onRequestClose={() => this.setState({ showRatings: false })}>
        <Block padding={[theme.sizes.padding * 2, theme.sizes.padding]} space="between">
          <Text h2 bold>{'Selected Date : '}
            <Text h2 primary>{this.state.current_date}</Text>
          </Text>
          <ScrollView style={{ marginVertical: theme.sizes.padding }}>
            <Text h3 bold>Your rating</Text>
            <AirbnbRating onFinishRating={(rating) => this.setState({ current_ratings: rating })} />
            <Text h3 bold> </Text>
            <Text h3 bold>Your Comments</Text>
            <Text title> </Text>
            <Input
              label="Feedback"
              style={styles.input}
              defaultValue={this.state.comments}
              onChangeText={text => this.setState({ comments: text })}
              multiline={true}
              numberOfLines={4}
            />
          </ScrollView>

          <Block middle padding={[theme.sizes.base / 2, 0]}>
            <Button gradient onPress={() => {
              this.set_ratings()
            }}>
              {this.state.ratings_loading ?
                <ActivityIndicator size="small" color="white" /> :
                <Text center title white>Done</Text>
              }
            </Button>
          </Block>
        </Block>
      </Modal>
    )
  }

  renderBookingPanel() {
    return (
      <Modal animationType="slide" visible={this.state.showBookings} onRequestClose={() => this.setState({ showBookings: false })}>
        <Block padding={[theme.sizes.padding * 2, theme.sizes.padding]} space="between">
          <Text h2 bold>{'Selected Date : '}
            <Text h2 primary>{this.state.current_date}</Text>
          </Text>
          <ScrollView style={{ marginVertical: theme.sizes.padding }}>
          
            <Text h3 bold>Interior cleaning</Text>
            <Text title> </Text>
            <Block style={styles.toggles}>
              <Block row center space="between" style={{ marginBottom: theme.sizes.base * 2 }}>
                <Text title>Schedule Interior cleaning</Text>
                <Switch
                  value={this.state.interior_value}
                  onValueChange={value => this.setState({ interior_value: value })}
                />
              </Block>
            </Block>
            <Text h3 bold> </Text>
            <Text h3 bold>Exterior cleaning</Text>
            <Text title> </Text>
            <Block style={styles.toggles}>
              <Block row center space="between" style={{ marginBottom: theme.sizes.base * 2 }}>
                <Text title>Cancel Exterior cleaning</Text>
                <Switch
                  value={this.state.exterior_cancel_value}
                  onValueChange={value => this.setState({ exterior_cancel_value: value })}
                />
              </Block>
            </Block>
          </ScrollView>

          <Block middle padding={[theme.sizes.base / 2, 0]}>
            <Button gradient onPress={() => {
              this.change_interior_exterior_pref()
            }}>
              {this.state.bookings_loading ?
                <ActivityIndicator size="small" color="white" /> :
                <Text center title white>Done</Text>
              }
            </Button>
          </Block>
        </Block>
      </Modal>
    )
  }
  render_calendar() {
    if (this.state.all_loaded) {
      return (
        <View>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )
    }
    return (
      <Calendar
        minDate={_minDate}
        maxDate={_maxDate}
        onDayPress={this.onDaySelect}
        markedDates={this.state.all_dates}
        firstDay={1}
      />
    )
  }
  render_customer_details() {
    if (!this.state.cust_details_loaded) {
      return (<View></View>)
    }
    return (
      <Block flex={false} row center space="evenly" style={styles.header}>
        <Card middle shadow style={styles.category}>
          <Text small>
            <Image
              source={require('../assets/images/profile.png')}
              style={styles.avatar}
            />
            {this.state.customer_name}
          </Text>
          <Text body>
            <Image
              source={require('../assets/images/car.png')}
              style={styles.avatar}
            />
            {' TN 43 A ' + this.state.customer_cars[0]}
          </Text>
        </Card>
        <Button gradient onPress={() => { }}>
          <Text semibold white center>{'  Change Car  '}</Text>
        </Button>
      </Block>
    )
  }
  render() {
    const { profile, navigation } = this.props;

    return (
      <Block>
        <Block flex={false} row center space="between" style={styles.header}>
          <Text h2 bold>Mats & Belts
          <Text h2 primary> Car Wash</Text>
          </Text>
          <Button onPress={() => navigation.navigate('Settings')}>
            <Image
              source={require('../assets/images/avatar.png')}
              style={styles.avatar}
            />
          </Button>
        </Block>
        <ScrollView>
          {this.render_customer_details()}
          {this.render_calendar()}
        </ScrollView>
        {this.renderRatingsPanel()}
        {this.renderBookingPanel()}
      </Block>
    )
  }
}

const mapStateToProps = state => ({
  dates_1: state.dates.dates,
  start_date: state.dates.start_date,
  end_date: state.dates.end_date
})

// export default connect(mapStateToProps, { get_dates })(Browse);
export default Browse

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: theme.sizes.base * 2,
  },
  avatar: {
    height: theme.sizes.base * 2.2,
    width: theme.sizes.base * 2.2,
  },
  tabs: {
    borderBottomColor: theme.colors.gray2,
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginVertical: theme.sizes.base,
    marginHorizontal: theme.sizes.base * 2,
  },
  tab: {
    marginRight: theme.sizes.base * 2,
    paddingBottom: theme.sizes.base
  },
  active: {
    borderBottomColor: theme.colors.secondary,
    borderBottomWidth: 3,
  },
  categories: {
    flexWrap: 'wrap',
    paddingHorizontal: theme.sizes.base * 2,
    marginBottom: theme.sizes.base * 3.5,
  },
  category: {
    // this should be dynamic based on screen width
    minWidth: (width - (theme.sizes.padding * 2.4) - theme.sizes.base) / 2,
    maxWidth: (width - (theme.sizes.padding * 2.4) - theme.sizes.base) / 2,
    maxHeight: (width - (theme.sizes.padding * 2.4) - theme.sizes.base) / 2,
  },
  input: {
    borderRadius: 0,
    borderWidth: 0,
    borderBottomColor: theme.colors.gray2,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  toggles: {
    paddingHorizontal: theme.sizes.base * 2,
  }
})
