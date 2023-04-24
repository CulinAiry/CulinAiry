type NotificationPopupElement = HTMLDivElement | null;

function showNotificationPopup(message: string, color: string) {
  const notificationPopup: NotificationPopupElement = document.querySelector('#notification-popup');
  if (notificationPopup) {
    notificationPopup.innerHTML = message;
    notificationPopup.style.display = 'block';
    notificationPopup.style.backgroundColor = color;
    setTimeout(function () {
      notificationPopup.style.display = 'none';
    }, 5000);
  }
}

export default showNotificationPopup;