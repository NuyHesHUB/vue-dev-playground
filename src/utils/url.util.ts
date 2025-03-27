const _getUrlParameter = (param: string) => {
    const pageURL = window.location.search.substring(1);
    const urlVariables = pageURL.split('&');
    let parameterName;
    for (let i = 0; i < urlVariables.length; i++) {
        parameterName = urlVariables[i].split('=');
        if (parameterName[0] === param) {
            return parameterName[1] === undefined ? true : decodeURIComponent(parameterName[1]);
        }
    }
};

export {
    _getUrlParameter as getUrlParameter,
}