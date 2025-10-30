import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
const stripePromise = loadStripe("pk_test_51S2ZeuBnWzdYLvMfot50Rsp2e8VxUYKdZgP4EJ2qw2dP4PesSY2uxoqlxVjJQX7qsXN3SxeC7qHJDC0R1hqGWuja00PL8kzUQN");
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

createRoot(document.getElementById('root')).render(

   <Elements stripe={stripePromise}>
     <BrowserRouter>
    <App />
    </BrowserRouter>
   </Elements>
)
