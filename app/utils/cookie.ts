export function setCookie(name: string, value: unknown, days: number, path = '/') {
    let expires = '';
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000)); // Convert days to milliseconds
        expires = `; expires=${date.toUTCString()}`;
    }
    document.cookie = `${name}=${value || ''}${expires}; path=${path}`;
}

export function getCookie(name: string) {
    const nameEQ = `${name}=`;
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length); // Trim leading spaces
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length); // Return cookie value
    }
    return null; // Return null if cookie not found
}