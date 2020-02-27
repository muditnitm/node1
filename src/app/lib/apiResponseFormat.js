

module.exports = {
    setResponse: (response, data) => {
        const { body, status } = data;
        response.status(status).send(body);
    },
    response_200: body => ({ status: 200, body: { success: true, message: body } }),

    response_401: error => ({ status: 401, body: { success: false, message: error } }),

    response_404: error => ({ status: 404, body: { success: false, message: error } }),

    response_500: (message, error) => ({ status: 500, body: { success: false, message, error } }),

    response_400: (message, error) => ({ status: 500, body: { success: false, message, error } }),
}


