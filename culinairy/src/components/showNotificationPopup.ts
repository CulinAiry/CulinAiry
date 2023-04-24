type NotificationPopupElement = HTMLDivElement | null;

function showNotificationPopup(message: string, color: string) {
  const notificationPopup: NotificationPopupElement = document.querySelector('#notification-popup');
  if (notificationPopup) {
    notificationPopup.innerHTML = message;
    notificationPopup.style.display = 'block';
    notificationPopup.style.backgroundColor = color;
    notificationPopup.style.opacity = '0.9'; // set the opacity to 80%
    setTimeout(function () {
      notificationPopup.style.display = 'none';
    }, 3000);
  }
}

export default showNotificationPopup;