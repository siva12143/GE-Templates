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
                    console.log(e,"response");
                    
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
                ourRef += "Our_Ref == "+e.display_value;
                if((index +1) != count){
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
            config = {
                appName: "girish-exports",
                reportName: "All_Goods_Outwards_Notes",
                criteria: setCreiteria,
                page: 1,
                pageSize: 200
            }
            await ZOHO.CREATOR.API.getAllRecords(config).then(async function (response) {
                console.log(response.data);
                for(let i = 0; i < response.data.length; i++){
                    GONID+="Goods_Outwards_Notes == "+response.data[i].ID;
                    if(response.data[i+1]){
                        GONID+="||";
                    }
                }
            })
            let gonItem = [];
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
            gonItem.forEach(e => {
                if(e.Items.display_value.includes("MAIN TAG")){
                    console.log(e);
                }
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
                        Category : e.Item_Category.display_value,
                        Category_ID : e.Item_Category.ID,
                        Qty : parseInt(e.Consumption) || 0,
                    }
                }else{
                    productData[key].Qty +=e.Consumption
                    copy +=1;
                }
                totalCount +=1;
            });
            const getAllVal = Object.values(productData);
            // console.log(getAllVal[0]);
            // console.log(totalCount, copy);
            console.log(mergeArray);
            iterateTable(getAllVal);

            const getCategory = document.getElementById("itemCategory");

            getCategory.addEventListener("change",(e) => {
                console.log(e.target.value,);
            // iterateTable(getAllVal);
                const getFilterVal = getAllVal.filter(obj => obj.Category_ID == e.target.value);
                
                iterateTable(getFilterVal);    
            })
            
              function iterateTable(val) {
                const cateList = [];
            const getCategory = document.getElementById("itemCategory");

                const subform = document.getElementById("tablebody");
                subform.innerHTML = "";
                val.forEach(async (e,i) => {
                    console.log(e.Size);

                    
                  // for item category
                  if(!cateList.includes(e.Category_ID) || cateList.length == 0){
                    cateList.push(e.Category_ID);
                    const option = document.createElement("option");
                    option.value = e.Category_ID;
                    option.textContent = e.Category;
                    getCategory.appendChild(option);
                  }
                  let totalIssued = 0;
                  getfilterGON = gonItem.filter(obj => obj.Items.ID == e.Item_ID && obj.Size.ID == e.Size_ID);
                  getfilterGON.forEach(e => {
                    console.log(e.GON_Qty);
                    
                    totalIssued += parseFloat(e.GON_Qty || 0);
                  })
                //   console.log(getfilterGON);
                  console.log(ourRef);
                config2 = {
                    appName: "girish-exports",
                    reportName: "All_Stocks",
                    criteria :ourRef,
                    page: 1,
                    pageSize: 200
                    
                }
                await ZOHO.CREATOR.API.getAllRecords(config2).then(function (response) {
                    console.log("Stock",response.data);
                });
                // console.log(newObj);
                  
                  
  
                  // for item category
  
  
                  const row = document.createElement("tr");
                  row.id = "row"+i;
                  row.innerHTML = `
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
                  <td  class="border-t-2 border-gray-200 p-2">
                      <input type="text" id="orderQty${i}" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value="${e.Qty}" disabled />
                  </td>
                  <td  class="border-t-2 border-gray-200 p-2">
                      <input type="text" id="gonQty${i}" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value="${totalIssued}" disabled/>
                  </td>
                  <td  class="border-t-2 border-gray-200 p-2">
                      <input type="text" id="issueQty${i}" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value="" />
                  </td>
                  `;
                  subform.appendChild(row);
  
              })
              }

        }) 
        document.getElementById("buttonContainer").addEventListener("click",(e)=>{
            console.log(e.target);

            const planSheet = document.getElementById("planSheet").value || null;
            const fromWarehouse = document.getElementById("fromWarehouse").value || null;
            const toWarehouse = document.getElementById("toWarehouse").value || null;
            const Order = document.getElementById("order");
            const itemCategory = document.getElementById("itemCategory").value || null;
            const orderID = [];
            const orderSpan = Array.from(Order.getElementsByTagName('span'))
            orderSpan.forEach(e=> {
                orderID.push(e.id);
                
            })
            const subform = [];

            const tablebody = document.getElementById("tablebody");
            const tablelength = tablebody.getElementsByTagName("tr").length;
            // for(let i= 0; i<tablelength; i++){
            //     const newObj = {
            //         Item : document.getElementById("item"+i).value, 
            //         Size : document.getElementById("size"+i).value,
            //         Order_Qty : document.getElementById("orderQty"+i).value,
            //         Issued_Qty : document.getElementById("issueQty"+i).value,
            //     }
            //     subform.push(newObj);
            // }

            if(e.target.id == "submit"){
                console.log("Plan Sheet", planSheet, "fromWarehouse", fromWarehouse,"toWarehouse", toWarehouse,"Order", Order.children[0], "item Category",itemCategory);
                console.log(subform);
                const uploadData = {
                    data : {
                        Plan_Sheet : planSheet,
                        From_Warehouse : fromWarehouse,
                        Business_Warehouse : toWarehouse,
                        Order : orderID,
                        Show_Items : true,
                        Item_Category : itemCategory,
                        GON_Items : subform
                    }
                }
                console.log(uploadData);
                
                config = {
                    appName: "girish-exports",
                    formName: "Goods_Outwards_Notes",
                    data : uploadData
                }
                //add record API
                ZOHO.CREATOR.API.addRecord(config).then(async function(response){
                    // console.log(response);
                    if(response.data.ID){
                        for(let i= 0; i<tablelength; i++){
                            const newObj = {
                                data:{
                                    Items : document.getElementById("item"+i).value, 
                                    Size : document.getElementById("size"+i).value,
                                    Order_Qty : document.getElementById("orderQty"+i).value,
                                    Issued_Qty : document.getElementById("issueQty"+i).value,
                                    GON_Qty : document.getElementById("gonQty"+i).value,
                                    Goods_Outwards_Notes : response.data.ID,
                                }
                            }
                            // stock
                            config2 = {
                                appName: "girish-exports",
                                formName: "G_O_N_Items",
                                data : newObj
                            }
                            ZOHO.CREATOR.API.addRecord(config2).then(async function(response){
                                console.log(response);
                                
                            })
                            
                        }

                    }
                });
                
                
            }

            else if(e.target.id == "reset"){
                console.log("Reset Run");
            }
            
        })
        
    // config = {
    //     appName: "girish-exports",
    //     formName: "Goods_Outwards_Notes",
    //     data : uploadData
    // }
    //update record API
    // ZOHO.CREATOR.API.updateRecord(config).then(function(response){
    //  //callback block
    // });

    })