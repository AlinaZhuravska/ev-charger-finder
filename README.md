__Project Topic:__  
__EV Charging Station Explorer with Predictive Modeling__

__Short Description:__  
This project is a web-based system that helps users find electric vehicle (EV) charging stations within a selected area and predicts optimal locations for new stations using machine learning. The platform visualizes nearby stations on an interactive map and supplements missing data using external APIs. When no existing stations are found in a region, the system generates suggestions based on regional traffic density, population data, and infrastructure indicators, offering a data-driven tool for planning EV infrastructure.

__Programs, Services & Tools Used:__

__Frontend:__  
__React__ – for building a dynamic and responsive user interface  
__Tailwind CSS__ – for utility-first styling and layout  
__Leaflet.js__ (via `react-leaflet`) – for rendering interactive maps and location markers  
__Browser Geolocation API__ – for determining the user's current position  

__Backend:__  
__Python + Flask__ – for API routing and server logic  
__SQLite__ – as a lightweight, file-based relational database  
__OpenChargeMap API__ – for retrieving real-world charging station data  
__Overpass API (OpenStreetMap)__ – as an additional source for EV infrastructure data  

__Machine Learning:__  
__scikit-learn__ – for training and deploying a logistic regression model to predict suitable locations for new charging stations  
__joblib__ – for saving and loading the trained model and scaler  
__StandardScaler__ – for feature normalization before model inference  

__Development Tools:__  
__Git & GitHub__ – for version control and collaborative development  
__Postman__ – for testing backend endpoints during development (optional)
