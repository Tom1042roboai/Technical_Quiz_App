document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('startBtn');
    const deselectAllBtn = document.getElementById('deselectAllBtn');
    
    // Check if button exists
    if (deselectAllBtn) {
        // Deselect all topics functionality
        deselectAllBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Deselect all button clicked');
            const checkboxes = document.querySelectorAll('.topics-container input[type="checkbox"]');
            console.log('Found checkboxes:', checkboxes.length);
            checkboxes.forEach(checkbox => {
                console.log('Unchecking:', checkbox.id, 'was checked:', checkbox.checked);
                checkbox.checked = false;
            });
        });
    } else {
        console.log('Deselect all button not found');
    }
    
    startBtn.addEventListener('click', () => {
        // Get all checked checkboxes that are not disabled
        const selectedTopics = Array.from(document.querySelectorAll('input[type="checkbox"]:checked:not(:disabled)'))
            .map(checkbox => checkbox.value);
        
        if (selectedTopics.length === 0) {
            alert('Please select at least one topic to start the quiz.');
            return;
        }
        
        // Store selected topics in localStorage for the quiz page
        localStorage.setItem('selectedTopics', JSON.stringify(selectedTopics));
        
        // Navigate to the quiz page
        window.location.href = 'quiz.html';
    });
});
