ZOHO.CREATOR.init()
    .then(async function () {
        let totalRecordCount = 0;
        let renderRecordCount = 0;
        const getAllPO = [];
        const warehouse = [];
        const warehouseStorage = [];
        const warehouseStorageBin = [];
        // get po count
        config = {
            appName: "girish-exports",
            reportName: "All_Purchase_Orders",
            criteria: "(Status == \"Confirmed\" && GRN_Status != \"Fully Recived\")",
        }
        await ZOHO.CREATOR.API.getRecordCount(config).then(function (response) {
            totalRecordCount = response.result.records_count || 0;
        });
        // get PO_ID
        if ((parseInt(totalRecordCount) / renderRecordCount || 1) >= 0) {
            config = {
                appName: "girish-exports",
                reportName: "All_Purchase_Orders",
                criteria: "(Status == \"Confirmed\" && GRN_Status != \"Fully Recived\")",
                page: 1,
                pageSize: 200
            }
            await ZOHO.CREATOR.API.getAllRecords(config).then(function (response) {
                renderRecordCount += 200;
                response.data.forEach(e => {
                    getAllPO.push(e);
                });
            });

        }
        //get warehouse
        config = {
            appName: "girish-exports",
            reportName: "All_Warehouses",
            page: 1,
            pageSize: 200
        }
        await ZOHO.CREATOR.API.getAllRecords(config).then(function (response) {
            response.data.forEach(e => {
                warehouse.push(e);
            });
        });
        // get warehouse storage
        config = {
            appName: "girish-exports",
            reportName: "All_Warehouse_Storages",
            page: 1,
            pageSize: 200
        }
        await ZOHO.CREATOR.API.getAllRecords(config).then(function (response) {
            response.data.forEach(e => {
                warehouseStorage.push(e);
            });
        });
        // warehouse bin
        config = {
            appName: "girish-exports",
            reportName: "All_Warehouse_Bin",
            page: 1,
            pageSize: 200
        }
        await ZOHO.CREATOR.API.getAllRecords(config).then(function (response) {
            response.data.forEach(e => {
                warehouseStorageBin.push(e);
            });
        });
        //   show only po
        const getPo = document.getElementById("poId");
        getPo.innerHTML = "<option>Select</option>";
        getAllPO.sort((a, b) => {
            const numA = parseInt(a.PO_ID.split("-")[1], 10); // Extract the number from "PO_ID"
            const numB = parseInt(b.PO_ID.split("-")[1], 10);
            return numA - numB; // Sort in ascending order
        });
        getAllPO.forEach(e => {
            const option = document.createElement("option");
            option.value = e.ID;
            option.innerText = e.PO_ID;
            getPo.appendChild(option);
        });
        //   Show only warehouse
        const getWare = document.getElementById("warehouse");
        getWare.innerHTML = "<option>Select</option>";
        warehouse.forEach(e => {
            const option = document.createElement("option");
            option.value = e.ID;
            option.innerText = e.Factory;
            getWare.appendChild(option);
        });
        //   Show only warehouse
        const getStor = document.getElementById("storage");
        getWare.addEventListener("click", () => {
            // console.log(getWare.value);
            const getfilteredStorage = warehouseStorage.filter(obj => obj.Warehouse.ID == getWare.value);
            getStor.innerHTML = "<option>Select</option>";
            getfilteredStorage.forEach(e => {
                const option = document.createElement("option");
                option.value = e.ID;
                option.innerText = e.Storages;
                getStor.appendChild(option);
            });
        })
        // financer based filter
        const getFin = document.getElementById("finance");
        const chellan = document.querySelector(".chellan");
        const finChellan = document.querySelector(".finChellan");
        finChellan.style.display = "none";
        getFin.addEventListener("change", () => {
            if(getFin.value == "Self"){
                finChellan.value = "";
                finChellan.style.display = "none";
                chellan.style.display = "block";
            }
            else if(getFin.value != "Self"){
                chellan.value = "";
                finChellan.style.display = "block";
                chellan.style.display = "none";
            }
        })

        // PO ID filtered by items
        getPo.addEventListener("change", async () => {
            config = {
                appName: "girish-exports",
                reportName: "All_Purchase_Order_Items",
                criteria: `(Purchase_Order == ${getPo.value})`,
                page: 1,
                pageSize: 200
            }
            await ZOHO.CREATOR.API.getAllRecords(config).then(async function (response) {
                const poItems = response.data;
                setCreiteria = "";
                const uniqueByName = Array.from(
                    new Map(poItems.map(item => [item.Items.ID, item])).values()
                );
                // console.log(uniqueByName);
                
                for(i=1; i<=uniqueByName.length; i++){
                    setCreiteria += `ID == ${uniqueByName[i-1].Items.ID}`;
                    if(i != uniqueByName.length){
                        setCreiteria += "||";
                    }
                }
                const createItemList = [];
                // console.log(setCreiteria);
                    config = {
                        appName: "girish-exports",
                        reportName: "All_Items",
                        criteria: setCreiteria,
                        page: 1,
                        pageSize: 200
                    }
                    await ZOHO.CREATOR.API.getAllRecords(config).then(async function (response) {
                        // console.log(response.data);
                        response.data.forEach((e) => {
                            const createMap = {ID : e.ID, url: e.Url.url+"?toolbar=false&appearance=light&themecolor=green"}
                            createItemList.push(createMap)
                        })
                    });
                    console.log(createItemList);
                    const table = document.querySelector("#subform tbody");
                    table.innerHTML = "";
                poItems.forEach(e => {
                    const filterUrl = createItemList.filter(obj => obj.ID == e.Items.ID);
                    console.log(filterUrl);
                    
                    const row = document.createElement("tr");
                    console.log(filterUrl[0].url);
                    
                    row.innerHTML = `
                            <td class="border-t-2 border-gray-200 px-4 py-3">${e.Items.display_value}</td>
                            <td class="w-[250px] border-t-2 border-gray-200 px-4 py-3"><iframe src="${filterUrl[0].url}" scrolling="no" frameborder="0" allowfullscreen=true width="100%"  title="Embed code" ></iframe></td>
                            <td class="border-t-2 border-gray-200 px-4 py-3">${e.Qty}</td>
                            <td class="border-t-2 border-gray-200 px-4 py-3"></td>
                            <td class="border-t-2 border-gray-200 px-4 py-3">
                                <div class="form-group w-full p-4">
                                    <label for="poId" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Purchase Order</label>
                                    <select id="poId"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                        <option selected>Select</option>
                                    </select>
                                </div>
                            </td>
                            <td class="border-t-2 border-gray-200 px-4 py-3"></td>
                            <td class="border-t-2 border-gray-200 px-4 py-3"></td>
                            <td class="border-t-2 border-gray-200 px-4 py-3"></td>
                            <td class="border-t-2 border-gray-200 px-4 py-3"></td>
                    `
                    table.appendChild(row);
                });
            });
        })
        
        
    });

    //  -------- For GON ------

    // getPo.addEventListener("change", () => {
    //     // console.log(getPo.value);
    //     filterPO = getAllPO.filter(obj => obj.ID == getPo.value);
    //     filterPO.forEach(async (e) => {
            // console.log(e);
            // e.Purchase_Request.forEach((e2) => {
            //     // console.log(e2);
            // });
            // for(i = 1; i<= e.Purchase_Request.length; i++){
            //     setCriteria += `ID == ${e.Purchase_Request[i-1].ID}`;
            //     if(i != e.Purchase_Request.length){
            //         setCriteria += "||";
            //     }
            // }
            // // purchase request items
            // config = {
            //     appName: "girish-exports",
            //     reportName: "All_Purchase_Requests",
            //     criteria: setCriteria,
            //     page: 1,
            //     pageSize: 200
            // }
            // await ZOHO.CREATOR.API.getAllRecords(config).then(async function (response) {
            //     setCriteria = [];
            //     console.log(response.data.length);
                
            //     for(i=1; i<=response.data.length; i++){
            //         setCriteria.push(`ID == ${response.data[i-1].Order.ID}`);
            //     }
            //     setCriteria = setCriteria.toString();
            //     setCriteria = setCriteria.replaceAll(",", "||");
            // });
            // // Order Items
            // config = {
            //     appName: "girish-exports",
            //     reportName: "All_Order_Accesseries",
            //     criteria: setCriteria,
            //     page: 1,
            //     pageSize: 200
            // }
            // await ZOHO.CREATOR.API.getAllRecords(config).then(async function (response) {
            //     console.log(response);
            // })
    //     })
    // })