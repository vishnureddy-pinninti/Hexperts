const graph = require('@microsoft/microsoft-graph-client');

const getAuthenticatedClient = (accessToken) => {
    // Initialize Graph client
    const client = graph.Client.init({
    // Use the provided access token to authenticate
    // requests
        authProvider: (done) => {
            done(null, accessToken.accessToken);
        },
    });

    return client;
};

const getUserDetails = async(accessToken) => {
    const client = getAuthenticatedClient(accessToken);

    const user = await client.api('/me').get();
    return user;
};

const getEvents = async(accessToken) => {
    const client = getAuthenticatedClient(accessToken);

    const events = await client
        .api('/me/events')
        .select('subject,organizer,start,end')
        .orderby('createdDateTime DESC')
        .get();

    return events;
};

export {
    getUserDetails, getEvents,
};
