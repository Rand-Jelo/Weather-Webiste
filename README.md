# Weather Finder

Weather Finder is an interactive web application that provides current weather conditions, an hourly weather forecast, and clothing advice based on the forecasted temperature and weather conditions. The application features a responsive design, ensuring an optimal user experience across mobile, tablet, and desktop devices.

![Responsive Design Preview](assets/readme-images/am-i-responsive.png)

[View the project here](https://rand-jelo.github.io/Weather-Webiste/)

---

## User Experience (UX)

The Weather Finder application aims to deliver accurate weather information and practical advice to users in a simple and user-friendly manner.

### User Stories

- **First-time visitors**
  - Understand the app's purpose and functionality immediately.
  - Quickly access current weather data for their location.
  - Explore the hourly forecast in a visually appealing layout.
  - Receive clothing advice tailored to weather conditions.

- **Returning visitors**
  - Check updated weather information for their location.
  - View changes in the hourly forecast.
  - Use the clothing advice feature regularly.

- **Frequent users**
  - Rely on the app for daily weather updates.
  - Share the application with friends or colleagues seeking similar functionality.

---

## Design

- **Color Scheme**: The app uses a combination of deep purple (#4B0082) and white, providing a clean, modern look.
- **Typography**: Simple, readable fonts are used to ensure clarity.
- **Wireframes**: Wireframes for this project were created using Balsamiq.

    ![Wireframes](assets/readme-images/wireframes.png)


---

## Features

### Existing Features

1. **Header and Logo**
   - Displays the application title and logo prominently at the top of the page.

      ![Header and logo](assets/readme-images/header.png)

2. **Weather Card**
   - Displays the current weather, including temperature, conditions, and an icon representing the weather type.
   - Provides an hourly weather forecast with a scrollable layout.

      ![Weather Card](assets/readme-images/weather-card.png)

3. **Hourly Forecast Toggle**
   - Allows users to toggle between "Today's Highlights" and "Hourly Forecast."
   - Highlights key times (e.g., morning, noon, evening) for easier comprehension.

      ![Today's Weather](assets/readme-images/todays-weather.png)

      ![Hourly Weather](assets/readme-images/hourly-weather.png)

4. **Clothing Advice Form**
   - A form where users can input a specific hour to receive clothing advice based on the temperature and weather conditions.

      ![Advice Form](assets/readme-images/advice-form.png)

5. **Footer**
   - Provides links to social media accounts and serves as a closing element for the page.

     ![Footer](assets/readme-images/footer.png)

---

## Features Left to Implement

1. **Weekly Forecast**
   - Expand the application to include a 7-day weather forecast.
2. **Location Search**
   - Add functionality to search for weather information for other locations.
3. **Customizable Themes**
   - Enable users to switch between light and dark modes or select custom color schemes.

---

## Technologies Used

- **HTML5**: For structuring the content.
- **CSS3**: For styling and responsive design.
- **JavaScript (ES6)**: For fetching weather data and dynamic interaction.
- **OpenWeatherMap API**: For real-time weather data.

---

## Frameworks, Libraries & Programs Used

- **Font Awesome**: For weather and social media icons.
- **Git & GitHub**: For version control and deployment.
- **VS Code**: For coding and debugging.
- **Am I Responsive**: To validate the responsiveness of the website.
- **Balsamiq**: Used to create wireframes for layout planning.

---

## Testing

### Validation Results

- **HTML**: Validated using the [W3C Markup Validator](https://validator.w3.org/).
- **CSS**: Validated using the [W3C CSS Validator](https://jigsaw.w3.org/css-validator/).

<details>
<summary>index.html
</summary>

![HTML validation result](/assets/readme-images/html-validation.png)
</details>

<details>
<summary>style.css
</summary>

![CSS validation result](/assets/readme-images/css-validation.png)
</details>

### Manual Testing

- **Functionality Testing**
  - Tested the geolocation feature to fetch weather data for the user’s current location.
  - Verified the functionality of the toggle button between "Today's Highlights" and "Hourly Forecast."
  - Checked the clothing advice form for input validation and output accuracy.

- **Responsiveness Testing**
  - Ensured proper alignment and scaling of elements on mobile, tablet, and desktop devices.
  - Verified that scrollable hourly forecast works as expected on larger screens.

- **Navigation Testing**
  - Confirmed that all buttons and links function correctly.

### Lighthouse Report

#### Desktop
<details>
<summary>Desktop report
</summary>

![Desktop lighthouse report](/assets/readme-images/lighthouse-desktop.png)
</details>

#### Mobile
<details>
<summary>Mobile report
</summary>

![Mobile lighthouse report](/assets/readme-images/lighthouse-mobile.png)
</details>

---