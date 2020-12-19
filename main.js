//  Item Controller 

const ItemController = (function(){
class Item {
    constructor(id, name, value, type){
        this.id = id;
        this.name = name;
        this.value = value;
        this.type = type;
    }

};

// state object
const state = {
data: [],
currentItem: null,
totalIncome: 0,
totalExpense: 0,
budget: 0

};

//  outside
return {
state,

// create newItem in the constructor
newItem: function(name, value, type) {
 const uniqId = (new Date().getTime()).toString(36);
 if(type !== 'Select') {
    const item = new Item(uniqId, name, value, type);
    state.data.push(item);
    
    return item;
 }  
},


// calculate budget
calcBudget: () => {
    let allInc = 0;
    let allExp = 0; 
if(state.data.length === 0) {
    state.budget = 0;
    state.totalIncome = 0;
    state.totalExpense = 0;
}

state.data.forEach(curObj => {
   
if(curObj.type === 'income') {
allInc = allInc + parseInt(curObj.value);
} else {
allExp += parseInt(curObj.value);   
}


state.totalIncome = allInc;
state.totalExpense = allExp;

state.budget = allInc - allExp;

});

},



createCurrentItem: (id) => {
let nowItem = null;    
state.data.forEach(curItem => {
if(curItem.id === id) {
    nowItem = curItem;
}

});

state.currentItem = nowItem;
return nowItem;

},



replaceWithUpdate: (name, value, type) => {
const id = state.currentItem.id;
let obj = null;
state.data.forEach(curItem => {
if(curItem.id === id){
    curItem.name = name;
    curItem.value = value;
    curItem.type = type;
    obj = curItem;
    
}
});

return obj;

},


deleteItem: () => {

const id = state.currentItem.id;

state.data.forEach((curItem, index) => {
    if(curItem.id === id) {
        state.data.splice(index, 1);
    }
})

},


clearAllData: () => {
state.data = [];
state.currentItem = null;
state.totalIncome = 0;
state.totalExpense = 0;
state.budget = 0;

}
 



};


})();







