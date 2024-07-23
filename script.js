// Initialize and display the map on the page
function initMap() {

    // Create a new map centered on coordinates corresponding to Mauritius
    const map = new google.maps.Map(document.getElementById('map'), {
        zoom: 10,
        center: { lat: -20.348404, lng: 57.552152 } 
    });

    // Array of objects containing latitude and longitude for library locations
    const libraryLocations = [
        // Each object contains the latitude, longitude, and name of a library
        { lat: -20.237097998940353, lng: 57.47122853328172, name: "Le Plaza Library" },
        { lat: -20.162036269867002, lng: 57.50007045434399, name: "National Library" },
        { lat: -20.231956315498824, lng: 57.49698054957006, name: "Library University Of Mauritius" },
        { lat: -20.23920429275404, lng: 57.47792613679749, name: "Mediatheque" },
        { lat: -20.161875127543016, lng: 57.50384700462324, name: "Léoville L'Homme City Library" },
        { lat: -20.31518304386117, lng: 57.52691250660469, name: "Bibliothèque Carnegie" },
        { lat: -20.268973882845618, lng: 57.475757416458535, name: "Carrefour Library" },
        { lat: -20.21907018824145, lng: 57.46814143834671, name: "Voice of God library" }
    ];

    // Iterate through the array of library locations
    libraryLocations.forEach((location) => {

        // For each location, create a marker on the map at the library's coordinates
        new google.maps.Marker({
            position: { lat: location.lat, lng: location.lng },
            map: map,
            title: location.name
        });
    });
}


