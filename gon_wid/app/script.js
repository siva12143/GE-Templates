ZOHO.CREATOR.init()
    .then(async function () {
        let totalRecordCount = 0;
        let renderRecordCount = 0;
        const getAllPlanSheet = [];
        const warehouse = [];
        let getAllAcceseries = [];
        let getAllFabric = [];


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
                    console.log(e);
                    
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
                if((index +1) != count){
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
            const getOrder = document.getElementById("order");
            let count = filterPlanSheet[0].Order_ID.length;
            
            filterPlanSheet[0].Order_ID.forEach((e, index) => {
                const addOrder = document.createElement("span");
                addOrder.classList = "text-[white] bg-blue-500 px-2 py-1 rounded";
                addOrder.innerHTML = e.display_value;
                getOrder.appendChild(addOrder);
                setCreiteria += `Order == ${e.ID}`;
                if((index +1) != count){
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
                getAllFabric = response.data
            })

            const mergeArray = [...getAllAcceseries, ...getAllFabric];
            // console.log(mergeArray);
            const onlyForCategory =[];
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
            let totalCount = 0, copy = 0; 
            mergeArray.forEach(e => {
                let key = `${e.Items.ID}_${e.Size.ID}_${e.Consumption_Unit.ID}`;
                if(!productData[key]){
                    productData[key] = {
                        Consumption_Unit : e.Consumption_Unit.display_value,
                        Consumption_ID : e.Consumption_Unit.ID,
                        Size :  e.Size.display_value,
                        Size_ID :  e.Size.ID,
                        Item : e.Items.display_value,
                        Item_ID : e.Items.ID,
                        Qty : parseInt(e.Consumption) || 0,
                    }
                }else{
                    productData[key].Qty +=e.Consumption
                    copy +=1;
                }
                totalCount +=1;
            });
            const getAllVal = Object.values(productData);
            console.log(getAllVal);
            // console.log(totalCount, copy);
            
            
            
              const subform = document.getElementById("tablebody");
              mergeArray.forEach((e,i) => {
                
                const row = document.createElement("tr");
                row.id = i;
                row.innerHTML = `
                <td class="border-t-2 border-gray-200 p-2">
                    <select id="item${i}"class=" bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                        <option selected value="${e.Items.ID || ""} ">${e.Items.display_value || "Select"}</option>
                    </select>
                </td>
                <td  class="w-[250px] border-t-2 border-gray-200 p-2"><iframe id="image${i}" src="" scrolling="no" frameborder="0" allowfullscreen=true width="100%"  title="Embed code" ></iframe></td>
                <td  class="border-t-2 border-gray-200 p-2">
                    <div class="form-group w-full p-4">
                        <select id="size${i}"class=" bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                            <option selected value="${e.Size.ID || ""}">${e.Size.display_value || ""}</option>
                        </select>
                    </div>
                </td>
                <td  class="border-t-2 border-gray-200 p-2">
                    <input type="text" id="exces${i}" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value="" />
                </td>
                `;
                subform.appendChild(row);

            })

        }) 
        // financer based filter

        // PO ID filtered by items

        // getPlanSheet.addEventListener("change", async () => {
        //     let grnList = [];
        //     config = {
        //         appName: "girish-exports",
        //         reportName: "All_Purchase_Order_Items",
        //         criteria: `(Purchase_Order == ${getPo.value})`,
        //         page: 1,
        //         pageSize: 200
        //     }
        //     await ZOHO.CREATOR.API.getAllRecords(config).then(async function (response) {
        //         const poItems = response.data;
        //         let setCreiteria = "";
                
                
        //         const uniqueByName = Array.from(
        //             new Map(poItems.map(item => [item.Items.ID, item])).values()
        //         );
        //         // console.log(uniqueByName);
        //         for(i=1; i<=uniqueByName.length; i++){
        //             setCreiteria += `ID == ${uniqueByName[i-1].Items.ID}`;
        //             if(i != uniqueByName.length){
        //                 setCreiteria += "||";
        //             }
        //         }
        //         console.log(setCreiteria);
                
        //         const createItemList = [];
        //         // console.log(setCreiteria);
        //             config = {
        //                 appName: "girish-exports",
        //                 reportName: "All_Items",
        //                 criteria: setCreiteria,
        //                 page: 1,
        //                 pageSize: 200
        //             }
        //             await ZOHO.CREATOR.API.getAllRecords(config).then(async function (response) {
        //                 // console.log(response.data);
        //                 response.data.forEach((e) => {
        //                     const createMap = {ID : e.ID, url: e.Url.url+"?toolbar=false&appearance=light&themecolor=green"}
        //                     createItemList.push(createMap)
        //                 })
        //             });
        //             // console.log(createItemList);

        //             let setCreiteria2 = `Purchase_Order == ${getPo.value}`;
        //             try{
        //                 config = {
        //                     appName: "girish-exports",
        //                     reportName: "All_Goods_Recived_Note",
        //                     criteria: setCreiteria2,
        //                     page: 1,
        //                     pageSize: 200
        //                 }
        //                 await ZOHO.CREATOR.API.getAllRecords(config).then(async function (response) {
        //                     let getGrn = response.data;
        //                     setCreiteria2 = "";
        //                     for (let i = 1; i <= getGrn.length; i++) {
        //                         setCreiteria2 += `Goods_Recived_Note == ${getGrn[i-1].ID}`;
        //                         if(i != getGrn.length){
        //                             setCreiteria2 += "||";
        //                         }
        //                     }
                            
        //                     config = {
        //                         appName: "girish-exports",
        //                         reportName: "All_Grn_Items",
        //                         criteria: setCreiteria2,
        //                         page: 1,
        //                         pageSize: 200
        //                     }
        //                     await ZOHO.CREATOR.API.getAllRecords(config).then(async function (response2) {
        //                         grnList = response2.data
        //                     })
        //                 });
        //             }catch(err){
        //                 // console.log(err.status);
                        
        //             }
        //             const table = document.querySelector("#subform tbody");
        //             table.innerHTML = "";
        //         poItems.forEach((e,i) => {
                    
        //             const filterUrl = createItemList.filter(obj => obj.ID == e.Items.ID);
        //             const getOldGrn = grnList.filter(obj => obj.Items.ID == e.Items.ID && obj.Size.ID == e.Size.ID);
        //             let grnRecived = 0;
        //                 try {
        //                     getOldGrn.forEach((e2) => {
        //                         grnRecived += parseFloat(e2.GRN_Recived);
        //                     })
        //                 } 
        //                 catch (error) {
        //                     grnRecived = 0;
        //                 }
                        
        //             const row = document.createElement("tr");
        //             row.id = i
        //             row.innerHTML = `
        //                     <td class="border-t-2 border-gray-200 p-2">
        //                         <select id="item${i}"
        //                             class=" bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
        //                             <option selected value="${e.Items.ID || ""} ">${e.Items.display_value || "Select"}</option>
        //                         </select>
        //                     </td>
        //                     <td  class="w-[250px] border-t-2 border-gray-200 p-2"><iframe id="image${i}" src="${filterUrl[0].url}" scrolling="no" frameborder="0" allowfullscreen=true width="100%"  title="Embed code" ></iframe></td>
        //                     <td  class="border-t-2 border-gray-200 p-2">
        //                         <div class="form-group w-full p-4">
        //                             <select id="size${i}"
        //                                 class=" bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
        //                                 <option selected value="${e.Size.ID || ""} ">${e.Size.display_value || "Select"}</option>
        //                             </select>
        //                         </div>
        //                     </td>
        //                     <td  class="border-t-2 border-gray-200 p-2">
        //                         <input type="text" id="ordered${i}" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" disabled value="${e.Qty}" />
        //                     </td>
        //                     <td  class="border-t-2 border-gray-200 p-2">
        //                         <input type="text" id="grn${i}" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" disabled value="${grnRecived}" />
        //                     </td>
        //                     <td  class="border-t-2 border-gray-200 p-2">
        //                         <div class="form-group w-full p-4">
        //                             <select id="bin${i}"
        //                                 class="warehouseBin bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 required">
        //                                 <option value="" selected>Select</option>
        //                             </select>
        //                         </div>
        //                     </td>
        //                     <td  class="border-t-2 border-gray-200 p-2">
        //                         <input type="text" id="chellan${i}" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value="" required />
        //                     </td>
        //                     <td  class="border-t-2 border-gray-200 p-2">
        //                         <input type="text" id="recived${i}" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value="" required />
        //                     </td>
        //                     <td  class="border-t-2 border-gray-200 p-2">
        //                         <input type="text" id="accept${i}" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value="" />
        //                     </td>
        //                     <td  class="border-t-2 border-gray-200 p-2">
        //                         <input type="text" id="reject${i}" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value="" />
        //                     </td>
        //                     <td  class="border-t-2 border-gray-200 p-2">
        //                         <input type="text" id="exces${i}" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value="" />
        //                     </td>
        //             `
        //             table.appendChild(row);
        //         });
        //     });
        // })
        
        // subform rows values;

        // const tbody = document.getElementById("tablebody");
        // tbody.addEventListener("change", (event) => {
        //     const getCurrentID = event.target.closest("tr").id;
        //     const getCurrentRow = event.target.closest("tr");
        //     let getID = event.target.id.slice(0, 7);
        //     // Chellan
        //     if(getID == "chellan"){
        //         const orderedQty = getCurrentRow.querySelector(`#ordered${getCurrentID}`).value;
        //         const grnQty = getCurrentRow.querySelector(`#grn${getCurrentID}`).value;
        //         let notRecived = orderedQty - grnQty || 0;
        //             notRecived = notRecived.toFixed(2);
        //         if(notRecived >= 0){
        //                 getCurrentRow.querySelector(`#recived${getCurrentID}`).value = event.target.value ;
        //                 if(parseInt(orderedQty) < parseInt(event.target.value) + parseInt(grnQty)){
        //                     const exces = (parseInt(event.target.value) - (orderedQty - grnQty)).toFixed(2);
        //                     getCurrentRow.querySelector(`#exces${getCurrentID}`).value = exces;
        //                     getCurrentRow.querySelector(`#accept${getCurrentID}`).value = (orderedQty - grnQty).toFixed(2);
        //                     getCurrentRow.querySelector(`#reject${getCurrentID}`).value = 0;
        //                 }else{
        //                     getCurrentRow.querySelector(`#accept${getCurrentID}`).value = event.target.value;
        //                     getCurrentRow.querySelector(`#reject${getCurrentID}`).value = 0;
        //                     getCurrentRow.querySelector(`#exces${getCurrentID}`).value = 0;

        //                 }
        //         }
        //     }
        //     // Recived
        //     if(getID == "recived"){
        //         const orderedQty = getCurrentRow.querySelector(`#ordered${getCurrentID}`).value;
        //         const grnQty = getCurrentRow.querySelector(`#grn${getCurrentID}`).value;
        //         const recived = event.target.value;
        //         if(parseInt(orderedQty) < parseInt(event.target.value) + parseInt(grnQty)){
        //             const exces = (parseInt(recived) - (orderedQty - grnQty)).toFixed(2);

        //             getCurrentRow.querySelector(`#exces${getCurrentID}`).value = exces;
        //             getCurrentRow.querySelector(`#accept${getCurrentID}`).value = (orderedQty - grnQty).toFixed(2);
        //             getCurrentRow.querySelector(`#reject${getCurrentID}`).value = 0;
        //         }else{
        //             getCurrentRow.querySelector(`#accept${getCurrentID}`).value = event.target.value;
        //             getCurrentRow.querySelector(`#reject${getCurrentID}`).value = 0;
        //             getCurrentRow.querySelector(`#exces${getCurrentID}`).value = 0;

        //         }
        //     }
        //     // Accept
        //     getID = event.target.id.slice(0, 6);
        //     // if(getID == "accept"){
        //     //     const accept = event.target.value;
        //     //     const recived = getCurrentRow.querySelector(`#recived${getCurrentID}`).value;
        //     //     if(recived < accept){
        //     //         alert(`Please Enter Less then or Equal ${recived}`);
        //     //         event.target.value = 0;
        //     //     }
        //     // }
        //     // Reject
        //     if(getID == "reject"){
        //         const orderedQty = getCurrentRow.querySelector(`#ordered${getCurrentID}`).value;
        //         const grnQty = getCurrentRow.querySelector(`#grn${getCurrentID}`).value || 0;
        //         const reject = event.target.value;
        //         const recived2 =  getCurrentRow.querySelector(`#recived${getCurrentID}`).value;
        //         const exces = recived2 - (orderedQty - grnQty);
        //         console.log(recived2);
        //         console.log(reject);
                
        //         const accept = recived2 - exces;
        //         if(recived2 < parseInt(event.target.value)){
        //             alert(`Please Enter Less then or Equal ${recived2}`);
        //             event.target.value = 0;
        //             getCurrentRow.querySelector(`#exces${getCurrentID}`).value = exces;
        //             getCurrentRow.querySelector(`#accept${getCurrentID}`).value = accept;
        //         }else{
        //             const getRejectValue = exces - reject;
        //             alert(getRejectValue);
        //             if(getRejectValue <= 0){
        //                 const getVal= accept + getRejectValue;
        //                 getCurrentRow.querySelector(`#accept${getCurrentID}`).value = getVal;
        //                 getCurrentRow.querySelector(`#exces${getCurrentID}`).value = 0;
        //             }
        //             else{
        //                 getCurrentRow.querySelector(`#exces${getCurrentID}`).value = getRejectValue;
        //                 getCurrentRow.querySelector(`#accept${getCurrentID}`).value = accept;
                        
        //             }
        //             // }
        //             // const accept = recived - reject;
        //         }
        //     }
        // })
        
//         const action = document.getElementById("buttonContainer");
//         action.addEventListener("click", (e) => {



//             const postPurchaseOrder = document.getElementById("poId").value;
//             const postFinanceType = document.getElementById("finance").value;
//             const postWarehouse = document.getElementById("warehouse").value;
//             const postStorage = document.getElementById("storage").value;
//             const postInvoiceNo = document.getElementById("invoice").value;
//             let postInvoiceDate = document.getElementById("invoiceDate").value;
//             let postChellanNo = document.getElementById("ChellanNo").value;
//             let postFinChellanNo =document.getElementById("finChellanNo").value;
//             const postGateNo = document.getElementById("gateNo").value;
// console.log(postInvoiceDate);

// let today = new Date(postInvoiceDate);

// // Define an array of month names
// let monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
//                   "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// // Format the date
// postInvoiceDate = String(today.getDate()).padStart(2, '0') + '-' + 
//     monthNames[today.getMonth()] + '-' + 
//     today.getFullYear();


//             if(postFinanceType == "Self"){
//                 postFinChellanNo = null;
//             }
//             else{
//                  postChellanNo = null;        
//             }
//             // get subform values
//             const Subform = [];
            
//             const subform = document.getElementById("tablebody");
//             const rows = subform.querySelectorAll('tr');
            
//             // Define an array of month names
//             let today2 = new Date();
                
//                 // Format the date
//                 let formattedDate = String(today2.getDate()).padStart(2, '0') + '-' + 
//                     monthNames[today2.getMonth()] + '-' + 
//                     today.getFullYear();
//             rows.forEach((e,index) =>{
                
//                 console.log(e.querySelector("td #item"+index).value,e.querySelector("td #item"+index).innerText);
//                 const rowData = {
//                     Items : e.querySelector("td #item"+index).value,
//                     Size :  e.querySelector("td #size"+index).value,
//                     Date_field1 : formattedDate,
//                     Ordered_Qty :  e.querySelector("td #ordered"+index).value,
//                     GRN_Recived :     e.querySelector("td #grn"+index).value,
//                     Warehouse_Bin :  e.querySelector("td #bin"+index).value,
//                     Chellan_Qty : e.querySelector("td #chellan"+index).value,
//                     Recived_Qty : e.querySelector("td #recived"+index).value,
//                     Accepted : e.querySelector("td #accept"+index).value,
//                     Rejected : e.querySelector("td #reject"+index).value,
//                     Excess : e.querySelector("td #exces"+index).value,
//                 };
//                 Subform.push(rowData);
//             })

//             if(e.target.id == "submit"){
//                 const Data = {
//                     data:{
//                         Purchase_Order : postPurchaseOrder,
//                         Financiar_Type : postFinanceType,
//                         Warehouse : postWarehouse,
//                         Storage : postStorage,
//                         Invoice_No : postInvoiceNo,
//                         Chellan_No : postChellanNo,
//                         Financiar_Challan_No : postFinChellanNo,
//                         Invoice_Date : postInvoiceDate,
//                         Gate_No : postGateNo,
//                         GRN_Item : Subform
//                     }
//                 }
//                 config = {     
//                     appName : "girish-exports",
//                     formName : "Goods_Recived_Note",
//                     data : Data
//                     } 
//                      //add record API
//                      ZOHO.CREATOR.API.addRecord(config).then(function(response){
//                         try {
//                             console.log(response);
                            
//                         } catch (err) {
//                            console.log(err);
//                         }
//                     });
//             }
//             if(e.target.id == "reset"){
//                 location.reload();
//             }
            
//         })
        
        
    });

    //  -------- For GON ------

    // getPo.addEventListener("change", () => {
    //     // console.log(getPo.value);
    //     filterPO = getAllPlanSheet.filter(obj => obj.ID == getPo.value);
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