//  UI Controller 
const UIcontroller = (function(){
const DOMelements = {
    submitBtn: document.getElementById('submit-btn'),
    inputVal: document.getElementById('input-amount'),
    inputName: document.getElementById('input-name'),
    typeSel: document.getElementById('type-list'),
    incomeList: document.getElementById('inc-list'),
    expenseList: document.getElementById('exp-list'),
    budgetUI: document.getElementById('budget'),
    totalIncUI: document.getElementById('inc-value'),
    totalExpUI: document.getElementById('exp-value'),
    listClass: document.querySelector('.list'),
    updateBtn: document.getElementById('update-btn'),
    removeBtn: document.getElementById('remove-btn'),
    clearBtn: document.getElementById('clear-btn')
    // editBtn = document.querySelector('.edit')
};






// return out side of iffi function
return {

DOMelements,

// get the input
getInput: () =>{
 return {
    inputVal: DOMelements.inputVal.value,
    inputName: DOMelements.inputName.value,
 }

},

// display the item
displayItem: (item) => {
let markUp;
if(item.type === 'income') {

markUp = `
             <ul id="ul-list-inc">
                <li id="${item.id}" type="${item.type}"><strong>
                    <span class="income-color">${item.name} &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</span>${item.value} &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                 <button class="edit"><i class="fas fa-edit"></i></button>
                </strong>
                </li>             
             </ul> 
`;    

 DOMelements.incomeList.insertAdjacentHTML('beforeend', markUp);

} else if (item.type === 'expense') {

markUp = `        
            <ul id="ul-list-exp">
                <li id="${item.id}" type="${item.type}"><strong>
                    <span class="expense-color">${item.name} &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</span>${item.value} &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                 <button class="edit"><i class="fas fa-edit"></i></button>
                </strong>
                </li>
 
            </ul>

`;

DOMelements.expenseList.insertAdjacentHTML('beforeend', markUp);

}   

},


// Clear The input Fields
clearInputField: () => {
DOMelements.inputName.value = '';
DOMelements.inputVal.value = '';
DOMelements.typeSel.options[0].selected = true ;

// hide buttons
DOMelements.updateBtn.style.visibility = 'hidden';
DOMelements.removeBtn.style.visibility = 'hidden';
DOMelements.submitBtn.style.visibility = 'visible';
DOMelements.clearBtn.style.visibility = 'visible';

},


displayChart: (totalincome, totalexpense) => {
let myChart = document.getElementById('my-chart').getContext('2d');


new Chart(myChart, {
    type: 'pie',
    data: {
        labels: ['Income', 'Expense'],
        datasets: [{
            label: 'Budget',
            data: [
                totalincome,
                totalexpense
            ],
            backgroundColor: [
                'rgb(85, 158, 16, 0.7)',
                'rgb(163, 4, 4, 0.7)'
            ],
            borderWidth: 1,
            
            hoverBorderWidth: 1,
            hoverBorderColor: 'black'
        }]
    },
    options: {
        title: {
            display: true,
            text: "Budget Chart",
            fontSize: 18,
        }
    }
})



// 
},


updateBudgetInUI: (budget, income, expense) => {
DOMelements.budgetUI.innerText = `$ ${budget}`;
DOMelements.totalIncUI.innerHTML = `<div id="inc-value">&nbsp;$ &nbsp;${income}</div>`;
DOMelements.totalExpUI.innerHTML = `<div id="exp-value">&nbsp;$ &nbsp;${expense}</div>`;

},


showAlert: () => {

    swal("Error!", "Empty Field Detected!", "error");
},

showWarning: () => {
   
},


buttonsPopUp: (name, value, type) => {
    DOMelements.updateBtn.style.visibility = 'visible';
    DOMelements.removeBtn.style.visibility = 'visible';
    DOMelements.submitBtn.style.visibility = 'hidden';
    DOMelements.clearBtn.style.visibility = 'hidden';

    // field restoring
DOMelements.inputName.value = name;
DOMelements.inputVal.value = value;

if(type === 'income') {
    DOMelements.typeSel.options[1].selected = true ;
} else if (type === 'expense') {
    DOMelements.typeSel.options[2].selected = true ;
}

},



displayUpdatedItem: (updatedItem) => {

const arrayListsInc = Array.from(document.querySelectorAll('#ul-list-inc'));    
const arrayListsExp = Array.from(document.querySelectorAll('#ul-list-exp')); 

if(updatedItem.type === 'income') {
    arrayListsInc.forEach(curLiInc => {
        if(curLiInc.childNodes[1].id === updatedItem.id) {
            curLiInc.innerHTML = `
            <ul id="ul-list-inc">
                <li id="${updatedItem.id}" type="${updatedItem.type}"><strong>
                    <span class="income-color">${updatedItem.name} &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</span>${updatedItem.value} &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                 <button class="edit"><i class="fas fa-edit"></i></button>
                </strong>
                </li>             
             </ul> 
    `;
        }
       
    });
} else if(updatedItem.type === 'expense'){
 arrayListsExp.forEach(curLiExp => {
    if(curLiExp.childNodes[1].id === updatedItem.id) {
        curLiExp.innerHTML = `
        <ul id="ul-list-exp">
            <li id="${updatedItem.id}" type="${updatedItem.type}"><strong>
                <span class="expense-color">${updatedItem.name} &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</span>${updatedItem.value} &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
             <button class="edit"><i class="fas fa-edit"></i></button>
            </strong>
            </li>

        </ul>
`;
    }
    

 });
}

},

deleteItemUI: (id) => {
const arrayListsInc = Array.from(document.querySelectorAll('#ul-list-inc'));    
const arrayListsExp = Array.from(document.querySelectorAll('#ul-list-exp')); 

arrayListsInc.forEach(curItem => {

// console.log(curItem.childNodes[1].id);  === get the id from ul li with javascript
if(curItem.childNodes[1].id === id) {
    curItem.removeChild(curItem.childNodes[1]);
}

});

arrayListsExp.forEach(curItem => {
    if(curItem.childNodes[1].id === id) {
        curItem.removeChild(curItem.childNodes[1]);
    }
});

},


clearAllUI: () => {
    // clear lists
    const arrayListsInc = Array.from(document.querySelectorAll('#ul-list-inc'));    
    const arrayListsExp = Array.from(document.querySelectorAll('#ul-list-exp')); 
    
    arrayListsInc.forEach(curItem => {
        curItem.remove();
    });
    
    arrayListsExp.forEach(curItem => {
        curItem.remove(); 
    });



}


};


})();





