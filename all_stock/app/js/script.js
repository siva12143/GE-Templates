ZOHO.CREATOR.init()
    .then(async function () {
        let allStock = [];
        let allStockItems = [];
        var queryParams = await ZOHO.CREATOR.UTIL.getQueryParams();
        config = {
            appName: "girish-exports",
            reportName: "All_Open_Stocks",
            id: queryParams.IdVal
        }
        await ZOHO.CREATOR.API.getRecordById(config).then(function (response) {
            allStock = response.data;
            document.getElementById("openStockID").innerHTML = response.data.OS_ID
        });

        config = {
            appName: "girish-exports",
            reportName: "All_Open_Stock_Items",
            criteria: (`Open_Stock == ${queryParams.IdVal}`),
            page: 1,
            pageSize: 200
        }
        await ZOHO.CREATOR.API.getAllRecords(config).then(function (response) {
            allStockItems = response.data.reverse();
        });


        const tableBody = document.getElementById("tableBody");
        const publishKey = "0UA13H0KaNAkEe2BkTj3FYxTb0hKhaE0FyuxKmq13Cx9xGH9mHMxGSYCfJ5WRhUGa5SrwCqPVS9usDjqQF8zk5fXtatYChn9Y8ab";
        function displayValue() {
            tableBody.innerHTML ="";
            allStockItems.forEach(e => {
                console.log(e);
                const row = document.createElement("tr");
                const imageID = e.Image.split("=")[1];
                let imgLink = `https://creator.zoho.in/girish.k_girishexports/girish-exports/All_Open_Stock_Items/Image/image/${imageID}?publishKey=${publishKey}`;
                row.id = e.ID;
                
                row.innerHTML = `
                <td class="w-1/3 px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <input id="item${e.ID}" type="text" class="relative py-3 px-2 pr-10 w-full bg-white rounded shadow-inner border border-gray-200 outline-none text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:shadow-outline" value='${e.Item}' />
                </td>
                <td class="w=2/3 px-5 py-5 border-b border-gray-200 bg-white text-sm"><img class="h-[500px] " src=${imgLink}/></td>
            `
                tableBody.appendChild(row);
            });
        }
        displayValue();
        document.getElementById('container').addEventListener("click", (e) => {
            console.log(e.target.id);
            const enterValue = e.target.id;

            if (enterValue == "Update") {
                document.querySelectorAll("#tableBody tr").forEach(async element => {
                    const keyVal = element.id
                    const inputVal = document.getElementById("item" + element.id).value;
                    const UpdateData = {
                        data: {
                            Item: inputVal
                        }
                    };
                    console.log(UpdateData);
                    var config = {
                        appName: "girish-exports",
                        reportName: "All_Open_Stock_Items",
                        id: keyVal,
                        data: UpdateData,
                    };
                    await ZOHO.CREATOR.API.updateRecord(config).then(function (response) {
                        if (response.code == 3000) {
                            console.log(response);
                        }
                    });

                });
            } else {
                console.log("Run Else");
                displayValue()
            }
        })

    });