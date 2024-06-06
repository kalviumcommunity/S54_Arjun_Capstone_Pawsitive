import Navbar from './Navbar'
import { Button } from '@chakra-ui/react'

const Donate = () => {
  const paymentHandler = async (event) => {

    const amount = 4000;
    const currency = 'INR';
    const receiptId = '1234567890';

    const response = await fetch(`http://localhost:3000/order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount,
        currency,
        receipt: receiptId
      })
    })

    const order = await response.json();
    console.log('order', order);


    var option = {
      key: "rzp_test_HJ49W37lm3zrO7",
      amount,
      currency,
      name: "Pawsitive",
      description: "Test Transaction",
      image: "https://firebasestorage.googleapis.com/v0/b/pawsitive-64728.appspot.com/o/Group%204.svg?alt=media&token=a73092f5-81dd-4883-9d09-a7b647b396d0",
      order_id: order.id,
      handler: async function (response) {

        const body = { ...response, }

        const validateResponse = await fetch('http://localhost:3000/validate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body)

        })

        const jsonResponse = await validateResponse.json();

        console.log('jsonResponse', jsonResponse);

      },
      prefill: {
        name: "Web Coder",
        email: "webcoder@example.com",
        contact: "9000000000",
      },
      notes: {
        address: "Razorpay Corporate Office",
      },
      theme: {
        color: "#000000",
      },
    }

    var rzp1 = new window.Razorpay(option);
    rzp1.on("payment.failed", function (response) {
      alert(response.error.code);
      alert(response.error.description);
      alert(response.error.source);
      alert(response.error.step);
      alert(response.error.reason);
      alert(response.error.metadata.order_id);
      alert(response.error.metadata.payment_id);
    })

    rzp1.open();
    event.preventDefault();
  }
  
  return (
    <div>
      <Navbar />

      <form><script src="https://checkout.razorpay.com/v1/payment-button.js" data-payment_button_id="pl_O7W9jWb8qDNznW" async> </script>
        <Button onClick={paymentHandler}>Donate now</Button>
      </form>
    </div>
  )
}

export default Donate