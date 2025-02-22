ZOHO.CREATOR.init()
    .then(async function () {
        let totalRecordCount = 0;
        let renderRecordCount = 0;
        let getAllPO = [];
        const warehouse = [];
        const warehouseStorage = [];
        const warehouseStorageBin = [];

        var queryParams = await ZOHO.CREATOR.UTIL.getQueryParams();

        // get PO_ID
        config = {
            appName: "girish-exports",
            reportName: "All_Goods_Recived_Note",
            id: queryParams.IdVal
        }
        await ZOHO.CREATOR.API.getRecordById(config).then(function (response) {
            getAllPO = response.data;
            console.log(response.data);
            
        });

        //   show only po
        const getPo = document.getElementById("poId");
        getPo.innerHTML = `<option selected value="${getAllPO.Purchase_Order1.ID}">${getAllPO.Purchase_Order1.display_value}</option>`;
        const invoice = document.getElementById("invoice");
        invoice.value = getAllPO.Invoice_No;


        config = {
            appName: "girish-exports",
            reportName: "All_Grn_Items",
            criteria: (`Goods_Recived_Note == ${queryParams.IdVal}`),
            page: 1,
            pageSize: 200
        }
        await ZOHO.CREATOR.API.getAllRecords(config).then(async function (response2) {
            grnList = response2.data
            let setCreiteria = "";
            const count = grnList.length;
            grnList.forEach((e, i) => {
                console.log(e);
                
                setCreiteria += "ID == " + e.Items.ID;
                if (i + 1 != count) {
                    setCreiteria += "||";
                }
            })
            console.log(setCreiteria);
            
            const createItemList = [];
            config = {
                appName: "girish-exports",
                reportName: "All_Items",
                criteria: setCreiteria,
                page: 1,
                pageSize: 200
            }
            await ZOHO.CREATOR.API.getAllRecords(config).then(async function (response) {
                console.log(response.data);
                response.data.forEach((e) => {
                    const createMap = { ID: e.ID, url: e.Url.url + "?toolbar=false&appearance=light&themecolor=green" }
                    createItemList.push(createMap)
                })
            });
            
            const table = document.querySelector("#subform tbody");
            table.innerHTML = "";
            let product = {};
            grnList.forEach((e, i) => {
                
                // const filterUrl = createItemList.filter(obj => obj.ID == e.Items.ID);
                const filterUrl = createItemList.find(obj => obj.ID == e.Items.ID);
                const row = document.createElement("tr");
                console.log(e.Items.ID, createItemList[0].ID);
                console.log(filterUrl);
                
                row.id = e.ID
                row.innerHTML = `
                        <td class="border-t-2 border-gray-200 p-2">
                            <select id="item${e.ID}"
                                class=" bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                <option selected value="${e.Items.ID || ""} ">${e.Items.display_value || "Select"}</option>
                            </select>
                        </td>
                        <td  class="w-[250px] border-t-2 border-gray-200 p-2"><iframe id="image${e.ID}" src="${filterUrl.url}" scrolling="no" frameborder="0" allowfullscreen=true width="100%"  title="Embed code" ></iframe></td>
                        <td  class="border-t-2 border-gray-200 p-2">
                            <div class="form-group w-full p-4">
                                <select id="size${e.ID}"
                                    class=" bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                    <option selected value="${e.Size.ID || ""} ">${e.Size.display_value || "Select"}</option>
                                </select>
                            </div>
                        </td>
                        <td  class="border-t-2 border-gray-200 p-2">
                            <input type="text" id="recived${e.ID}" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value="" required />
                        </td>
                        <td  class="border-t-2 border-gray-200 p-2">
                            <input type="text" id="rejected${e.ID}" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value="" />
                        </td>
                        <td  class="border-t-2 border-gray-200 p-2 "style="display:none">
                            <input type="text" id="grnQty${e.ID}" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value="${e.GRN_Recived || 0}"/>
                        </td>
                `
                table.appendChild(row);
            });

        })


        // console.log(setCreiteria);





        const action = document.getElementById("submit");
        action.addEventListener("click", (event) => {
            // get subform values
            const Subform = [];

            const subform = document.getElementById("tablebody");
            const rows = subform.querySelectorAll('tr');
           
            // if (event.target.id == "submit") {
            //     console.log(event.target);
                console.log(action);
                
                // submitValue()
                // const newData = {
                //     data : {
                //         Warehouse : getAllPO.Warehouse,
                //         Storage : getAllPO.Storage,
                //         Recived_Flag: getAllPO.Recived_Flag,
                //         Purchase_Order1:getAllPO.Purchase_Order1,
                //         Invoice_No:getAllPO.Invoice_No,
                //         Invoice_Date:getAllPO.Invoice_Date,
                //         Gate_No:getAllPO.Gate_No,
                //         GRN_ID:getAllPO.GRN_ID,
                //         GRN_Date:getAllPO.GRN_Date,
                //         Financiar_Type:getAllPO.Financiar_Challan_No,
                //         Chellan_No:getAllPO.Chellan_No,
                //         Financiar_Challan_No:getAllPO.Financiar_Challan_No
                //     }
                // }
                // console.log("RUN2");

                // config = {
                //     appName: "girish-exports",
                //     reportName: "All_Goods_Recived_Note",
                //     id: queryParams.IdVal,
                //     data : newData,
                // }
                // ZOHO.CREATOR.API.updateRecord(config).then(function (response) {
                //     console.log(response.data);
                // });
                // console.log(config);
                rows.forEach((e) => {
                    const recivedQty = e.querySelector("td #recived" + e.id).value
                    const rejectedQty = e.querySelector("td #rejected" + e.id).value || 0
                    const grnQty = e.querySelector("td #grnQty" + e.id).value
                    const Data = {
                        data: {
                            Recived_Qty : recivedQty,
                            Rejected : rejectedQty,
                        }
                    };
                    config = {
                        appName: "girish-exports",
                        reportName: "All_Grn_Items",
                        id: e.id,
                        data: Data
                    }
                    //update record API
                    ZOHO.CREATOR.API.updateRecord(config).then(function (response) {
                        console.log(response);
                    })  
                             
                })
                const newData = {
                    data : {
                        GRN_ID:getAllPO.GRN_ID,
                    }
                }
                console.log("RUN2");

                config = {
                    appName: "girish-exports",
                    reportName: "All_Goods_Recived_Note",
                    id: queryParams.IdVal,
                    data : newData,
                }
                ZOHO.CREATOR.API.updateRecord(config).then(function (response) {
                    console.log(response);
                }); 
            // }
            // else if (event.target.id == "reset") {
            //     location.reload();
            // }

        })


    });

