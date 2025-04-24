
    // Get the current URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    
    // Get parameters
    const enrollment = urlParams.get('enrollment');
    const error = urlParams.get('error');
    const success = urlParams.get('success');

    // Show alert if 'enrollment' exists
    if (enrollment) {
        alert(`Enrollment: ${enrollment}`);
        urlParams.delete('enrollment'); // Remove from URL
    }

    // Show alert if 'error' exists
    if (error) {
        alert(`Error: ${error}`);
        urlParams.delete('error'); // Remove from URL
    }

    // Show alert if 'success' exists
    if (success) {
        alert(`Success: ${success}`);
        urlParams.delete('success'); // Remove from URL
    }

    // Update the URL without refreshing the page
    const newUrl = window.location.pathname + (urlParams.toString() ? '?' + urlParams.toString() : '');
    window.history.replaceState(null, '', newUrl);