//  Main Controller 
const MainController = (function(ItemController, UIcontroller){
// Dom Elemets call 
const DOMelements = UIcontroller.DOMelements;

// Functions

const getInput = e => {
e.preventDefault();



const inputsObj = UIcontroller.getInput();

// get type
const selected = DOMelements.typeSel.options[DOMelements.typeSel.selectedIndex].value;


if(inputsObj.inputName === '' || inputsObj.inputVal === '' || selected === 'Select') {
  UIcontroller.showAlert();
}


// Create new Object through Class
const newItemObj = ItemController.newItem(inputsObj.inputName, inputsObj.inputVal, selected);

// call display item function
UIcontroller.displayItem(newItemObj);

// calculate budget
ItemController.calcBudget();


// display Chart
UIcontroller.displayChart(ItemController.state.totalIncome, ItemController.state.totalExpense);

// clear fields
UIcontroller.clearInputField();

//  Display budget in UI
UIcontroller.updateBudgetInUI(ItemController.state.budget, ItemController.state.totalIncome, ItemController.state.totalExpense);



// state console log
//  console.log(ItemController.state);


};



////////// edit Item button /////////////////
const editItem = event => {
event.preventDefault();
if(event.target.closest('.edit')) {
const id = (event.target.parentElement.parentElement.parentElement.id);
const selectedItem = ItemController.createCurrentItem(id);

// all buttons pop up
UIcontroller.buttonsPopUp(selectedItem.name, selectedItem.value, selectedItem.type);
}

};

////////// Update Item  /////////////////

const updateItem = e => {
e.preventDefault();
const inputsObj = UIcontroller.getInput();
// get type
const selected = DOMelements.typeSel.options[DOMelements.typeSel.selectedIndex].value;
if(inputsObj.inputName === '' || inputsObj.inputVal === '' || selected === 'Select') {
    UIcontroller.showAlert();
  }
  // replace old one
 const UpdatedItemObj = ItemController.replaceWithUpdate(inputsObj.inputName, parseInt(inputsObj.inputVal), selected);
 
// update the budget calculation
ItemController.calcBudget();


// display Item
UIcontroller.displayUpdatedItem(UpdatedItemObj);

// display Chart
UIcontroller.displayChart(ItemController.state.totalIncome, ItemController.state.totalExpense);

//  Display budget in UI
UIcontroller.updateBudgetInUI(ItemController.state.budget, ItemController.state.totalIncome, ItemController.state.totalExpense);

  // clear field
  UIcontroller.clearInputField();

};




//  Delete Item
const deleteItem = (e) => {
e.preventDefault();

// clear field
UIcontroller.clearInputField();

// delete Item from state
ItemController.deleteItem();
// calculate budget
ItemController.calcBudget();

 
//  clear pie chart
UIcontroller.displayChart(ItemController.state.totalIncome, ItemController.state.totalExpense);

// delete the item from UI
const id = ItemController.state.currentItem.id;
UIcontroller.deleteItemUI(id);
// display the updated budget

//  Display budget in UI
UIcontroller.updateBudgetInUI(ItemController.state.budget, ItemController.state.totalIncome, ItemController.state.totalExpense);



};


//  Clear all Items
const clearAll = e => {
e.preventDefault();
swal({
    title: "Are you sure?",
    text: "Once deleted, you will not be able to recover the budget lists!",
    icon: "warning",
    buttons: true,
    dangerMode: true,
  })
  .then((willDelete) => {
    if (willDelete) {
      swal("Poof! Your lists has been deleted!", {
        icon: "success",
      });

// clear all from data
ItemController.clearAllData();

//  Display budget in UI
UIcontroller.updateBudgetInUI(ItemController.state.budget, ItemController.state.totalIncome, ItemController.state.totalExpense);
//  clear pie chart
UIcontroller.displayChart(ItemController.state.totalIncome, ItemController.state.totalExpense);
//  Clear all from list
UIcontroller.clearAllUI();


    } else {
      swal("Your lists are safe!");
    }
  });



};





// Event Listners
DOMelements.submitBtn.addEventListener('click', getInput);
DOMelements.listClass.addEventListener('click', editItem);
DOMelements.updateBtn.addEventListener('click', updateItem);
DOMelements.removeBtn.addEventListener('click', deleteItem);
DOMelements.clearBtn.addEventListener('click', clearAll);


})(ItemController, UIcontroller);




// UIcontroller.displayItem(UpdatedItemObj); line 356

