export const getStatusLabel = (status?: string) => {
  switch (status) {
    case "payment_succeeded":
      return "Paid";
    case "payment_created":
      return "Payment Created";
    case "payment_failed":
      return "Failed";
    case "payment_pending":
      return "Pending";
    case "payment_processing":
      return "Processing";
    default:
      return status;
  }
}

export const getStatusColor = (status?: string) => {
  switch (status) {
    case "payment_succeeded":
      return "green";
    case "payment_failed":
      return "red";
    case "payment_created":
      return "blue";
    case "payment_processing":
      return "orange";
    default:
      return 'blue';
  }
}

export const formatPrice = (price?: number) => new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
}).format(price ?? 0)