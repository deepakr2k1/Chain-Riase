import { NOTIFICATION_FADE_DURATION, NOTIFICATION_TIMEOUT } from '../constants/app';

export function showNotification(message: string, type: 'SUCCESS' | 'WARNING' | 'ERROR'): void {
    // Check if a message is already being displayed and remove it if so
    const existingMessage = document.getElementById('temp-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    // Create a new message element
    const messageElement = document.createElement('div');
    messageElement.id = 'temp-message';
    messageElement.innerText = message;

    // Style the message based on the type
    messageElement.style.position = 'fixed';
    messageElement.style.top = '20px';
    messageElement.style.left = '20px';
    messageElement.style.right = '20px';
    messageElement.style.maxWidth = '1000px';
    messageElement.style.margin = 'auto';
    messageElement.style.padding = '10px 20px';
    messageElement.style.textAlign = 'center';
    messageElement.style.color = 'ivory';
    messageElement.style.fontWeight = 'bold';
    messageElement.style.zIndex = '1000';
    messageElement.style.transition = 'opacity 0.5s';
    messageElement.style.borderRadius = '10px';
    messageElement.style.marginBottom = '10px';
    messageElement.style.display = 'flex';
    messageElement.style.alignItems = 'center';
    messageElement.style.justifyContent = 'center';

    // Close button
    const closeButton = document.createElement('button');
    closeButton.innerText = '×';
    closeButton.style.background = 'transparent';
    closeButton.style.border = 'none';
    closeButton.style.color = 'ivory';
    closeButton.style.fontSize = '24px';
    closeButton.style.cursor = 'pointer';
    closeButton.style.position = 'absolute';
    closeButton.style.right = '10px';
    closeButton.style.top = '50%';
    closeButton.style.transform = 'translateY(-50%)';

    // Close the notification when the button is clicked
    closeButton.onclick = () => {
        messageElement.style.opacity = '0';
        setTimeout(() => messageElement.remove(), NOTIFICATION_FADE_DURATION);
    };

    // Set background color based on the message type
    switch (type) {
        case 'SUCCESS':
            messageElement.style.backgroundColor = 'green';
            break;
        case 'WARNING':
            messageElement.style.backgroundColor = 'darkorange';
            break;
        case 'ERROR':
        default:
            messageElement.style.backgroundColor = 'red';
            break;
    }

    // Append the close button and the message to the body
    messageElement.appendChild(closeButton);
    document.body.appendChild(messageElement);

    // Set a timeout to fade out and remove the message after the defined duration
    setTimeout(() => {
        messageElement.style.opacity = '0';
        setTimeout(() => messageElement.remove(), NOTIFICATION_FADE_DURATION);
    }, NOTIFICATION_TIMEOUT);
}
