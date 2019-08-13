import firebase from 'firebase'

export const getInteriorServiceAvailabilityAction = (apartment) => {
    return (dispatch, getState, { getFirestore }) => {
        const firestore = getFirestore()
        firestore.collection('interior_service_dates').doc(apartment).get().then(function(doc) {
            if(doc.exists) {
                const dates = doc.data()
                dispatch({ type: 'GET_INTERIOR_SERVICE_DATES', dates })
            }
            else {
                dispatch({ type: 'GET_INTERIOR_SERVICE_DATES_ERROR', apartment })
            }
        });   
    }
}

export const updateInteriorServiceAvailabilityAction = (apartment, dates) => {
    return (dispatch, getState, { getFirestore }) => {
        let timeStampDates = [];
        dates.forEach((interior_date) => {
            const timeStampDate = new firebase.firestore.Timestamp.fromDate(new Date(interior_date));
            timeStampDates.push(timeStampDate)
        });
        dates = timeStampDates;
        const firestore = getFirestore()
        firestore.collection('interior_service_dates').doc(apartment).update({
            dates
        }) 
    }
}