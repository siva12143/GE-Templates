ZOHO.CREATOR.init()
    .then(async function () {
        let allStock = [];
        let allStockItems = [];
        var queryParams = await ZOHO.CREATOR.UTIL.getQueryParams();
        const setCriteria = "Status == Confirm && Outward_Status != Fully Sent"; 
        pageNumber = 1;
        async function initValues(pageNumber){
            config = {
                appName: "girish-exports",
                reportName: "All_Open_Stocks",
                criteria : "(Status == \"Confirm\" && Outward_Status != \"Fully Sent\")",
                page : pageNumber,
                pageSize : 200
            }
            
            await ZOHO.CREATOR.API.getAllRecords(config).then(function (response) {
                allStock = response.data;
                if(response.data.length == 200){
                    pageNumber+=1;
                    initValues(pageNumber);
                }
                else{
                    allStock.reverse();
                    displayValue(allStock);
                }
            });

        }
        initValues(1)

        const selectField = document.getElementById("osValues");
        function displayValue(val){
            // console.log(val);
            selectField.innerHTML = "<option>select</option>";
            val.forEach(element => {
                console.log(element.ID, element.OS_ID);
                const option = document.createElement("option");
                option.value = element.ID;
                option.innerText = element.OS_ID;
                selectField.appendChild(option);
            });
        }

        selectField.addEventListener("change", async (e) => {
            console.log(e.target.value);
            config = {
                appName: "girish-exports",
                reportName: "All_Open_Stock_Items",
                criteria : "(Open_Stock == " + e.target.value +")",
                page : pageNumber,
                pageSize : 200
            }
            
            await ZOHO.CREATOR.API.getAllRecords(config).then(function (response) {
                allStockItems = response.data.reverse();
            });
            tableValues(allStockItems);
        })





       async function tableValues(val) {
        console.log(val,"running");
        
        const tableBody = document.getElementById("tableBody");
        const publishKey = "0UA13H0KaNAkEe2BkTj3FYxTb0hKhaE0FyuxKmq13Cx9xGH9mHMxGSYCfJ5WRhUGa5SrwCqPVS9usDjqQF8zk5fXtatYChn9Y8ab";
            tableBody.innerHTML ="";
            allStockItems.forEach(e => {
                console.log(e);
                const row = document.createElement("tr");
                const imageID = e.Image.split("=")[1];
                let imgLink = `https://creator.zoho.in/girish.k_girishexports/girish-exports/All_Open_Stock_Items/Image/image/${imageID}?publishKey=${publishKey}`;
                row.id = e.ID;
                
                row.innerHTML = `
                <td class=" px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <input id="item${e.ID}" type="text" class="relative py-3 px-2  w-full bg-white rounded shadow-inner border border-gray-200 outline-none text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:shadow-outline" value='${e.Item}' />
                </td>
                <td class=" px-5 py-5 border-b border-gray-200 bg-white text-sm"><img class="h-[500px] " src=${imgLink}/></td>
                <td class=" px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p id="item${e.ID}" type="text" class="relative py-3 px-2 w-full bg-white rounded shadow-inner border border-gray-200 outline-none text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:shadow-outline">${e.Qty}</p>
                </td>
                <td class=" px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <input id="item${e.ID}" type="text" class="relative py-3 px-2 w-full bg-white rounded shadow-inner border border-gray-200 outline-none text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:shadow-outline" value='${e.Item}' />
                </td>
                <td class=" px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <input id="item${e.ID}" type="text" class="relative py-3 px-2 w-full bg-white rounded shadow-inner border border-gray-200 outline-none text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:shadow-outline" value='${e.Item}' />
                </td>
                <td class=" px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <input id="item${e.ID}" type="text" class="relative py-3 px-2 w-full bg-white rounded shadow-inner border border-gray-200 outline-none text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:shadow-outline" value='${e.Item}' />
                </td>
                <td class=" px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <input id="item${e.ID}" type="text" class="relative py-3 px-2 w-full bg-white rounded shadow-inner border border-gray-200 outline-none text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:shadow-outline" value='${e.Item}' />
                </td>
                
            `
                tableBody.appendChild(row);
            });
        }



        // displayValue();






        // document.getElementById('container').addEventListener("click", (e) => {
        //     console.log(e.target.id);
        //     const enterValue = e.target.id;

        //     if (enterValue == "Update") {
        //         document.querySelectorAll("#tableBody tr").forEach(async element => {
        //             const keyVal = element.id
        //             const inputVal = document.getElementById("item" + element.id).value;
        //             const UpdateData = {
        //                 data: {
        //                     Item: inputVal
        //                 }
        //             };
        //             console.log(UpdateData);
        //             var config = {
        //                 appName: "girish-exports",
        //                 reportName: "All_Open_Stock_Items",
        //                 id: keyVal,
        //                 data: UpdateData,
        //             };
        //             await ZOHO.CREATOR.API.updateRecord(config).then(function (response) {
        //                 if (response.code == 3000) {
        //                     console.log(response);
        //                 }
        //             });

        //         });
        //     } else {
        //         console.log("Run Else");
        //         displayValue()
        //     }
        // })

    });