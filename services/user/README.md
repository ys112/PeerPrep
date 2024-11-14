# User Service

## Development Instructions

Unless otherwise specified, commands should be run in the service root.

### Running the service (development)

1. Run `pnpm dev` to run the dev script.
1. Open your browser at <http://localhost:3002>.

## Documentation

### Environment variables

`.env`:

- `PORT` (optional): Port to run the service on.
- `CORS_ORIGINS` (optional): Allow list for CORS, as parseable JSON.
- `GOOGLE_APPLICATION_CREDENTIALS`: Path to the service account credentials file for Firestore.
- `COLLECTION_NAME` (optional): Name of the collection to use in Firestore.
- `JWT_SECRET_PATH`: Path to the file containing the JWT secret.

`.env.development.local` (**secret**):

- `ADMIN_USERNAME` (optional): Admin account username for the `create-admin` script.
- `ADMIN_EMAIL` (optional): Admin account email for the `create-admin` script.
- `ADMIN_PASSWORD` (optional): Admin account password for the `create-admin` script.

### Database client

- The database client is defined in `./src/db/clients.ts`. It connects to Google Cloud Datastore (Firestore).
- Connecting to Firestore requires service account credentials file. The path to the file must be set in the environment variable `GOOGLE_APPLICATION_CREDENTIALS`.
- The client looks for the `COLLECTION_NAME` environment variable to determine the collection name to use in Firestore.

### API

#### Create User

- This endpoint allows adding a new user to the database (i.e., user registration).

- HTTP Method: `POST`

- Endpoint: http://localhost:3002/users

- Body
  - Required: `username` (string), `email` (string), `password` (string)

    ```json
    {
      "username": "SampleUserName",
      "email": "sample@gmail.com",
      "password": "SecurePassword"
    }
    ```

- Responses:

    | Response Code               | Explanation                                           |
    |-----------------------------|-------------------------------------------------------|
    | 201 (Created)               | User created successfully, created user data returned |
    | 400 (Bad Request)           | Missing fields                                        |
    | 409 (Conflict)              | Duplicate username or email encountered               |
    | 500 (Internal Server Error) | Database or server error                              |

#### Get User

- This endpoint allows retrieval of a single user's data from the database using the user's ID. Note that password hash is not returned.

- HTTP Method: `GET`

- Endpoint: http://localhost:3002/users/{userId}

- Parameters
    - Required: `userId` path parameter
    - Example: `http://localhost:3002/users/60c72b2f9b1d4c3a2e5f8b4c`

- <a name="auth-header">Headers</a>

    - Required: `Authorization: Bearer <JWT_ACCESS_TOKEN>`

    - Explanation: This endpoint requires the client to include a JWT (JSON Web Token) in the HTTP request header for authentication and authorization. This token is generated during the authentication process (i.e., login) and contains information about the user's identity. The server verifies this token to ensure that the client is authorized to access the data.

    - Auth Rules:

        - Admin users: Can retrieve any user's data. The server verifies the user associated with the JWT token is an admin user and allows access to the requested user's data.

        - Non-admin users: Can only retrieve their own data. The server checks if the user ID in the request URL matches the ID of the user associated with the JWT token. If it matches, the server returns the user's own data.

- Responses:

    | Response Code               | Explanation                                              |
    |-----------------------------|----------------------------------------------------------|
    | 200 (OK)                    | Success, user data returned                              |
    | 401 (Unauthorized)          | Access denied due to missing/invalid/expired JWT         |
    | 403 (Forbidden)             | Access denied for non-admin users accessing others' data |
    | 404 (Not Found)             | User with the specified ID not found                     |
    | 500 (Internal Server Error) | Database or server error                                 |

#### Get All Users

- This endpoint allows retrieval of all users' data from the database. Note that password hash is not returned.
- HTTP Method: `GET`
- Endpoint: http://localhost:3002/users
- Headers
    - Required: `Authorization: Bearer <JWT_ACCESS_TOKEN>`
    - Auth Rules:

        - Admin users: Can retrieve all users' data. The server verifies the user associated with the JWT token is an admin user and allows access to all users' data.

        - Non-admin users: Not allowed access.

- Responses:

    | Response Code               | Explanation                                      |
    |-----------------------------|--------------------------------------------------|
    | 200 (OK)                    | Success, all user data returned                  |
    | 401 (Unauthorized)          | Access denied due to missing/invalid/expired JWT |
    | 403 (Forbidden)             | Access denied for non-admin users                |
    | 500 (Internal Server Error) | Database or server error                         |

#### Update User

- This endpoint allows updating a user and their related data in the database using the user's ID.

- HTTP Method: `PATCH`

- Endpoint: http://localhost:3002/users/{userId}

- Parameters
  - Required: `userId` path parameter

- Body
  - At least one of the following fields is required: `username` (string), `email` (string), `password` (string)

    ```json
    {
      "username": "SampleUserName",
      "email": "sample@gmail.com",
      "password": "SecurePassword"
    }
    ```

