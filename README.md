**Project Documentation**

Project Overview

This project is a full-stack application that allows users to input a list of URLs, fetch metadata (title, description, and image) for each URL, and display the results on the front-end. The project is built using React for the front-end and Node.js with Express for the back-end. The application includes security features such as rate limiting, CSRF protection, and XSS prevention.
Table of Contents

    Getting Started
        Prerequisites
        Installation
        Environment Variables
    Running the Application
        Back-End
        Front-End
	Using the Deployed React App
    Testing
    Design Choices
        Architecture
        Security Considerations
        Performance Considerations
    Trade-offs
    Future Improvements
	
**1. Getting Started**

Prerequisites

Before you begin, ensure you have the following installed on your machine:

    Node.js (v14 or higher)
    npm (Node Package Manager, comes with Node.js)
    Docker (for containerized environments, optional)

Installation

1.Clone the repository:	

  git clone https://github.com/galsherm/url-metadata-fetcher
  
	cd url-metadata-fetcher
	
2.Install dependencies:

For both front-end and back-end, run:

Back-End
	
	cd src/back-end
	npm install
	
Front-End	
	
	cd src/front-end
	npm install

Environment Variables

Create a .env file in the root of your project and define the following environment variables:

Back-End

ALLOWED_ORIGIN=http://your-frontend-domain.com


Front-End	

REACT_APP_SERVER_URL="Server Url"

REACT_APP_FETCH_METADATA_PATH=/fetch-metadata

REACT_APP_CSRF_TOKEN_PATH=/csrf-token
	
**2. Running the Application**

Back-End

    Start the back-end server:

	cd	src/back-end
	npm start
	
	This will start the Node.js server on the specified port (default is 5000).
	
Front-End	

	Start the React application:
	
	cd	src/front-end
	npm start
	
	This will start the front-end React application on the default port 3000.
	
	Access the Application:
Open your web browser and navigate to http://localhost:3000 to use the application

Using the Deployed React App


If you prefer to use the deployed React application while running the server locally, you can access it via the following URL:

    Deployed React App URL: https://url-metadata-fetcher-3441.vercel.app

To use this, ensure your local back-end server is running, and the REACT_APP_SERVER_URL environment variable is set to point to your local server (e.g., http://localhost:5000).

Access the Application:

Open your web browser and navigate to the deployed React app URL above to use the application.


**3. Testing**

To run tests, use the following commands:

    Back-End Tests:
	
	cd back-end
	npm test
	
	Front-End Tests:
 
	cd front-end
	npm test

**4. Design Choices**

Architecture

The application follows a microservices-inspired architecture, with a clear separation between the front-end and back-end components:

    Front-End: React is used for the UI, providing a responsive interface for users to input URLs and view metadata.
    Back-End: Node.js with Express handles API requests, fetches metadata from the URLs, and implements security features like CSRF protection.
	
	Security Considerations

In this project, several security measures have been implemented to ensure the safety and integrity of the application:

    Rate Limiting: The /fetch-metadata route is protected by rate limiting, which restricts the number of requests an IP address can make within a specified time window. This helps prevent abuse, such as denial-of-service attacks, and protects the server from being overwhelmed by excessive requests.

    Cross-Origin Resource Sharing (CORS): CORS is configured to restrict which domains can interact with the back-end API. By setting the ALLOWED_ORIGIN environment variable, only requests coming from the specified front-end domain (e.g., http://your-frontend-domain.com) are permitted. This prevents unauthorized websites from accessing your API, mitigating risks like Cross-Site Request Forgery (CSRF) and other unauthorized interactions.

    CSRF Protection: The application uses CSRF protection to ensure that requests to sensitive routes, like /fetch-metadata, are legitimate. CSRF tokens are issued to clients and must be included in requests to protected endpoints, reducing the risk of unauthorized actions being performed on behalf of an authenticated user.

    XSS Prevention: User inputs, specifically URLs submitted to the application, are sanitized using the xss library. This prevents cross-site scripting (XSS) attacks, where malicious scripts could be injected into the application and executed in the context of another user's session.

Performance Considerations

    Asynchronous Operations: The application uses async/await for handling API requests, allowing non-blocking operations and improving responsiveness.
	
	Minimized Data Processing: The backend processes only the necessary data for each URL and sanitizes inputs before further processing. This minimizes the amount of data handled and reduces the potential overhead, contributing to more efficient processing and response times.
	
 **5.Trade-offs**

    Complexity vs. Security: Implementing CSRF protection adds complexity to the project, but it significantly enhances security. This was a necessary trade-off to ensure the application is secure in production environments.
    Front-End Validation: Minimal front-end validation was implemented, relying instead on back-end validation to simplify the front-end code. This reduces redundancy but may lead to a slightly slower user experience.

  **6.Future Improvements**

    Caching: Implement a caching layer (e.g., Redis) to store and serve metadata for URLs that have already been fetched recently.
    Pagination: Add pagination support for displaying a large number of URLs and their metadata on the front-end.
    Expanded Metadata Fetching: Enhance the metadata fetching logic to support additional metadata tags, improving the richness of the displayed information.
