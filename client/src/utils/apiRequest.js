const apiRequest = (store) => (next) => (action) => {
    if (!action || !action.makeApiRequest) {
        return next(action);
    }

    const {
        dispatch,
        getState,
    } = store;

    const { user } = getState();

    const config = action.makeApiRequest;
    const successHandler = config.success;

    if (!config.showNoProgress) {
    // dispatch(showProgress());
    }
    const clonedAction = {
        ...action,
    };
    delete clonedAction.makeApiRequest;

    dispatch(clonedAction);

    const requestObject = {
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        redirect: 'follow',
        referrer: 'no-referrer',
        method: config.method,
        headers: {
            userid: user.user.userid,
            _id: user.user._id,
        },
    };

    if (config.body) {
        if (config.file) {
            requestObject.body = config.body;
        }
        else {
            requestObject.body = JSON.stringify(config.body);
            requestObject.headers['Content-Type'] = 'application/json';
        }
    }

    return fetch(config.url, requestObject)
        .then((response) => response.json())
        .then((response) => {
            if (config.success && !response.error) {
                dispatch(successHandler(response));
                if (config.successcb) {
                    config.successcb(response);
                }
            }
            if (response.error) {
                if (config.errorcb) {
                    config.errorcb(response);
                }
            }

            if (!config.showNoProgress) {
                // dispatch(hideProgress());
            }
        })
        .catch(() => {
            // dispatch(failureHandler());
            //   dispatch(hideProgress());
        });
};

export default apiRequest;
