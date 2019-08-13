import moment from 'moment';
import firebase from '../Firebase';


const _format = 'YYYY-MM-DD'
const _today = moment().format(_format)
const _maxDate = moment().add(20, 'days').format(_format)
const _minDate = moment().add(-40, 'days').format(_format)

// this.ref = firebase.firestore().collection('interior_services_availability');
// this.unsubscribe = null;
let interior_offered = ['2019-08-09', '2019-08-04', '2019-08-16', '2019-08-20', '2019-08-25']
// let interior_offered = []
// let interior_availed = []
// let exterior_cancelled = []
let interior_availed = ['2019-08-09', '2019-08-20', '2019-08-25']
let exterior_cancelled = ['2019-08-12', '2019-08-11']
startDate = moment(_minDate);
endDate = moment(_maxDate);
var now = startDate, dates_a = {};
interior_availed= [];

onCollectionUpdate = (querySnapshot) => {
    querySnapshot.forEach((doc) => {
      doc.data().dates.forEach((date)=>{
        interior_availed.push(moment.unix(date.seconds).format("YYYY-MM-DD"))
      })
    })
    // console.log(interior_availed)
    date_maker()

}

// this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate);



function date_maker(){

while (now.isBefore(endDate) || now.isSame(endDate)) {
    if (interior_offered.includes(now.format(_format)) || interior_availed.includes(now.format(_format)) || exterior_cancelled.includes(now.format(_format))) {
        if (interior_offered.includes(now.format(_format)) && interior_availed.includes(now.format(_format)))
            dates_a[now.format(_format)] = { selected: true, selectedColor: 'green' }
        else if (interior_offered.includes(now.format(_format)))
            dates_a[now.format(_format)] = { marked: true, dotColor: 'green' }
        else if (interior_availed.includes(now.format(_format)))
            dates_a[now.format(_format)] = { selected: true, marked: true, selectedColor: 'green' }
        else if (exterior_cancelled.includes(now.format(_format)))
            dates_a[now.format(_format)] = { selected: true, selectedColor: 'rgb(206,89,74)' }

    }
    else {
        dates_a[now.format(_format)] = { selected: false, marked: false }
    }
    now.add(1, 'days');
}

}
// console.log(dates_a)

const initial_state = {
    dates: {},
    start_date: _minDate,
    end_date: _maxDate

}
// console.log(initial_state)

export function dates(state = initial_state, action) {
    // console.log(dates_a)
    switch (action.type) {
        case 'GET_DATES':
            return {
                ...state, dates: action.payload
            }
        case 'CHANGE_RATING':
            return {
                ...state, dates: { ...dates, [action.payload]: { ...dates[action.payload], selectedColor: 'red' } }
            }
        default:
            return state
    }
}

// export function change_rating(state=initial_state, action)