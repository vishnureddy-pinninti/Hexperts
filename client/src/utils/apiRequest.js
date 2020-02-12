const apiRequest = (store) => (next) => (action) => {
    if (!action || !action.makeApiRequest) {
        return next(action);
    }

    const {
        dispatch,
    } = store;
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
    };
    if (config.body) {
        requestObject.method = config.method;
        requestObject.body = JSON.stringify(config.body);
        requestObject.headers = {
            'Content-Type': 'application/json',
        };
    }
    else {
        requestObject.method = config.method;
    }

    return fetch(config.url, requestObject)
        .then((response) => response.json())
    // if (response.status === 201 && config.success) {
    //     dispatch(successHandler(response));
    //     if (config.successcb) {
    //         config.successcb();
    //     }
    // } else {
    //     return response.json()
    // }

        .then((response) => {
            if (config.success) {
                dispatch(successHandler(response));
                if (config.successcb) {
                    config.successcb(response);
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
