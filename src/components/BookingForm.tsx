const handlePayment = async () => {
  const response = await fetch('/api/checkout', {
    method: 'POST',
    body: JSON.stringify({
      price: 250000,
      customerDetails: { name: "Roy", phone: "0852..." }
    }),
  });
  const { token } = await response.json();

  (window as any).snap.pay(token, {
    onSuccess: function(result: any) {
      alert("Pembayaran Berhasil!");
      // Di sini kamu arahkan ke halaman tiket
      window.location.href = `/tiket?order_id=${result.order_id}`;
    },
    onPending: function(result: any) {
      alert("Menunggu pembayaran...");
    },
  });
};
