document.addEventListener("DOMContentLoaded", () => {
    const adElements = document.querySelectorAll('div#google-center-div');

    adElements.forEach(ad => {
        const parent = ad.parentNode;
        const nextElement = ad.nextElementSibling;

        if (parent && nextElement?.tagName === 'P') {
            parent.removeChild(ad);
            nextElement.parentNode.insertBefore(ad, nextElement.nextSibling);
        }
    });
});
