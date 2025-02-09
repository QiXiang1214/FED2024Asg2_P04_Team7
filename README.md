# FED2024Asg2_P04_Team7

## Your Project's Name : MokeSell
**MokeSell** is an innovative web application designed to offer users a seamlessly integrated experience for managing their profiles, listings,tracking points, and chatting with other users. Our project is built with a focus on both visual appeal and intuitive navigation so that users can effortlessly interact with all of the site's features, whether they're on desktop or mobile. The application is not only aesthetically pleasing but also optimized for performance and responsiveness, ensuring a consistent user experience across all devices.

Our target audience includes tech-savvy individuals, students, and professionals looking for an easy way to manage the sale of their products/pre-loved items and benefit from rewards programs. By providing a simple yet powerful platform, we strive to combine functionality with design to enhance everyday digital interactions.


## Design Process
We started the design process by identifying our target users and understanding their needs and pain points. The central focus was on creating a layout that is both clean and logical. Early wireframes and mockups were created in Figma. Then we watched YouTube videos to learn how implement some of the features as well as how to create our database for the APIs.


### User Stories
- **As a new user**, I want to create an account easily, so that I can start managing my profile and redeem rewards.
- **As an existing user**, I want to update my profile details quickly, so that my account information always stays current.
- **As a reward seeker**, I want to view and track my points in both mobile and desktop views, so that I know how close I am to redeeming a voucher.
- **As a mobile user**, I want an interface that is as clean and centered as the desktop view, so that I can navigate the site without frustration.


## Features
### Existing Features
- **Responsive Design:** The application adapts seamlessly to both desktop and mobile environments, ensuring unified visual alignment.
- **Profile Management:** Users can view and edit their profile details in a cleanly structured card format.
- **Points and Rewards Display:** A streamlined Spin The wheel points system with a centered, responsive layout that scales well on different devices.
- **Interactive Elements:** Easy-to-use buttons and interactive components, enhanced with subtle transitions and hover effects.
- **Interactive Listings:** Easy to view listings and chat with the seller or even create your own listing for your products/pre-loved items.
- **Chat:** A chat page to chat with the seller or any other users online.
- **Feedback** A page where users can identify themselves and write a feedback to the support team.
- **Search & Sort** A feature for users to search and sort all products untill they find their desired item.


### Features Left to Implement
- **Points leaderboard:** A leaderboard to see who has the most points and how they compare to other users.
- **Notifications:** A real-time notification system to update users on chat messages or new listings.
- **Social Sharing:** Integration with social media to allow users to share listings and invite friends.
- **Payment Gateway:** Integration with a payment gateway to allow users to pay for their purchases.


## Technologies Used
- **HTML:** The backbone of the application structure.
- **CSS:** For styling and layout, including responsive design with media queries.
- **JavaScript:** Enhancing user interactions and DOM manipulation and linking with APIs.
- **Firebase:** For storing and retrieving user data and listings as well as to authenticate user registrations and logins. [Firebase](https://firebase.google.com/)
- **Figma:** For designing and prototyping the user interface using wireframes. [Figma](https://www.figma.com)
  - This is a link to the actual figma wireframes we came up with: [Wireframes](https://www.figma.com/design/LmTpQFuMDbwHNzMwMumEZ7/Fed-assignment-2?node-id=0-1&t=F3L5F9ZbpBkSBoDU-1)
- **YouTube:** For learning how to implement some of the features (Firebase, APIs, image sharing/uploading, etc). 
[YouTube](https://www.youtube.com/)
- **LottieFiles:** For the animations during Successful Login and when Add to Cart button is clicked. 
[LottieFiles](https://lottiefiles.com/)


## Assistive AI
During the development of this project, we used ChatGPT for various aspects of the process: [ChatGpt](https://chatgpt.com/)
- **Code Generation:** Mainly used for help related to Firebase and APIs. ChatGPT also assisted with refining CSS for responsive behavior and mobile view optimizations.
- **Design Suggestions:** Provided ideas to enhance layout and user experience across devices for the Chat page and a few other aspects.
- **Problem Solving:** Helped debug and refactor sections of code efficiently.  
- **Example images below:**

![Alt Text](../FED2024Asg2_P04_Team7/image/Screenshot%202025-02-09%20171021.png)

![Alt Text](../FED2024Asg2_P04_Team7/image/Screenshot%202025-02-09%20170947.png)

![Alt Text](../FED2024Asg2_P04_Team7/image/Screenshot%202025-02-09%20170818.png)

![Alt Text](../FED2024Asg2_P04_Team7/image/Screenshot%202025-02-09%20202910.png)

![Alt Text](../FED2024Asg2_P04_Team7/image/Screenshot%202025-02-09%20202959.png)

## Testing
We performed testings to ensure that the application is robust and user-friendly.
- **Manual Testing:**
  - **Profile Edit:**
    - Access the edit profile page.
    - Check if the edited profile details are correctly displayed.
    - Verify that all form fields are visible and correctly aligned on both desktop and mobile.
    - Update profile details and confirm that changes persist.
  - **Point Redemption:**
    - Check if the points are correctly displayed and the new total is correctly calculated.
    - Check the points display for responsiveness.
    - Test the centering and scaling on various screen sizes.
  - **Listings/Products**
    - Check if all listings are clickable and that they expand to a product page.
    - Check if new listings can be created and that they are updated in the HomePage.
    - Check if clicking chat with seller auto fills the seller's name in the chat page search field
    for easier search.
  - **Search/Sort-by**
    - Test the search feature to ensure it filters products based on matching keywords in their name or description.
    - The sort-by should work for high-low and low-high
    - The sort by category should also work appropriately.
- **Known Issues:**
  - Minor alignment glitches on older mobile browsers.
  - Minor lags in chat page as the conversations need to be loaded and timestamps need to be kept track of.
  - Sort-By most Popular does not as there is no way to measure the popularity of an item for now. 
  - Add to Cart does not actually add it to cart as there is no cart feature. It is there for the lottie animation


## Credits
- **Media:** 
  - Logo: [deep ai](https://deepai.org/) used to create the MokeSell Logo.
  - Background: [Background image](https://revistaemprende.cl/aspel-lider-mexicano-de-software-para-mipymes-se-une-a-grupo-siigo-consolidandose-como-lideres-en-america-latina/) taken from this news article.
  - Other icons: [icons](https://www.flaticon.com/) taken from this website.
  - Assume images of Product Listings are from users own device.

