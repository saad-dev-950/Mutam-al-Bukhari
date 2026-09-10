class ToastNotification {
    constructor() {
        this.container = document.getElementById('toast-container');
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.id = 'toast-container';
            document.body.appendChild(this.container);
        }
    }

    show(message, type = 'info', title = null) {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;

        // Set default icons and titles based on type
        let iconClass = 'fas fa-info-circle';
        let defaultTitle = 'Info';

        switch (type) {
            case 'success':
                iconClass = 'fas fa-check-circle';
                defaultTitle = 'Success';
                break;
            case 'error':
                iconClass = 'fas fa-exclamation-circle';
                defaultTitle = 'Error';
                break;
            case 'warning':
                iconClass = 'fas fa-exclamation-triangle';
                defaultTitle = 'Warning';
                break;
        }

        const displayTitle = title || defaultTitle;

        toast.innerHTML = `
            <div class="toast-icon">
                <i class="${iconClass}"></i>
            </div>
            <div class="toast-content">
                <div class="toast-title">${displayTitle}</div>
                <p class="toast-message">${message}</p>
            </div>
            <button class="toast-close"><i class="fas fa-times"></i></button>
            <div class="toast-progress">
                <div class="toast-progress-bar" style="animation: progressShrink 5s linear forwards;"></div>
            </div>
        `;

        // Handle close button
        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => {
            this.hide(toast);
        });

        // Add to container
        this.container.appendChild(toast);

        // Animate in
        // Use a small timeout to allow DOM to render before adding show class
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (toast.parentElement) {
                this.hide(toast);
            }
        }, 5000);
    }

    hide(toast) {
        toast.classList.remove('show');
        toast.addEventListener('transitionend', () => {
            if (toast.parentElement) {
                toast.remove();
            }
        });
    }
}

// Create global instance
const toast = new ToastNotification();

// Helper function to easily call toast from anywhere
window.showToast = (message, type, title) => {
    toast.show(message, type, title);
};
