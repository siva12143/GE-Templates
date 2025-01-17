ZOHO.CREATOR.init()
    .then(async function () {
        var queryParams =await ZOHO.CREATOR.UTIL.getQueryParams();
        console.log(queryParams);
    })