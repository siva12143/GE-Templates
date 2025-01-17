ZOHO.CREATOR.init()
    .then(async function () {
        let totalRecordCount = 0;
        let renderRecordCount = 0;
        let getAllPO = [];
        const warehouse = [];
        const warehouseStorage = [];
        const warehouseStorageBin = [];

        var queryParams =await ZOHO.CREATOR.UTIL.getQueryParams();
        console.log(queryParams.IdVal);
        
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
        //get warehouse
        //   show only po
        const getPo = document.getElementById("poId");
        getPo.innerHTML = `<option selected value="${getAllPO.Purchase_Order1.ID}">${getAllPO.Purchase_Order1.display_value}</option>`;
            // const option = document.createElement("option");
            // option.value = e.Purchase_Order1.ID;
            // option.innerText = e.PO_ID;
            // getPo.appendChild(option);
        
        //   Show only warehouse
        const getWare = document.getElementById("warehouse");
        getWare.innerHTML = "<option>Select</option>";
        warehouse.forEach(e => {
            const option = document.createElement("option");
            option.value = e.ID;
            option.innerText = e.Factory;
            getWare.appendChild(option);
        });
        //   Show only warehouse Storage
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

        //   Show only Storage Bin
        getStor.addEventListener("change",() => {
            console.log(getStor.value);
            const getBin = document.querySelectorAll(".warehouseBin");
            console.log(warehouseStorageBin);
            const filterBin = warehouseStorageBin.filter(obj => obj.Warehouse_Storage.ID == getStor.value);
            console.log(filterBin);

            getBin.forEach((e) => {
                e.innerHTML = "<option>Select</option>";
                filterBin.forEach((e2) => {
                    const createOption = document.createElement("option");
                    createOption.innerText = e2.Bin;
                    createOption.value = e2.ID;
                    e.appendChild(createOption);
                })                
            })
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
            let grnList = [];
            config = {
                appName: "girish-exports",
                reportName: "All_Purchase_Order_Items",
                criteria: `(Purchase_Order == ${getPo.value})`,
                page: 1,
                pageSize: 200
            }
            await ZOHO.CREATOR.API.getAllRecords(config).then(async function (response) {
                const poItems = response.data;
                let setCreiteria = "";
                
                
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
                console.log(setCreiteria);
                
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
                    // console.log(createItemList);

                    let setCreiteria2 = `Purchase_Order == ${getPo.value}`;
                    try{
                        config = {
                            appName: "girish-exports",
                            reportName: "All_Goods_Recived_Note",
                            criteria: setCreiteria2,
                            page: 1,
                            pageSize: 200
                        }
                        await ZOHO.CREATOR.API.getAllRecords(config).then(async function (response) {
                            let getGrn = response.data;
                            setCreiteria2 = "";
                            for (let i = 1; i <= getGrn.length; i++) {
                                setCreiteria2 += `Goods_Recived_Note == ${getGrn[i-1].ID}`;
                                if(i != getGrn.length){
                                    setCreiteria2 += "||";
                                }
                            }
                            
                            config = {
                                appName: "girish-exports",
                                reportName: "All_Grn_Items",
                                criteria: setCreiteria2,
                                page: 1,
                                pageSize: 200
                            }
                            await ZOHO.CREATOR.API.getAllRecords(config).then(async function (response2) {
                                grnList = response2.data
                            })
                        });
                    }catch(err){
                        // console.log(err.status);
                        
                    }
                    const table = document.querySelector("#subform tbody");
                    table.innerHTML = "";
                poItems.forEach((e,i) => {
                    
                    const filterUrl = createItemList.filter(obj => obj.ID == e.Items.ID);
                    const getOldGrn = grnList.filter(obj => obj.Items.ID == e.Items.ID && obj.Size.ID == e.Size.ID);
                    let grnRecived = 0;
                        try {
                            getOldGrn.forEach((e2) => {
                                grnRecived += parseFloat(e2.GRN_Recived);
                            })
                        } 
                        catch (error) {
                            grnRecived = 0;
                        }
                        
                    const row = document.createElement("tr");
                    row.id = i
                    row.innerHTML = `
                            <td class="border-t-2 border-gray-200 p-2">
                                <select id="item${i}"
                                    class=" bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                    <option selected value="${e.Items.ID || ""} ">${e.Items.display_value || "Select"}</option>
                                </select>
                            </td>
                            <td  class="w-[250px] border-t-2 border-gray-200 p-2"><iframe id="image${i}" src="${filterUrl[0].url}" scrolling="no" frameborder="0" allowfullscreen=true width="100%"  title="Embed code" ></iframe></td>
                            <td  class="border-t-2 border-gray-200 p-2">
                                <div class="form-group w-full p-4">
                                    <select id="size${i}"
                                        class=" bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                        <option selected value="${e.Size.ID || ""} ">${e.Size.display_value || "Select"}</option>
                                    </select>
                                </div>
                            </td>
                            <td  class="border-t-2 border-gray-200 p-2">
                                <input type="text" id="ordered${i}" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" disabled value="${e.Qty}" />
                            </td>
                            <td  class="border-t-2 border-gray-200 p-2">
                                <input type="text" id="grn${i}" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" disabled value="${grnRecived}" />
                            </td>
                            <td  class="border-t-2 border-gray-200 p-2">
                                <div class="form-group w-full p-4">
                                    <select id="bin${i}"
                                        class="warehouseBin bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 required">
                                        <option value="" selected>Select</option>
                                    </select>
                                </div>
                            </td>
                            <td  class="border-t-2 border-gray-200 p-2">
                                <input type="text" id="chellan${i}" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value="" required />
                            </td>
                            <td  class="border-t-2 border-gray-200 p-2">
                                <input type="text" id="recived${i}" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value="" required />
                            </td>
                            <td  class="border-t-2 border-gray-200 p-2">
                                <input type="text" id="accept${i}" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value="" />
                            </td>
                            <td  class="border-t-2 border-gray-200 p-2">
                                <input type="text" id="reject${i}" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value="" />
                            </td>
                            <td  class="border-t-2 border-gray-200 p-2">
                                <input type="text" id="exces${i}" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value="" />
                            </td>
                    `
                    table.appendChild(row);
                });
            });
        })
        
        // subform rows values;
        const tbody = document.getElementById("tablebody");
        tbody.addEventListener("change", (event) => {
            const getCurrentID = event.target.closest("tr").id;
            const getCurrentRow = event.target.closest("tr");
            let getID = event.target.id.slice(0, 7);
            // Chellan
            if(getID == "chellan"){
                const orderedQty = getCurrentRow.querySelector(`#ordered${getCurrentID}`).value;
                const grnQty = getCurrentRow.querySelector(`#grn${getCurrentID}`).value;
                let notRecived = orderedQty - grnQty || 0;
                    notRecived = notRecived.toFixed(2);
                if(notRecived >= 0){
                        getCurrentRow.querySelector(`#recived${getCurrentID}`).value = event.target.value ;
                        if(parseInt(orderedQty) < parseInt(event.target.value) + parseInt(grnQty)){
                            const exces = (parseInt(event.target.value) - (orderedQty - grnQty)).toFixed(2);
                            getCurrentRow.querySelector(`#exces${getCurrentID}`).value = exces;
                            getCurrentRow.querySelector(`#accept${getCurrentID}`).value = (orderedQty - grnQty).toFixed(2);
                            getCurrentRow.querySelector(`#reject${getCurrentID}`).value = 0;
                        }else{
                            getCurrentRow.querySelector(`#accept${getCurrentID}`).value = event.target.value;
                            getCurrentRow.querySelector(`#reject${getCurrentID}`).value = 0;
                            getCurrentRow.querySelector(`#exces${getCurrentID}`).value = 0;

                        }
                }
            }
            // Recived
            if(getID == "recived"){
                const orderedQty = getCurrentRow.querySelector(`#ordered${getCurrentID}`).value;
                const grnQty = getCurrentRow.querySelector(`#grn${getCurrentID}`).value;
                const recived = event.target.value;
                if(parseInt(orderedQty) < parseInt(event.target.value) + parseInt(grnQty)){
                    const exces = (parseInt(recived) - (orderedQty - grnQty)).toFixed(2);

                    getCurrentRow.querySelector(`#exces${getCurrentID}`).value = exces;
                    getCurrentRow.querySelector(`#accept${getCurrentID}`).value = (orderedQty - grnQty).toFixed(2);
                    getCurrentRow.querySelector(`#reject${getCurrentID}`).value = 0;
                }else{
                    getCurrentRow.querySelector(`#accept${getCurrentID}`).value = event.target.value;
                    getCurrentRow.querySelector(`#reject${getCurrentID}`).value = 0;
                    getCurrentRow.querySelector(`#exces${getCurrentID}`).value = 0;

                }
            }
            // Accept
            getID = event.target.id.slice(0, 6);
            // if(getID == "accept"){
            //     const accept = event.target.value;
            //     const recived = getCurrentRow.querySelector(`#recived${getCurrentID}`).value;
            //     if(recived < accept){
            //         alert(`Please Enter Less then or Equal ${recived}`);
            //         event.target.value = 0;
            //     }
            // }
            // Reject
            if(getID == "reject"){
                const orderedQty = getCurrentRow.querySelector(`#ordered${getCurrentID}`).value;
                const grnQty = getCurrentRow.querySelector(`#grn${getCurrentID}`).value || 0;
                const reject = event.target.value;
                const recived2 =  getCurrentRow.querySelector(`#recived${getCurrentID}`).value;
                const exces = recived2 - (orderedQty - grnQty);
                console.log(recived2);
                console.log(reject);
                
                const accept = recived2 - exces;
                if(recived2 < parseInt(event.target.value)){
                    alert(`Please Enter Less then or Equal ${recived2}`);
                    event.target.value = 0;
                    getCurrentRow.querySelector(`#exces${getCurrentID}`).value = exces;
                    getCurrentRow.querySelector(`#accept${getCurrentID}`).value = accept;
                }else{
                    const getRejectValue = exces - reject;
                    alert(getRejectValue);
                    if(getRejectValue <= 0){
                        const getVal= accept + getRejectValue;
                        getCurrentRow.querySelector(`#accept${getCurrentID}`).value = getVal;
                        getCurrentRow.querySelector(`#exces${getCurrentID}`).value = 0;
                    }
                    else{
                        getCurrentRow.querySelector(`#exces${getCurrentID}`).value = getRejectValue;
                        getCurrentRow.querySelector(`#accept${getCurrentID}`).value = accept;
                        
                    }
                    // }
                    // const accept = recived - reject;
                }
            }
        })
        
        const action = document.getElementById("buttonContainer");
        action.addEventListener("click", (e) => {



            const postPurchaseOrder = document.getElementById("poId").value;
            const postFinanceType = document.getElementById("finance").value;
            const postWarehouse = document.getElementById("warehouse").value;
            const postStorage = document.getElementById("storage").value;
            const postInvoiceNo = document.getElementById("invoice").value;
            let postInvoiceDate = document.getElementById("invoiceDate").value;
            let postChellanNo = document.getElementById("ChellanNo").value;
            let postFinChellanNo =document.getElementById("finChellanNo").value;
            const postGateNo = document.getElementById("gateNo").value;
console.log(postInvoiceDate);

let today = new Date(postInvoiceDate);

// Define an array of month names
let monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
                  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Format the date
postInvoiceDate = String(today.getDate()).padStart(2, '0') + '-' + 
    monthNames[today.getMonth()] + '-' + 
    today.getFullYear();


            if(postFinanceType == "Self"){
                postFinChellanNo = null;
            }
            else{
                 postChellanNo = null;        
            }
            // get subform values
            const Subform = [];
            
            const subform = document.getElementById("tablebody");
            const rows = subform.querySelectorAll('tr');
            
            // Define an array of month names
            let today2 = new Date();
                
                // Format the date
                let formattedDate = String(today2.getDate()).padStart(2, '0') + '-' + 
                    monthNames[today2.getMonth()] + '-' + 
                    today.getFullYear();
            rows.forEach((e,index) =>{
                
                console.log(e.querySelector("td #item"+index).value,e.querySelector("td #item"+index).innerText);
                const rowData = {
                    Items : e.querySelector("td #item"+index).value,
                    Size :  e.querySelector("td #size"+index).value,
                    Date_field1 : formattedDate,
                    Ordered_Qty :  e.querySelector("td #ordered"+index).value,
                    GRN_Recived :     e.querySelector("td #grn"+index).value,
                    Warehouse_Bin :  e.querySelector("td #bin"+index).value,
                    Chellan_Qty : e.querySelector("td #chellan"+index).value,
                    Recived_Qty : e.querySelector("td #recived"+index).value,
                    Accepted : e.querySelector("td #accept"+index).value,
                    Rejected : e.querySelector("td #reject"+index).value,
                    Excess : e.querySelector("td #exces"+index).value,
                };
                Subform.push(rowData);
            })

            if(e.target.id == "submit"){
                const Data = {
                    data:{
                        Purchase_Order : postPurchaseOrder,
                        Financiar_Type : postFinanceType,
                        Warehouse : postWarehouse,
                        Storage : postStorage,
                        Invoice_No : postInvoiceNo,
                        Chellan_No : postChellanNo,
                        Financiar_Challan_No : postFinChellanNo,
                        Invoice_Date : postInvoiceDate,
                        Gate_No : postGateNo,
                        GRN_Item : Subform
                    }
                }
                config = {     
                    appName : "girish-exports",
                    formName : "Goods_Recived_Note",
                    data : Data
                    } 
                     //add record API
                     ZOHO.CREATOR.API.addRecord(config).then(function(response){
                        try {
                            console.log(response);
                            
                        } catch (err) {
                           console.log(err);
                        }
                    });
            }
            if(e.target.id == "reset"){
                location.reload();
            }
            
        })
        
        
    });

