export function parseDatePublished(publishedAt: string | Date): string {
  const now = new Date();
  const publishedDate = new Date(publishedAt);

  const diffInSeconds = Math.floor((+now - +publishedDate) / 1000); // Sử dụng dấu "+" để ép kiểu thành số

  const minutes = 60;
  const hours = minutes * 60;
  const days = hours * 24;
  const months = days * 30;

  if (diffInSeconds < minutes) {
    return `${diffInSeconds} giây trước`
  }

  if (diffInSeconds < hours) {
    return `${Math.floor(diffInSeconds / minutes)} phút trước`
  }

  if (diffInSeconds < days) {
    return `${Math.floor(diffInSeconds / hours)} giờ trước`
  }

  if (diffInSeconds < months) {
    return `${Math.floor(diffInSeconds / days)} ngày trước`
  }

  return `${Math.floor(diffInSeconds / months)} tháng trước`;
}

