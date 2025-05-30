ZOHO.CREATOR.init()
    .then(async function () {
        let allStock = [];
        let allStockItems = [];
        var queryParams = await ZOHO.CREATOR.UTIL.getQueryParams();
        const setCriteria = "Status == Confirm && Outward_Status != Fully Sent";
        pageNumber = 1;
        async function initValues(pageNumber) {
            config = {
                appName: "girish-exports",
                reportName: "All_Open_Stocks",
                criteria: "(Status == \"Confirm\" && Outward_Status != \"Fully Sent\")",
                page: pageNumber,
                pageSize: 200
            }

            await ZOHO.CREATOR.API.getAllRecords(config).then(function (response) {
                allStock = response.data;
                if (response.data.length == 200) {
                    pageNumber += 1;
                    initValues(pageNumber);
                }
                else {
                    allStock.reverse();
                    displayValue(allStock);
                }
            });

        }
        initValues(1)

        const selectField = document.getElementById("osValues");
        function displayValue(val) {
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
                criteria: "(Open_Stock == " + e.target.value + ")",
                page: pageNumber,
                pageSize: 200
            }

            await ZOHO.CREATOR.API.getAllRecords(config).then(function (response) {
                allStockItems = response.data.reverse();
            });
            tableValues(allStockItems);
        })





        async function tableValues(val) {
            // console.log(val, "running");

            const tableBody = document.getElementById("tableBody");
            const publishKey = "0UA13H0KaNAkEe2BkTj3FYxTb0hKhaE0FyuxKmq13Cx9xGH9mHMxGSYCfJ5WRhUGa5SrwCqPVS9usDjqQF8zk5fXtatYChn9Y8ab";
            tableBody.innerHTML = "";
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
                    <p id="qty${e.ID}" type="text" class="relative py-3 px-2 w-full bg-white rounded shadow-inner border border-gray-200 outline-none text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:shadow-outline">${e.Qty}</p>
                </td>
                <td class=" px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <div class="relative inline-block w-full">
                        <select id="warehouse${e.ID}"
                            class="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-2 px-3 pr-8 rounded leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                            <option value="">Select</option>
                            <option >MADDUR</option>
                            <option>CHAMRAJNAGAR</option>
                        </select>
                        <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg class="fill-current h-4 w-4" viewBox="0 0 20 20">
                            <path d="M5.5 7l4.5 4.5L14.5 7z" />
                            </svg>
                        </div>
                    </div>
                </td>
                <td class=" px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <input id="outward${e.ID}" type="text" class="relative py-3 px-2 w-full bg-white rounded shadow-inner border border-gray-200 outline-none text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:shadow-outline" value='' required oninput="this.value = this.value.replace(/[^0-9]/g, '')"/>
                </td>
                <td class=" px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <div class="relative inline-block w-full">
                        <select id="merchand${e.ID}"
                            class="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-2 px-3 pr-8 rounded leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                            <option value="">Select</option>
                            <option>ROOPA S</option>
                            <option>SANJAY M</option>
                            <option>C S SUNITHA</option>
                            <option>LAKSHMI</option>
                            <option>HEMALATHA L</option>
                            <option>BHOMIKA K U </option>
                            <option>SHRUTHI U C</option>
                            <option>REKHAVATHI U S</option>
                            <option>MANJULA C</option>
                            <option>SHRUTHI T R</option>
                            <option>Sunil Kumar R</option>
                        </select>
                        <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg class="fill-current h-4 w-4" viewBox="0 0 20 20">
                            <path d="M5.5 7l4.5 4.5L14.5 7z" />
                            </svg>
                        </div>
                    </div>
                </td>
                <td class=" px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <input id="eo${e.ID}" type="text" class="relative py-3 px-2 w-full bg-white rounded shadow-inner border border-gray-200 outline-none text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:shadow-outline" value='' />
                </td>
                
            `
                tableBody.appendChild(row);
            });
        }
        document.getElementById("tableBody").addEventListener("change", (e) => {
            const idVal = e.target.closest("tr").id;
            if ("outward" + idVal == e.target.id) {
                // console.log("run");

                const qty = document.getElementById("qty" + idVal).innerHTML;
                const outwardQty = e.target.value;
                if (parseInt(qty) < parseInt(outwardQty)) {
                    alert("Please Check Stock Qty & Outward Qty");
                    e.target.value = null;
                }

            }
        })
        document.getElementById("Update").addEventListener("click", () => {
            const subform = []
            const CreateRecord = [];
            document.querySelectorAll("#tableBody tr").forEach((e) => {
                // console.log(e.id);
                imageFilter = allStockItems.filter(obj => obj.ID == e.id);
                // console.log(imageFilter[0].Image);
                const Qty = document.getElementById("qty" + e.id).innerHTML || 0;
                const outwardQty = document.getElementById("outward" + e.id).value || 0;
                const warehouse = document.getElementById("warehouse" + e.id).value || 0;
                const merchand = document.getElementById("merchand" + e.id).value || 0;
                const eo = document.getElementById("eo" + e.id).value;
                console.log(outwardQty, warehouse, merchand,parseInt(Qty));
                if (outwardQty != 0 && warehouse != 0 && merchand != 0) {
                    // console.log("RUN IF");

                    const newMap = {
                        Item: imageFilter[0].ID,
                        Stock_Qty: Qty,
                        Factory: warehouse,
                        Outward_Qty: outwardQty,
                        Merchandiser: merchand,
                        EO: eo
                    }
                    // console.log(newMap);

                    subform.push(newMap);
                    CreateRecord.push(true);
                }
                else {
                    CreateRecord.push(false);
                    // console.log("RUN ELSE");

                }
            })
            console.log(subform);


            if (!CreateRecord.includes(false)) {

                var config = {
                    appName: "girish-exports",
                    formName: "Open_Stock_Outward",
                    data: {
                        data: {
                            Open_Stock: document.getElementById("osValues").value,
                            Outward_Items: subform
                        }
                    }
                }
                ZOHO.CREATOR.API.addRecord(config).then(function (response) {
                    console.log(response);

                    if (response.code == 3000) {
                        console.log("Record added successfully");
                        window.location.reload();
                    }
                });
            }

        })
        document.getElementById("Reset").addEventListener("click", (e) => {
            tableValues(allStockItems);
        })
    });