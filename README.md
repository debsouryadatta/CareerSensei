### Steps for implementing auth0 okta
1. Create a new Single Page Application in Auth0
2. Add the auth provider in the providers.tsx & wrap the layout children with the provider
3. Provide the domain, clientId, redirectUri, audience from the .env
4. Create a "/callback" page so that after the user logs in, they are redirected to this page
5. In the callback page, create a register user func which will call the backend register endpoint
6. The backend register endpoint will return user_data if user exists or register the user and return the user_data if not exists
7. In the backend, create a validate_token middleware func which will validate the token before hitting the secured endpoints


### Features Done
- upload resume, job search routes ✅
- find job by filters routes ✅
- save jobs to db ✅
- auth0 okta integration ✅