self.addEventListener('push',(event) => {
    console.log('[Service Worker] Push Received.');
    console.log(`[Service Worker] Push had this data: "${event.data.text()}"`);

    const notificationData = event.data.json();
    const title = notificationData.title;
    // 弹消息框
    event.waitUntil(self.registration.showNotification(title, notificationData));
});

self.addEventListener('notificationclick', (event) => {
    const notification = event.notification;
    notification.close();
    event.waitUntil(
        clients.openWindow(notification.data.url)
    );
});