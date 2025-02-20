ZOHO.CREATOR.init()
    .then(async function () {
        let totalRecordCount = 0;
        let renderRecordCount = 0;
        const getAllPlanSheet = [];
        const warehouse = [];
        let getAllAcceseries = [];
        let getAllFabric = [];

        let gonItem = [];
        var queryParams = await ZOHO.CREATOR.UTIL.getQueryParams();
        console.log(queryParams);

        // get po count
        config = {
            appName: "girish-exports",
            reportName: "All_Plan_Sheets",
        }
        await ZOHO.CREATOR.API.getRecordCount(config).then(function (response) {
            totalRecordCount = response.result.records_count || 0;
        });
        // get PO_ID
        if ((parseInt(totalRecordCount) / renderRecordCount || 1) >= 0) {
            config = {
                appName: "girish-exports",
                reportName: "All_Plan_Sheets",
                // criteria: "(Status == \"Confirmed\" && GRN_Status != \"Fully Recived\")",
                page: 1,
                pageSize: 200
            }
            await ZOHO.CREATOR.API.getAllRecords(config).then(function (response) {
                renderRecordCount += 200;
                response.data.forEach(e => {
                    getAllPlanSheet.push(e);
                    console.log(e, "response");

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
        //   show only plan sheet
        const getPlanSheet = document.getElementById("planSheet");
        getPlanSheet.innerHTML = "<option>Select</option>";
        getAllPlanSheet.forEach(e => {
            const option = document.createElement("option");
            option.value = e.ID;
            option.innerText = e.Plan_Sheet;
            getPlanSheet.appendChild(option);
        });

        //   Show only From warehouse
        const getWare = document.getElementById("fromWarehouse");
        getWare.innerHTML = "<option>Select</option>";
        warehouse.forEach(e => {
            const option = document.createElement("option");
            option.value = e.ID;
            option.innerText = e.Factory;
            getWare.appendChild(option);
        });
        //   Show only To warehouse 
        getWare.addEventListener('change', () => {
            const getWare2 = document.getElementById("toWarehouse");
            getWare2.innerHTML = "<option>Select</option>";
            filterwarehouse = warehouse.filter(obj => obj.ID != getWare.value);
            filterwarehouse.forEach(e => {
                const option = document.createElement("option");
                option.value = e.ID;
                option.innerText = e.Factory;
                getWare2.appendChild(option);
            });
        })

        // order ID auto load
        getPlanSheet.addEventListener("change", async () => {
            const filterPlanSheet = getAllPlanSheet.filter(obj => obj.ID == getPlanSheet.value);
            let setCreiteria = "";
            const getOrder = document.getElementById("order");
            let count = filterPlanSheet[0].Order_ID.length;

            filterPlanSheet[0].Order_ID.forEach((e, index) => {
                const addOrder = document.createElement("span");
                addOrder.classList = "text-[white] bg-blue-500 px-2 py-1 rounded";
                addOrder.innerHTML = e.display_value;
                getOrder.appendChild(addOrder);
                setCreiteria += `Order == ${e.ID}`;
                if ((index + 1) != count) {
                    setCreiteria += "||";
                }
            })

            config = {
                appName: "girish-exports",
                reportName: "All_Order_Acceseries",
                criteria: setCreiteria,
                page: 1,
                pageSize: 200
            }
            await ZOHO.CREATOR.API.getAllRecords(config).then(async function (response) {
                // console.log(response.data);
                getAllAcceseries = response.data;
            })
            config = {
                appName: "girish-exports",
                reportName: "All_Order_Fabric",
                criteria: setCreiteria,
                page: 1,
                pageSize: 200
            }
            await ZOHO.CREATOR.API.getAllRecords(config).then(async function (response) {
                // console.log(response.data);
                getAllFabric = response.data
            })


        })

        // order ID auto load
        getPlanSheet.addEventListener("change", async () => {
            const filterPlanSheet = getAllPlanSheet.filter(obj => obj.ID == getPlanSheet.value);
            let setCreiteria = "";
            let ourRef = "";

            const getOrder = document.getElementById("order");
            let count = filterPlanSheet[0].Order_ID.length;
            getOrder.innerHTML = "";
            filterPlanSheet[0].Order_ID.forEach((e, index) => {

                const addOrder = document.createElement("span");
                addOrder.classList = "text-[white] bg-blue-500 px-2 py-1 rounded";
                addOrder.innerHTML = e.display_value;
                addOrder.id = e.ID;
                getOrder.appendChild(addOrder);
                setCreiteria += `Order == ${e.ID}`;
                ourRef += "Our_Ref == " + e.display_value;
                if ((index + 1) != count) {
                    setCreiteria += "||";
                    ourRef += "||";
                }
            })

            config = {
                appName: "girish-exports",
                reportName: "All_Order_Acceseries",
                criteria: setCreiteria,
                page: 1,
                pageSize: 200
            }
            await ZOHO.CREATOR.API.getAllRecords(config).then(async function (response) {
                // console.log(response.data);
                getAllAcceseries = response.data;
            })
            config = {
                appName: "girish-exports",
                reportName: "All_Order_Fabric",
                criteria: setCreiteria,
                page: 1,
                pageSize: 200
            }
            await ZOHO.CREATOR.API.getAllRecords(config).then(async function (response) {
                getAllFabric = response.data
            })
            let GONID = "";
            let getCount = 0;
            // console.log(setCreiteria);
            var config2 = {
                appName: "girish-exports",
                reportName: "All_Goods_Outwards_Notes",
                criteria: setCreiteria,
            }

            await ZOHO.CREATOR.API.getRecordCount(config2).then(function (response) {
                //your code goes here.
                // console.log(response.result.records_count);
                getCount = response.result.records_count;

            });
            
            // console.log(setCreiteria, getCount);
            if (setCreiteria.length > 0 && getCount > 0) {
                var config = {
                    appName: "girish-exports",
                    reportName: "All_Goods_Outwards_Notes",
                    criteria: setCreiteria,
                    page: 1,
                    pageSize: 200
                }
                await ZOHO.CREATOR.API.getAllRecords(config).then(async function (response) {
                    console.log(response.data);
                    for (let i = 0; i < response.data.length; i++) {
                        GONID += "Goods_Outwards_Notes == " + response.data[i].ID;
                        if (response.data[i + 1]) {
                            GONID += "||";
                        }
                    }
                })

                
                // console.log(GONID);

                config = {
                    appName: "girish-exports",
                    reportName: "GON_Items",
                    criteria: GONID,
                    page: 1,
                    pageSize: 200
                }
                await ZOHO.CREATOR.API.getAllRecords(config).then(async function (response) {
                    gonItem = response.data;
                })
                // console.log(gonItem);
            }





            const mergeArray = [...getAllAcceseries, ...getAllFabric];
            const onlyForCategory = [];
            const filterByItemsAndSize = (data) => {
                return Object.values(
                    data.reduce((acc, curr) => {
                        // console.log(curr);

                        const key = `${curr.Items.ID}-${curr.Size.ID}`;
                        if (!acc[key]) {
                            acc[key] = { ...curr }; // Create a new object for the key
                        } else {
                            acc[key].Qty += curr.Qty; // Aggregate the qty for duplicate items and sizes
                        }
                        return acc;
                    }, {})
                );
            };



            const result = filterByItemsAndSize(mergeArray);
            let productData = {};
            // console.log(mergeArray);

            let totalCount = 0, copy = 0;
            mergeArray.forEach(e => {
                
                
                let requiredQty = parseInt(e.Total_Required_Qty) || 0;
                let key = `${e.Items.ID}_${e.Size.ID}_${e.Consumption_Unit.ID}`;
                if (!productData[key]) {

                    productData[key] = {
                        Consumption_Unit: e.Consumption_Unit.display_value,
                        Consumption_ID: e.Consumption_Unit.ID,
                        Size: e.Size.display_value,
                        Unit: e.Consumption_Unit.ID,
                        Size_ID: e.Size.ID,
                        Item: e.Items.display_value,
                        Item_ID: e.Items.ID,
                        Category: e.Item_Category.display_value,
                        Category_ID: e.Item_Category.ID,
                        Qty: requiredQty,
                    }
                } else {
                    productData[key].Qty += requiredQty
                    copy += 1;
                }
                totalCount += 1;
            });
            const getAllVal = Object.values(productData);
            console.log(getAllVal);
            iterateTable(getAllVal);

            const getCategory = document.getElementById("itemCategory");

            getCategory.addEventListener("change", (e) => {
                // console.log(e.target.value,);
                // iterateTable(getAllVal);
                let getFilterVal = getAllVal.filter(obj => obj.Category_ID == e.target.value);
                if (getFilterVal.length == 0) {
                    getFilterVal = getAllVal;
                }
                // console.log(getFilterVal);

                iterateTable(getFilterVal);
            })

            function iterateTable(val) {
                let totalIssued = 0;
                const cateList = [];
                const getCategory = document.getElementById("itemCategory");

                const subform = document.getElementById("tablebody");
                subform.innerHTML = "";
                val.forEach(async (e, i) => {
                getfilterGON = gonItem.filter(obj => obj.Items.ID == e.Item_ID && obj.Size.ID == e.Size_ID);
                // console.log(getfilterGON[0]);
                const filterVal = getfilterGON[0]?.GON_Qty;
                totalIssued = filterVal || 0;
                // console.log(filterVal);
                    // for item category
                    if (!cateList.includes(e.Category_ID) || cateList.length == 0) {
                        cateList.push(e.Category_ID);
                        const option = document.createElement("option");
                        option.value = e.Category_ID;
                        option.textContent = e.Category;
                        getCategory.appendChild(option);
                    }

                    //    totalIssued = totalIssued.toFixed(4);
                    // console.log(ourRef.length);
                    // console.log(ourRef);
                    var config2 = {
                        appName: "girish-exports",
                        reportName: "All_Stocks",
                        criteria: ourRef,
                        page: 1,
                        pageSize: 200

                    }
                    await ZOHO.CREATOR.API.getAllRecords(config2).then(function (response) {
                        // console.log("Stock", response.data);
                    });
                    // console.log(newObj);



                    // for item category
                    if (e.Qty > totalIssued) {


                        const row = document.createElement("tr");
                        row.id = "row" + i;
                        row.innerHTML = `
                            <td  class="border-t-2 border-gray-200 p-2" >
                            <span id="${i}" class="cursor-pointer deleteRow">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" style="color:red" class=" size-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                                </svg>
                            </span>
                        </td>
                        <td class="border-t-2 border-gray-200 p-2">
                            <select id="item${i}"class=" bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                <option selected value="${e.Item_ID || ""} ">${e.Item || "Select"}</option>
                            </select>
                        </td>
                        <td  class="w-[250px] border-t-2 border-gray-200 p-2"><iframe id="image${i}" src="" scrolling="no" frameborder="0" allowfullscreen=true width="100%"  title="Embed code" ></iframe></td>
                        <td  class="border-t-2 border-gray-200 p-2">
                            <div class="form-group w-full p-4">
                                <select id="size${i}"class=" bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" disabled>
                                    <option selected value="${e.Size_ID || ""}">${e.Size || ""}</option>
                                </select>
                            </div>
                        </td>
                        <td  class="hidden">
                            <input type="text" id="unit${i}" class=" bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value="${e.Unit}" disabled />
                        </td>
                        <td  class="border-t-2 border-gray-200 p-2">
                            <input type="text" disabled id="orderQty${i}" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value="${e.Qty}"  />
                        </td>
                        <td  class="border-t-2 border-gray-200 p-2">
                            <input type="text" id="gonQty${i}" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value="${totalIssued}" />
                        </td>
                        <td  class="border-t-2 border-gray-200 p-2">
                            <input type="text" id="issueQty${i}" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                           value="" />
                        </td>
                        
                        `;
                        subform.appendChild(row);
                    }

                })
            }

        })


        document.getElementById("buttonContainer").addEventListener("click", (e) => {
            // console.log(e.target);



            if (e.target.id == "submit") {
                const planSheet = document.getElementById("planSheet").value || null;
                const fromWarehouse = document.getElementById("fromWarehouse").value || null;
                const toWarehouse = document.getElementById("toWarehouse").value || null;
                const Order = document.getElementById("order");
                const itemCategory = document.getElementById("itemCategory").value || null;
                const orderID = [];
                const orderSpan = Array.from(Order.getElementsByTagName('span'))
                orderSpan.forEach(e => {
                    orderID.push(e.id);

                })
                const subform = [];

                const tablebody = document.getElementById("tablebody");
                const tablelength = tablebody.getElementsByTagName("tr").length;
                // console.log("Plan Sheet", planSheet, "fromWarehouse", fromWarehouse, "toWarehouse", toWarehouse, "Order", Order.children[0], "item Category", itemCategory);
                // console.log(subform);
                const allEmpty = [];
                // check null or empty values

                for (let i = 0; i < tablelength; i++) {
                    // console.log("issueQty" + i);
                    let getRowID = tableBody.rows[i].id;
                    getRowID = getRowID.slice(3);
                    // console.log(getRowID);



                    // console.log(document.getElementById("issueQty" + getRowID));
                    const getVal = document.getElementById("issueQty" + getRowID).value || null;

                    if (getVal == null) {
                        allEmpty.push(false);
                    } else {
                        allEmpty.push(true);
                    }
                }
                planSheet == null ? allEmpty.push(false) : allEmpty.push(true);
                fromWarehouse == null ? allEmpty.push(false) : allEmpty.push(true);
                toWarehouse == null ? allEmpty.push(false) : allEmpty.push(true);
                Order == null ? allEmpty.push(false) : allEmpty.push(true);

                const uploadData = {
                    data: {
                        Plan_Sheet: planSheet,
                        From_Warehouse: fromWarehouse,
                        Business_Warehouse: toWarehouse,
                        Order: orderID,
                        Show_Items: true,
                        Item_Category: itemCategory,
                        GON_Items: subform
                    }
                }
                // console.log(uploadData);
                // console.log(allEmpty);
                if (allEmpty.includes(false)) {
                    alert("Please Enter All Manditory fields");
                }
                else {

                    config = {
                        appName: "girish-exports",
                        formName: "Goods_Outwards_Notes",
                        data: uploadData
                    }
                    //add record API
                    ZOHO.CREATOR.API.addRecord(config).then(async function (response) {
                        if (response.data.ID) {
                            for (let i = 0; i < tablelength; i++) {
                                let getRowID = tableBody.rows[i].id;
                                getRowID = getRowID.slice(3);
                                const newObj = {
                                    data: {
                                        Items: document.getElementById("item" + getRowID).value,
                                        Size: document.getElementById("size" + getRowID).value,
                                        Order_Qty: document.getElementById("orderQty" + getRowID).value,
                                        Issued_Qty: document.getElementById("issueQty" + getRowID).value,
                                        GON_Qty: document.getElementById("gonQty" + getRowID).value,
                                        Units: document.getElementById("unit" + i).value,
                                        Goods_Outwards_Notes: response.data.ID,
                                    }
                                }
                                // stock
                                config2 = {
                                    appName: "girish-exports",
                                    formName: "G_O_N_Items",
                                    data: newObj
                                }
                                ZOHO.CREATOR.API.addRecord(config2).then(async function (response) {
                                    console.log(response);

                                })

                            }
                            // location.reload();
                        }
                    });
                }

            }

            else if (e.target.id == "reset") {
                location.reload();
            }

        })

        // Delete row


        const tableBody = document.querySelector("#tablebody")
        tableBody.addEventListener("click", (e) => {
            const deleteBtn = e.target.closest("span");

            if (deleteBtn && deleteBtn.classList.contains("deleteRow")) {
                // Find the closest row <tr>
                let row = deleteBtn.closest("tr");
                if (row) {
                    let rowId = row.getAttribute("id"); // Get the row ID
                    // console.log("Deleting row with ID:", rowId);

                    row.remove(); // Remove the row from the DOM
                    const rowcount = tableBody.children.length;
                    // console.log(rowcount);
                    if (rowcount == 0) {
                        document.getElementById("submit").style.pointerEvents = "none";
                    } else {
                        document.getElementById("submit").style.pointerEvents = "auto";
                        document.getElementById("submit").style.cursor = "pointer";
                    }
                }
            } else {
                console.log(false);
            }
        });

        // 
    })