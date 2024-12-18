# Ceasar CRM (ceasar.frim.io)

Branded as ‘The #1 CRM Choice for Startup Ventures,’ Ceasar CRM is a comprehensive customer relationship management (CRM) system designed to enhance and streamline customer interactions.

## Requirements

- **Use the latest stable versions of Node.js, Express.js, and Angular.** Ensure compatibility with current features and libraries.
- **Backend Dependencies:** Body-Parser, CORS, dotenv
- **Frontend Dependencies:** Angular, Auth0
- **Database:** PostgreSQL (latest version)
- **Deployment:** Render Cloud Application Hosting (Static Sites and Web Services)

## Installation

### Backend Installation

1. **Navigate to the backend directory:**

    ```bash
    cd server
    ```

2. **Initialize the Node.js project (if not already done):**

    ```bash
    npm init -y
    ```

3. **Install the required backend dependencies:**

    ```bash
    npm install express body-parser cors dotenv
    ```

4. **Install `nodemon` for development:**

    ```bash
    npm install --save-dev nodemon
    ```

5. **Update `package.json` to use `nodemon` for running the server:**

    Edit the `scripts` section of `package.json` to include:

    ```json
    "scripts": {
      "start": "node src/index.js",
      "dev": "nodemon src/index.js"
    }
    ```

    - `start` will run the production server.
    - `dev` will use `nodemon` to watch for changes and automatically restart the server during development.

6. **Create a `.env` file for environment variables (e.g., database connection strings, Auth0 secrets):**

    ```bash
    touch .env
    ```

### Frontend Installation

1. **Navigate to the frontend directory:**

    ```bash
    cd client
    ```

2. **Create a new Angular project (if not already done) using Angular CLI:**

    ```bash
    ng new .
    ```

3. **Install the required frontend dependencies:**

    ```bash
    npm install @auth0/auth0-angular @angular/router @angular/forms @angular/common @angular/core
    ```

4. **Configure Angular for Auth0:**

    - Set up the Auth0 configuration in `src/app/app.module.ts`:

        ```typescript
        import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
        import { NgModule } from '@angular/core';
        import { RouterModule } from '@angular/router';
        import { ReactiveFormsModule, FormsModule } from '@angular/forms';
        import { AuthModule } from '@auth0/auth0-angular';

        @NgModule({
          declarations: [ /* Your components here */ ],
          imports: [
            HttpClientModule,
            FormsModule,
            ReactiveFormsModule,
            RouterModule.forRoot([
              // Your routes here
            ]),
            AuthModule.forRoot({
              domain: '<YOUR_AUTH0_DOMAIN>',
              clientId: '<YOUR_AUTH0_CLIENT_ID>',
            }),
            // Other Angular modules you need
          ],
          providers: [ /* Your services here */ ],
          bootstrap: [ /* Your root component here */ ]
        })
        export class AppModule { }
        ```

## Running the Application

- **Start the backend server:**

    For development:

    ```bash
    npm run dev
    ```

    For production:

    ```bash
    npm start
    ```

- **Start the frontend development server:**

    ```bash
    ng serve
    ```

    This will launch the Angular app in development mode, typically accessible at `http://localhost:4200`.

## Deployment

- **Backend Deployment:** Deploy the backend to Render Cloud or other cloud platforms. Ensure that the production environment variables are correctly set.

- **Frontend Deployment:** Deploy the Angular application as a static site to Render Cloud or other hosting services. Make sure to configure environment variables and API base URLs appropriately for production.

## Contribution

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

This project is proprietary to Frim Technologies and is intended for internal use only. Unauthorized use, distribution, or duplication is prohibited.

Copyright © 2024 Frim, Inc. All Rights Reserved. Ceasar™ is a product developed and owned by Frim, Inc.

## Public Documentation

For public documentation, please visit [frim.io/docs](https://frim.io/docs).

## Contact

For inquiries, please contact us at [frim.io/contact](https://frim.io/contact).