// Run the following code when the DOM content is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    const menuIcon = document.getElementById('menu-icon');
    const menuContent = document.getElementById('menu-content');
    const micIconImg = document.getElementById('mic-icon').getElementsByTagName('img')[0];
    micIconImg.addEventListener('click', toggleMic);


    // Function to toggle speech recognition on and off
    function toggleMic() {

        // Check if the recognition object exists and is an instance of SpeechRecognition
        if (recognition && recognition instanceof SpeechRecognition) {
            if (recognition.listening) { // Check if recognition is currently listening
                recognition.stop();
                listeningForTrigger = false;
                // Update mic icon to microphone off image
                micIconImg.src = 'microphone.png';
                micIconImg.alt = 'Microphone is off';
            } else {
                try {
                    recognition.start();
                } catch (e) {
                    console.error("Recognition start error:", e);
                }
                listeningForTrigger = true;
                // Update mic icon to microphone on image
                micIconImg.src = 'microphone2.png';
                micIconImg.alt = 'Microphone is on';
            }
        }
    }


    const chatWindow = document.getElementById('chat-window');
    const statusDiv = document.getElementById('status');
    let listeningForTrigger = true;

    

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const SpeechSynthesisUtterance = window.SpeechSynthesisUtterance || window.webkitSpeechSynthesisUtterance;

    if (!SpeechRecognition || !SpeechSynthesisUtterance) {
        console.error('Speech APIs are not fully supported in this browser.');
        return;
    }

    let recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.continuous = true; // Set to continuous listening

    const triggerWords = ["hello", "hi"]; // List of trigger words

    // This event handler is triggered whenever the speech recognition service returns a result
    recognition.onresult = (event) => {

        // Get the index of the last speech recognition result
        const lastResultIndex = event.results.length - 1;

        // Retrieve the transcript from the last result, convert it to lowercase, remove any periods, and trim whitespace
        const speechResult = event.results[lastResultIndex][0].transcript.toLowerCase().replace(/[.]/g, '').trim(); 
        console.log(speechResult);
            
        // If the user says "close map", hide the map and stop listening for further speech input
        if (speechResult.includes("close map")) {
            showUserMessage(speechResult);
            document.getElementById('map').style.display = 'none';
            listeningForTrigger = false;
        } 
        
        // If the user invokes the openAI ChatGPT, process the request and stop speech recognition
        else if (speechResult.includes("ask open ai")) { 
            showUserMessage(speechResult);
            getGptResponse(speechResult); 
            recognition.stop();
            listeningForTrigger = false;
        } 
        
        // display Library markers on a map of mauritius
        else if (speechResult.includes("libraries near me")) {
            showUserMessage(speechResult);
            speakAndShow("Below are Libraries located in Mauritius");
            showMapWithLibraries(); 
            listeningForTrigger = false;
        } 
        
        // For "Google Books on [topic]", extract the topic and fetch relevant books
        else if (speechResult.match(/google books on (.+)/i)) {
            showUserMessage(speechResult);
            speakAndShow("Sure, Below are the results for your search");
            const searchTerm = speechResult.match(/google books on (.+)/i)[1];
            fetchGoogleBooks(searchTerm);
            listeningForTrigger = false;
        } 

        // Check if the speech result matches the pattern
        else if (speechResult.match(/^find books on (.+)$/)) {
            showUserMessage(speechResult);
            speakAndShow("Sure, You are being redirected to the middlesex Library");
            const topic = speechResult.match(/^find books on (.+)$/)[1];
            findBooksOnTopic(topic);
            listeningForTrigger = false;
        } 
        
        // Display a list of books and articles related to Year 3 Computer Science
        else if (speechResult.includes("show me reading sources")) {
            showUserMessage(speechResult);
            fetchMatsSearchResults("java");
            listeningForTrigger = false;
        } 
        
        // Show Course materials for all modules available to computer science students of all years
        else if (speechResult.includes("course materials for")) {
            showUserMessage(speechResult);
            const courseCodeMatch = speechResult.match(/course materials for (.+)/);
            if (courseCodeMatch) {
                const courseCode = courseCodeMatch[1].toLowerCase(); // Assuming course codes are uppercase
                fetchCourseMaterials(courseCode);
            }
        } 
        
        // Functionality to recognize the links from the reading list and open them accoridngly
        else if (speechResult.match(/open link (one|two|three|four|1|2|3|4)/)) {
            showUserMessage(speechResult);
            const linkNumberMatch = speechResult.match(/open link (one|two|three|four|1|2|3|4)/);
            const spokenNumber = linkNumberMatch[1];
            const spokenNumberToDigit = {

            // Equate the spoken word to the digit itself, as well as the stringified digit to an actual integer
                "one": 1,
                "two": 2,
                "three": 3,
                "four": 4,
                "1": 1,
                "2": 2,
                "3": 3,
                "4": 4,
            };
            const linkNumber = spokenNumberToDigit[spokenNumber];
            openSearchResultLink(linkNumber);
            listeningForTrigger = false;
        } else if (listeningForTrigger && triggerWords.includes(speechResult)) {
            showUserMessage(speechResult);
            const responseText = 'Hello, how may I help you today?';
            speakAndShow(responseText);
            listeningForTrigger = false;
        } else {
            showStatusMessage("Command not recognized. Please try again.");
        }
    };  


    // This event handler catches any errors that occur during speech recognition
    recognition.onerror = (event) => {
        console.error('Recognition error: ', event.error);
    };


    // This event is triggered when the speech recognition service starts listening
    recognition.onstart = () => {

        // Change the microphone icon to indicate that the microphone is currently active
        micIconImg.src = 'microphone2.png';
        micIconImg.alt = 'Microphone is on';
        recognition.listening = true;

        // Update the status message to prompt the user to speak a command
        statusDiv.textContent = 'Say one of the listed commands...';
    };


    // This event is triggered when the speech recognition service stops listening
    recognition.onend = () => {

        // Revert the microphone icon to indicate that the microphone is not currently active
        micIconImg.src = 'microphone.png';
        micIconImg.alt = 'Microphone is off';
        recognition.listening = false;
        statusDiv.textContent = 'Allow Microphone Permission to Start';

        // If the service is intended to keep listening, restart the recognition service
        if (listeningForTrigger) {
            recognition.start();
        }
    };


    // Display a status message to the user
    function showStatusMessage(message) {
        const statusMessage = document.getElementById('status-message');
        statusMessage.textContent = message;
        
        // Make the status message visible
        statusMessage.style.display = "block";
    
        // Set a timeout to hide the status message after 5 seconds
        setTimeout(() => {
            statusMessage.style.display = "none"; 
        }, 5000); 
    }
    

    // Function to open the library search page with the topic in a new tab
    function findBooksOnTopic(topic) {
        const baseUrl = 'https://mdx.primo.exlibrisgroup.com/discovery/search?';
        const vid = '44MUN_INST:hendon';
        const lang = 'en';
        const query = encodeURIComponent(topic); // Ensures the search term is URL-safe
    
        // Construct the full URL with the search term included
        const searchUrl = `${baseUrl}vid=${vid}&lang=${lang}&query=any,contains,${query}`;
    
        // Open the constructed URL in a new tab
        window.open(searchUrl, '_blank');
    }


    // Show a message from the user in the chat window
    function showUserMessage(message) {
        let userMessageDiv = document.createElement('div');
        userMessageDiv.classList.add('message', 'user');
        userMessageDiv.textContent = message;
        chatWindow.appendChild(userMessageDiv);
        scrollChatToBottom();
    }


    // Show the map with library locations in the chat window
    function showMapWithLibraries() {
        const mapContainer = document.createElement('div');
        mapContainer.classList.add('map-container', 'message', 'assistant'); 
        mapContainer.style.width = '80%'; 
        mapContainer.style.height = '400px'; 
    
        
        mapContainer.id = 'map';
        const chatWindow = document.getElementById('chat-window');
        chatWindow.appendChild(mapContainer);
    
        // Initialize the map within the container
        initMap(); 
        
        if (window.google && window.google.maps) {
            google.maps.event.trigger(map, 'resize');
        }

        // Scroll the chat window to show the map
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }


    // Resize the map to fit the new dimensions
    function resizeMap() {
        const mapContainer = document.getElementById('map');
        if (mapContainer) {
            // Trigger a resize event on the map
            google.maps.event.trigger(map, 'resize');
            mapContainer.style.height = '400px'; 
            mapContainer.style.width = '80%'; 
        }
    }


    // Fetch course materials for a specific course code
    function fetchCourseMaterials(courseCode) {
        // Make a network request to your server's endpoint for course materials
        fetch(`http://localhost:8080/course-materials?courseCode=${courseCode}`)
            .then(response => response.json())
            .then(courseData => {
                displayCourseMaterials(courseData);
            })
            .catch(error => {
                // Log any errors to the console
                console.error('Error fetching course materials:', error);
                // Notify the user that the course materials could not be found and the available courses
                const errorMessage = `Could not find materials for course code ${courseCode}. 
                                        Below are the courses available:<br>
                                        (1) CS1500 - Computing Systems Architecture and Operating Systems<br>
                                        (2) CS1520 - Science, Technology, Engineering and Mathematics<br>
                                        (3) CS1340 - Information in Organisations<br>
                                        (4) CS1510 - Programming for Data Communication and Networks<br>
                                        (5) PDE3413 - Systems Engineering for Robotics<br>
                                        (6) CS2310 - Information Systems Analysis and Design<br>
                                        (7) CS2550 - Software Engineering Management and Development<br>
                                        (8) CS2120 - Web Applications and Databases<br>
                                        (9) CS2560 - Project Management and Professional Practice<br>
                                        (10) CS3990 - UG Individual Project<br>
                                        (11) CS3140 - Novel Interactive technologies<br>
                                        (12) CS3180 - UX Design<br>
                                        (13) CS3170 - Artificial Intelligence<br>
                                        (14) CS3130 - Advanced Web Development with Big Data<br>
                                        (15) CS3110 - Testing and Verification<br></span>
                                        `; 
                speakAndShow(errorMessage);
            });
    }
    

    // Display the corresponding course materials for the selected course
    function displayCourseMaterials(courseData) {
        let courseMaterialsDiv = document.createElement('div');
        courseMaterialsDiv.classList.add('message', 'assistant');
    
        // Course name label and content
        let courseNameLabel = document.createElement('div');
        courseNameLabel.innerHTML = `<strong>Course Name:</strong><br>`;
        let courseName = document.createElement('div');
        courseName.textContent = `${courseData.courseCode}: ${courseData.courseTitle}`;
    
        // Books available label and content
        let booksAvailableLabel = document.createElement('div');
        booksAvailableLabel.innerHTML = `<strong>Books Available:</strong>`;
        let booksList = document.createElement('ul');
        if (courseData.textbooks && courseData.textbooks.length > 0) {
            courseData.textbooks.forEach(textbook => {
                let textbookItem = document.createElement('li');
                textbookItem.textContent = `${textbook.title} by ${textbook.author} (${textbook.year})`;
                booksList.appendChild(textbookItem);
            });
        } else {
            booksList.textContent = 'No textbooks listed.';
        }
    
        // Resources label and content
        let resourcesLabel = document.createElement('div');
        resourcesLabel.innerHTML = `<strong>Resources:</strong>`;
        let resourcesList = document.createElement('ul');
        if (courseData.resources && courseData.resources.length > 0) {
            courseData.resources.forEach(resource => {
                let resourceItem = document.createElement('li');
                let resourceLink = document.createElement('a');
                resourceLink.href = resource.link;
                resourceLink.textContent = resource.type;
                resourceLink.target = '_blank';
                resourceItem.appendChild(resourceLink);
                resourcesList.appendChild(resourceItem);
            });
        } else {
            resourcesList.textContent = 'No additional resources listed.';
        }

        if (courseData.videoLink) {
            let videoLabel = document.createElement('div');
            videoLabel.innerHTML = `<strong>Video Lecture:</strong>`;
            let videoFrame = document.createElement('iframe');
            videoFrame.width = "560"; // width of the video
            videoFrame.height = "315"; // height of the video
            // Ensure that you are using the embed URL format as shown below
            videoFrame.src = courseData.videoLink; 
            videoFrame.frameBorder = "0";
            videoFrame.allow = "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture";
            videoFrame.allowFullscreen = true;
            courseMaterialsDiv.appendChild(videoLabel);
            courseMaterialsDiv.appendChild(videoFrame);
        }
        
    
        // Assembling the message
        courseMaterialsDiv.appendChild(courseNameLabel);
        courseMaterialsDiv.appendChild(courseName);
        courseMaterialsDiv.appendChild(booksAvailableLabel);
        courseMaterialsDiv.appendChild(booksList);
        courseMaterialsDiv.appendChild(resourcesLabel);
        courseMaterialsDiv.appendChild(resourcesList);
    
        chatWindow.appendChild(courseMaterialsDiv);
        scrollChatToBottom();
    }
    
    
    // This functions displays and then reads out parametres
    function speakAndShow(message) {
        if (typeof message !== 'string') {
            console.error('speakAndShow expects a string argument');
            return;
        }

        let utterance = new SpeechSynthesisUtterance(message);
        window.speechSynthesis.speak(utterance);
    
        let assistantMessageDiv = document.createElement('div');
        assistantMessageDiv.classList.add('message', 'assistant');

        // Use innerHTML to interpret HTML content, like <br> for line breaks
        assistantMessageDiv.innerHTML = message.replace(/\n/g, '<br>');
        chatWindow.appendChild(assistantMessageDiv);
        scrollChatToBottom();
        resizeMap();
    }


    // Display hardcoded books and materials for 3rd year students
    function fetchMatsSearchResults(searchTerm) {
        // Hardcoded search results with links
        const searchResults = [
            {
                title: 'Interaction design : beyond human-computer interaction.',
                url: 'https://mdx.primo.exlibrisgroup.com/discovery/fulldisplay?context=L&vid=44MUN_INST:hendon&search_scope=Hendon_Campus&isFrbr=true&tab=Books_More&docid=alma991003407241004781',
                imageUrl: 'content.jpeg'
            },

            {
                title: 'Designing media',
                url: 'https://mdx.primo.exlibrisgroup.com/discovery/fulldisplay?docid=alma991001706259704781&context=L&vid=44MUN_INST:hendon&lang=en&adaptor=Local%20Search%20Engine&tab=Everything',
                imageUrl: 'novelbook2.jpeg'
            },

            {
                title: 'Thesis projects : a guide for students in computer science and information systems',
                url: 'https://mdx.primo.exlibrisgroup.com/discovery/fulldisplay?docid=alma991001498859704781&context=L&vid=44MUN_INST:hendon&lang=en&adaptor=Local%20Search%20Engine&tab=Everything',
                imageUrl: 'ug1.jpeg'
            },

            {
                title: 'How to research',
                url: 'https://mdx.primo.exlibrisgroup.com/discovery/fulldisplay?docid=alma991001699439704781&context=L&vid=44MUN_INST:hendon&lang=en&adaptor=Local%20Search%20Engine&tab=Everything',
                imageUrl: 'ug2.jpeg'
            }
        ];
        
        displaySearchResults(searchResults);
    }
    
    
    function displaySearchResults(searchResults) {
        let resultsContainer = document.createElement('div');
        resultsContainer.classList.add('message', 'assistant');
    
        let booksLabel = document.createElement('div');
        booksLabel.innerHTML = "<strong>Books available:</strong>";
        resultsContainer.appendChild(booksLabel);
    
        let resultsList = document.createElement('ul');
        searchResults.forEach((result, index) => {
            let resultItem = document.createElement('li');
            resultItem.classList.add('search-result-item');
            // Assign an ID here using the index
            resultItem.id = `result-${index + 1}`; // This will create IDs like "result-1", "result-2", etc.
    
            let image = document.createElement('img');
            image.src = result.imageUrl; // Use the image URL from the result
            image.alt = result.title;
            image.classList.add('book-image');
    
            let titleSpan = document.createElement('span');
            titleSpan.textContent = `${index + 1}) ${result.title}`;
    
            let linkAnchor = document.createElement('a');
            linkAnchor.href = result.url;
            linkAnchor.textContent = 'Open Link';
            linkAnchor.target = '_blank';
            linkAnchor.classList.add('book-link');
    
            // Add a data attribute to store the URL which will be used in openSearchResultLink
            resultItem.setAttribute('data-url', result.url);
    
            resultItem.appendChild(image);
            resultItem.appendChild(titleSpan);
            resultItem.appendChild(linkAnchor);
            resultsList.appendChild(resultItem);
        });
    
        resultsContainer.appendChild(resultsList);
        let chatWindow = document.getElementById('chat-window');
        chatWindow.appendChild(resultsContainer);
    
        scrollChatToBottom();
    }
    
    
    // Open the links for the reading materials 
    function openSearchResultLink(number) {
        // Access the corresponding search result item by ID
        const resultItem = document.getElementById(`result-${number}`);
        if (resultItem) {
            const url = resultItem.getAttribute('data-url'); // Get the URL stored in the data attribute
            if (url) {
                window.open(url, '_blank'); // Open the URL in a new tab/window
                speakAndShow(`Opening link number ${number}.`);
            }
        } else {
            speakAndShow(`I couldn't find link number ${number}.`);
        }
    }
       

    // Function to display search results from Google Books API
    function displayGoogleBooksResults(books) {

        // Iterate over each book object in the array
        books.forEach((book, index) => {
            const bookDiv = document.createElement('div');
            bookDiv.classList.add('search-result');
            
            // Check if there is an image URL and create an img element if there is
            if (book.image) {
                const imageDiv = document.createElement('img');
                imageDiv.src = book.image;
                imageDiv.alt = "Book cover";
                imageDiv.style.width = '100px'; 
                imageDiv.style.height = 'auto';
                imageDiv.style.marginRight = '10px'; 
                bookDiv.appendChild(imageDiv);
            }
            
            // Create a div for the book title and set its text
            const titleDiv = document.createElement('div');
            titleDiv.classList.add('search-result-title');
            titleDiv.textContent = book.title;
            
            // Create a div for the authors and set its text
            const authorsDiv = document.createElement('div');
            authorsDiv.classList.add('search-result-details');
            authorsDiv.textContent = `By: ${book.authors}`;
            
            // Create an anchor element for the 'More Info' link
            const linkDiv = document.createElement('a');
            linkDiv.href = book.link;
            linkDiv.textContent = 'More Info';
            linkDiv.target = '_blank';
    
            // Append title, authors, and link elements to the book div
            bookDiv.appendChild(titleDiv);
            bookDiv.appendChild(authorsDiv);
            bookDiv.appendChild(linkDiv);
            
            // Append each book result directly to the chat window
            chatWindow.appendChild(bookDiv);
        });
        scrollChatToBottom();
    }
    

    // Function to get a response from GPT based on the user's message
    function getGptResponse(userInput) {
        const apiUrl = `http://localhost:8080/getGptResponse?userInput=${encodeURIComponent(userInput)}`;
        
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                console.log("Received data from API:", data);
                // If 'data' is an object containing a 'text' property, access it directly
                const message = data.text || "Response was not in expected format.";
                speakAndShow(message);
            })
            .catch(error => console.error('Error fetching GPT response:', error));
    }
    


    // Function to fetch books from the Google Books API based on a search term
    function fetchGoogleBooks(searchTerm) {
        const apiKey = 'AIzaSyBkCWwJhEr20fGu4KCCNTZtvH8wlEYfQDE'; 
        const googleBooksApiUrl = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(searchTerm)}&key=${apiKey}`;

        // Fetch the book data from Google Books API
        fetch(googleBooksApiUrl)
            .then(response => response.json())
            .then(data => {
                const books = data.items.map(book => ({
                    title: book.volumeInfo.title,
                    authors: book.volumeInfo.authors ? book.volumeInfo.authors.join(', ') : 'Author information unavailable',
                    description: book.volumeInfo.description ? book.volumeInfo.description : 'No description available',
                    link: book.volumeInfo.infoLink,
                    image: book.volumeInfo.imageLinks ? book.volumeInfo.imageLinks.thumbnail : '' 
                }));
                
                displayGoogleBooksResults(books);
            })
            .catch(error => console.error('Error fetching books from Google:', error));
    }
    

    // Function to scroll the chat window to the bottom
    function scrollChatToBottom() {
        let chatWindow = document.getElementById('chat-window');
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }
    

    recognition.start();
});
