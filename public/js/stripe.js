import axios from 'axios';
import { showAlert } from './alert';
const stripe = Stripe(
    'pk_test_51O0cBWIR07OA0xycwoi6lkZOJUgd3bK5OG6pvsuhdpdp9r6bHRB48SEVUbOvuepAmTqQsWRuLKxDlvQc56S0sasc00scVgHobf'
);

export const bookTour = async (tourId) => {
    try {
        // 1) Get checkout session from API
        const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);
        // console.log(session);
        // 2) Create checkout from + chanre credit card
        await stripe.redirectToCheckout({
            sessionId: session.data.session.id,
        });
    } catch (error) {
        console.log(error);
        showAlert('error', error);
    }
};
