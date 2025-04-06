# Fresh Recipe

This project is a recipe application built with React and TypeScript.

## How to Use

1. Clone the repository to your local machine.
2. Install the dependencies using `npm install`.
3. Start the development server using `npm run dev`.
4. Open your browser and navigate to `http://localhost:5173`.

## API Configuration

This application requires an API to function.

1. Create a `.env` file in the root directory of the project.
2. Add the following environment variables to the `.env` file:

    ```
    VITE_OPENROUTER_API_KEY=your_openrouter_api_key
    ```

3. Replace `your_openrouter_api_key` with your actual OpenRouter API key.
4. # Fresh Recipe AI Project Documentation

## Project Overview
Fresh Recipe AI is a web application that uses artificial intelligence to analyze food images and generate recipes. The application allows users to upload food images, which are then analyzed to identify the dish, list ingredients, and provide step-by-step cooking instructions.

## Technical Stack

### Frontend
- **Framework**: React with TypeScript
- **UI Library**: Material UI (MUI)
- **Build Tool**: Vite
- **State Management**: React Hooks (useState)

### Backend
- **API Integration**: OpenRouter API
- **AI Model**: Google's Gemini Pro Vision (accessed through OpenRouter)
- **Image Processing**: Client-side image conversion to base64

## Setup and Installation

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation Steps
1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```
   cd fresh-recipe
   ```

3. Install dependencies:
   ```
   npm install
   ```

4. Start the development server:
   ```
   npm run dev
   ```

5. Access the application:
   Open your browser and go to `http://localhost:5173` (or whatever port Vite is using)

## API Usage and Limits

### OpenRouter API
- **API Key**: The project uses an OpenRouter API key
- **Request Limits**: 
  - OpenRouter has usage limits based on your account tier
  - Free tier typically includes a limited number of requests per day
  - You can check your current usage and limits in your OpenRouter dashboard

### Model Usage
- **Model**: `google/gemini-pro-vision`
- **Cost**: Each request to the Gemini Pro Vision model has an associated cost
- **Token Limits**: The application is configured to use up to 1000 tokens per response

## Project Features

1. **Image Upload**: Users can upload food images through a drag-and-drop interface
2. **Image Analysis**: The application sends the image to the AI model for analysis
3. **Recipe Generation**: Based on the image analysis, the AI generates:
   - Food name identification
   - List of ingredients
   - Step-by-step recipe instructions
4. **Responsive UI**: The interface is designed to work on both desktop and mobile devices

## Technical Implementation

1. **Image Processing**:
   - Images are converted to base64 format for API transmission
   - The application handles various image formats (JPEG, PNG, etc.)

2. **API Integration**:
   - The application communicates with OpenRouter's API endpoint
   - Proper headers are set for authentication and identification
   - Error handling is implemented for API failures

3. **Response Parsing**:
   - The AI's response is parsed using regular expressions
   - The application extracts food name, ingredients, and recipe steps
   - Results are displayed in a structured format

## Troubleshooting

### Common Issues

1. **API Errors**:
   - Check the console for detailed error messages from the OpenRouter API
   - Verify that your API key is valid and has sufficient credits
   - Ensure the image format is supported by the API

2. **Image Upload Issues**:
   - Ensure the image is in a supported format (JPEG, PNG, etc.)
   - Check that the image size is not too large (recommended under 5MB)
   - Verify that the image contains food items that are clearly visible

3. **Parsing Errors**:
   - If the AI response format changes, you may need to update the parsing logic
   - Check the console logs to see the raw response from the API

### Error Messages

- **"Please select an image first"**: No image has been uploaded before clicking the analyze button
- **"Could not identify the food name"**: The AI couldn't determine what food is in the image
- **"Could not identify the ingredients"**: The AI couldn't list the ingredients in the dish
- **"Could not generate the recipe"**: The AI couldn't create a recipe for the identified dish
- **"Failed to analyze image"**: A general error occurred during the API call or response processing

## Potential Improvements

1. **Backend Integration**: 
   - Create a backend service to handle API calls and protect your API key
   - Implement rate limiting and caching to optimize API usage

2. **Image Optimization**: 
   - Add image compression before sending to the API
   - Implement client-side image cropping to focus on the food item

3. **User Experience**: 
   - Add a loading indicator during image analysis
   - Implement a history feature to save previous analyses
   - Add the ability to edit generated recipes

4. **Advanced Features**: 
   - Implement user accounts for personalized recipe collections
   - Add recipe sharing via email or social media
   - Integrate with grocery delivery services to order ingredients

## Project Structure

```
fresh-recipe/
├── node_modules/
├── public/
├── src/
│   ├── App.tsx           # Main application component
│   ├── main.tsx          # Application entry point
│   └── ...
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Development Workflow

1. **Making Changes**:
   - Edit the source files in the `src` directory
   - The development server will automatically reload with your changes

2. **Testing**:
   - Test the application by uploading various food images
   - Check the console for any errors or warnings
   - Verify that the recipe generation works as expected

3. **Deployment**:
   - Build the application for production:
     ```
     npm run build
     ```
   - Deploy the contents of the `dist` directory to your hosting service

## API Documentation

### OpenRouter API

The application uses the OpenRouter API to access the Gemini Pro Vision model. The API endpoint is:

```
https://openrouter.ai/api/v1/chat/completions
```

Required headers:
- `Content-Type: application/json`
- `Authorization: Bearer YOUR_API_KEY`
- `HTTP-Referer: YOUR_APP_URL`
- `X-Title: Fresh Recipe AI`

Request body:
```json
{
  "model": "google/gemini-pro-vision",
  "messages": [
    {
      "role": "user",
      "content": [
        { "type": "text", "text": "Your prompt here" },
        {
          "type": "image_url",
          "image_url": {
            "url": "data:image/jpeg;base64,YOUR_BASE64_IMAGE"
          }
        }
      ]
    }
  ],
  "max_tokens": 1000
}
```

Response format:
```json
{
  "choices": [
    {
      "message": {
        "content": "AI response text here"
      }
    }
  ]
}
```

## Conclusion

Fresh Recipe AI demonstrates the power of combining modern web technologies with advanced AI models to create practical applications. By leveraging the Gemini Pro Vision model through OpenRouter, the application can analyze food images and generate detailed recipes, helping users discover new dishes and cooking techniques.

The project showcases how AI can be integrated into everyday applications to provide valuable insights and information based on visual input, opening up possibilities for various other applications in the food and cooking domain. 
