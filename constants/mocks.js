const categories = [

];

const products = [
 
];

const explore = [
  
];

const profile = {
  username: 'Surya Tej',
  location: '45, Velachery - Tambaram Main Rd',
  email: '8012352852',
  avatar: require('../assets/images/avatar.png'),
  budget: 1000,
  monthly_cap: 5000,
  notifications: true,
  newsletter: false,
};

const firebaseStores = {
  CUSTOMER: 'customers',
  INTERIOR_DATES: 'interior_service_dates',
  EXTERIOR_DATES: 'exterior_services_unavailability'
  
}

export {
  categories,
  explore,
  products,
  profile,
  firebaseStores
}