- Headers
    - Required: `Authorization: Bearer <JWT_ACCESS_TOKEN>`
    - Auth Rules:

        - Admin users: Can update any user's data. The server verifies the user associated with the JWT token is an admin user and allows the update of requested user's data.

        - Non-admin users: Can only update their own data. The server checks if the user ID in the request URL matches the ID of the user associated with the JWT token. If it matches, the server updates the user's own data.

- Responses:

    | Response Code               | Explanation                                             |
    |-----------------------------|---------------------------------------------------------|
    | 200 (OK)                    | User updated successfully, updated user data returned   |
    | 400 (Bad Request)           | Missing fields                                          |
    | 401 (Unauthorized)          | Access denied due to missing/invalid/expired JWT        |
    | 403 (Forbidden)             | Access denied for non-admin users updating others' data |
    | 404 (Not Found)             | User with the specified ID not found                    |
    | 409 (Conflict)              | Duplicate username or email encountered                 |
    | 500 (Internal Server Error) | Database or server error                                |

#### Update User Privilege

- This endpoint allows updating a user’s privilege, i.e., promoting or demoting them from admin status.

- HTTP Method: `PATCH`

- Endpoint: http://localhost:3002/users/{userId}

- Parameters
  - Required: `userId` path parameter

- Body
  - Required: `isAdmin` (boolean)

    ```json
    {
      "isAdmin": true
    }
    ```

- Headers
    - Required: `Authorization: Bearer <JWT_ACCESS_TOKEN>`
    - Auth Rules:

        - Admin users: Can update any user's privilege. The server verifies the user associated with the JWT token is an admin user and allows the privilege update.
        - Non-admin users: Not allowed access.

- Responses:

    | Response Code               | Explanation                                                     |
    |-----------------------------|-----------------------------------------------------------------|
    | 200 (OK)                    | User privilege updated successfully, updated user data returned |
    | 400 (Bad Request)           | Missing fields                                                  |
    | 401 (Unauthorized)          | Access denied due to missing/invalid/expired JWT                |
    | 403 (Forbidden)             | Access denied for non-admin users                               |
    | 404 (Not Found)             | User with the specified ID not found                            |
    | 500 (Internal Server Error) | Database or server error                                        |

#### Delete User

- This endpoint allows deletion of a user and their related data from the database using the user's ID.
- HTTP Method: `DELETE`
- Endpoint: http://localhost:3002/users/{userId}
- Parameters

  - Required: `userId` path parameter
- Headers

  - Required: `Authorization: Bearer <JWT_ACCESS_TOKEN>`

  - Auth Rules:

    - Admin users: Can delete any user's data. The server verifies the user associated with the JWT token is an admin user and allows the deletion of requested user's data.

    - Non-admin users: Can only delete their own data. The server checks if the user ID in the request URL matches the ID of the user associated with the JWT token. If it matches, the server deletes the user's own data.
- Responses:

    | Response Code               | Explanation                                             |
    |-----------------------------|---------------------------------------------------------|
    | 200 (OK)                    | User deleted successfully                               |
    | 401 (Unauthorized)          | Access denied due to missing/invalid/expired JWT        |
    | 403 (Forbidden)             | Access denied for non-admin users deleting others' data |
    | 404 (Not Found)             | User with the specified ID not found                    |
    | 500 (Internal Server Error) | Database or server error                                |

#### Login

- This endpoint allows a user to authenticate with an email and password and returns a JWT access token. The token is valid for 1 day and can be used subsequently to access protected resources. For example usage, refer to the [Authorization header section in the Get User endpoint](#auth-header).
- HTTP Method: `POST`
- Endpoint: http://localhost:3002/auth/login
- Body
  - Required: `email` (string), `password` (string)

    ```json
    {
      "email": "sample@gmail.com",
      "password": "SecurePassword"
    }
    ```

- Responses:

    | Response Code               | Explanation                                        |
    |-----------------------------|----------------------------------------------------|
    | 200 (OK)                    | Login successful, JWT token and user data returned |
    | 400 (Bad Request)           | Missing fields                                     |
    | 401 (Unauthorized)          | Incorrect email or password                        |
    | 500 (Internal Server Error) | Database or server error                           |

#### Verify Token

- This endpoint allows one to verify a JWT access token to authenticate and retrieve the user's data associated with the token.
- HTTP Method: `GET`
- Endpoint: http://localhost:3002/auth/verify-token
- Headers
  - Required: `Authorization: Bearer <JWT_ACCESS_TOKEN>`

- Responses:

    | Response Code               | Explanation                                        |
    |-----------------------------|----------------------------------------------------|
    | 200 (OK)                    | Token verified, authenticated user's data returned |
    | 401 (Unauthorized)          | Missing/invalid/expired JWT                        |
    | 500 (Internal Server Error) | Database or server error                           |
