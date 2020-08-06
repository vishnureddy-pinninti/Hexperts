const graph = require('@microsoft/microsoft-graph-client');
const axios = require('axios');

const authService = (function() {
    let token;
    let loggedinUser;

    const getAuthenticatedClient = () => {
        // Initialize Graph client
        const client = graph.Client.init({
        // Use the provided access token to authenticate
        // requests
            authProvider: (done) => {
                done(null, token);
            },
        });

        return client;
    };

    return {
        getUserDetails: async(accessToken) => {
            token = accessToken.accessToken;
            const client = getAuthenticatedClient();
            const user = await client.api('/me?$select=displayName,mail,jobTitle,id,department,employeeId,officeLocation,city,companyName,country,postalCode,state,streetAddress,businessPhones,mobilePhone').get();
            loggedinUser = user;
            return user;
        },
        getImage: async(user = loggedinUser.userPrincipalName) => {
            try {
                const response = await axios(`https://graph.microsoft.com/v1.0/users/${user}/photo/$value`, {
                    headers: { Authorization: `Bearer ${token}` },
                    responseType: 'arraybuffer',
                });
                const avatar = new Buffer(response.data, 'binary').toString('base64');
                return `data:image/png;base64,${avatar}`;
            }
            catch (e) {
                return null;
            }
        },
    };
}());

export {
    authService,
};